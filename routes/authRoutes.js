// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
    registerUser,
    authUser,
    getUserProfile,
    getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


// @route   POST /api/auth/register
router.post('/register', registerUser);
// @route   POST /api/auth/login
router.post('/login', authUser);
// @route   GET /api/auth/profile
// @desc    Get the profile of the currently logged-in user
// @access  Private (notice we add the 'protect' middleware)
router.route('/profile').get(protect, getUserProfile); // Protected route
// @route   GET /api/auth/me
// @desc    Get the profile of the currently logged-in user
// @access  Private (notice we add the 'protect' middleware)
router.route('/me').get(protect, getMe);

module.exports = router;