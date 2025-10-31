const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

function parseArgs() {
	const args = process.argv.slice(2);
	const result = {};
	for (const arg of args) {
		const [key, value] = arg.split('=');
		if (key && value) {
			result[key.replace(/^--/, '')] = value;
		}
	}
	return result;
}

(async () => {
	try {
		await connectDB();
		const { email, phone } = parseArgs();
		if (!email && !phone) {
			console.error('Usage: npm run make-admin -- --email=user@example.com OR --phone=9999999999');
			process.exit(1);
		}
		const query = email ? { email } : { phoneNumber: phone };
		const user = await User.findOne(query);
		if (!user) {
			console.error('User not found');
			process.exit(1);
		}
		user.role = 'admin';
		await user.save();
		console.log(`User ${user.email || user.phoneNumber} promoted to admin.`);
		process.exit(0);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();


