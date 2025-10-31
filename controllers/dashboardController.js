const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const getDashboardStats = asyncHandler(async (req, res) => {
	// Stores
	const approvedStoresQuery = { onboardingStatus: 'Approved' };
	const pendingStoresQuery = { onboardingStatus: { $in: ['Pending', 'Submitted', 'Verified'] } };

	const [
		totalStores,
		approvedStores,
		pendingStores,
		totalProducts,
		totalUsers,
		staffUsers,
		totalOrders,
		liveOrders,
	] = await Promise.all([
		Store.countDocuments({}),
		Store.countDocuments(approvedStoresQuery),
		Store.countDocuments(pendingStoresQuery),
		Product.countDocuments({}),
		User.countDocuments({}),
		User.countDocuments({ role: { $in: ['staff', 'manager', 'agent'] } }),
		Order.countDocuments({}),
		Order.countDocuments({ orderStatus: { $in: ['Created', 'Approved', 'Billed', 'Enroute'] } }),
	]);

	const stats = {
		totalStores,
		approvedStores,
		pendingStores,
		totalProducts,
		totalUsers,
		staffUsers,
		totalOrders,
		liveOrders,
	};

	res.json(stats);
});

module.exports = { getDashboardStats };


