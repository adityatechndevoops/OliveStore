const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const listUsers = asyncHandler(async (req, res) => {
	const query = {};
	if (req.query.q) {
		query.$or = [
			{ name: { $regex: req.query.q, $options: 'i' } },
			{ email: { $regex: req.query.q, $options: 'i' } },
			{ phoneNumber: { $regex: req.query.q, $options: 'i' } }
		];
	}
	const page = parseInt(req.query.page || '1', 10);
	const limit = parseInt(req.query.limit || '10', 10);
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		User.find(query).select('-password').skip(skip).limit(limit),
		User.countDocuments(query)
	]);
	res.json({ items, page, limit, total });
});

const updateUserRole = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).json({ message: 'User not found' });
	const { role } = req.body;
	if (!role) return res.status(400).json({ message: 'Role is required' });
	user.role = role;
	await user.save();
	res.json({ message: 'Role updated', user: { _id: user._id, name: user.name, role: user.role, email: user.email, phoneNumber: user.phoneNumber } });
});

const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).json({ message: 'User not found' });
	await user.deleteOne();
	res.json({ message: 'User deleted' });
});

module.exports = { listUsers, updateUserRole, deleteUser };


