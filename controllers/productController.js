const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Store = require('../models/Store');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Admin/Staff: list products; Merchant: list own store products
const listProducts = asyncHandler(async (req, res) => {
	const query = {};
	if (req.user.role === 'merchant') {
		// limit to merchant's stores
		query.store = { $in: req.user.stores || [] };
	}
	if (req.query.storeId) query.store = req.query.storeId;
	if (req.query.q) query.name = { $regex: req.query.q, $options: 'i' };
	const page = parseInt(req.query.page || '1', 10);
	const limit = parseInt(req.query.limit || '10', 10);
	const skip = (page - 1) * limit;
	const products = await Product.find(query).populate('store', 'storeName').skip(skip).limit(limit);
	const count = await Product.countDocuments(query);
	res.json({ items: products, page, limit, total: count });
});

const getProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id).populate('store', 'storeName owner');
	if (!product) return res.status(404).json({ message: 'Product not found' });
	// Access control for merchant
	if (req.user.role === 'merchant' && product.store.owner.toString() !== req.user.id) {
		return res.status(403).json({ message: 'Access denied' });
	}
	res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
	const { storeId, name, description, price, stock, imageUrl, category } = req.body;
	if (!storeId || !name || price == null) return res.status(400).json({ message: 'storeId, name, price required' });
	const store = await Store.findById(storeId);
	if (!store) return res.status(404).json({ message: 'Store not found' });
	if (req.user.role === 'merchant' && store.owner.toString() !== req.user.id) {
		return res.status(403).json({ message: 'Access denied' });
	}
	let finalImageUrl = imageUrl;
	if (req.file && req.file.buffer) {
		const uploadResult = await new Promise((resolve, reject) => {
			const folder = `products/${storeId}`;
			const stream = cloudinary.uploader.upload_stream(
				{ folder, resource_type: 'image' },
				(err, result) => err ? reject(err) : resolve(result)
			);
			stream.end(req.file.buffer);
		});
		finalImageUrl = uploadResult.secure_url || uploadResult.url;
	}
	const product = await Product.create({ store: storeId, name, description, price, stock, imageUrl: finalImageUrl, category });
	res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id).populate('store', 'owner');
	if (!product) return res.status(404).json({ message: 'Product not found' });
	if (req.user.role === 'merchant' && product.store.owner.toString() !== req.user.id) {
		return res.status(403).json({ message: 'Access denied' });
	}
	const { name, description, price, stock, imageUrl, active, category } = req.body;
	if (name != null) product.name = name;
	if (description != null) product.description = description;
	if (price != null) product.price = price;
	if (stock != null) product.stock = stock;
	let finalImageUrl = imageUrl;
	if (req.file && req.file.buffer) {
		const uploadResult = await new Promise((resolve, reject) => {
			const folder = `products/${product.store._id}`;
			const stream = cloudinary.uploader.upload_stream(
				{ folder, resource_type: 'image' },
				(err, result) => err ? reject(err) : resolve(result)
			);
			stream.end(req.file.buffer);
		});
		finalImageUrl = uploadResult.secure_url || uploadResult.url;
	}
	if (finalImageUrl != null) product.imageUrl = finalImageUrl;
	if (active != null) product.active = active;
	if (category != null) product.category = category;
	const saved = await product.save();
	res.json(saved);
});

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id).populate('store', 'owner');
	if (!product) return res.status(404).json({ message: 'Product not found' });
	if (req.user.role === 'merchant' && product.store.owner.toString() !== req.user.id) {
		return res.status(403).json({ message: 'Access denied' });
	}
	await product.deleteOne();
	res.json({ message: 'Product deleted' });
});

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };


