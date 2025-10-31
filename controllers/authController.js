// server/controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * @desc    Generate JWT
 * @param   {string} id - The user ID
 * @returns {string} The signed JWT
 */

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (should be restricted in production, e.g., only admin can create users)
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, phoneNumber, password, role } = req.body;
    
        const userExists = await User.findOne({ email });
    
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
    
        const user = await User.create({
            name,
            email,
            phoneNumber,
            password,
            role: role || 'new', // Default role if not provided
        });
    
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    try {
<<<<<<< HEAD
        const { phoneNumber, email, password } = req.body;

        if ((!phoneNumber && !email) || !password) {
          return res.status(400).json({ message: 'Please provide email or phone number, and password' });
        }

        // Find user by phone OR email
        const query = phoneNumber ? { phoneNumber } : { email };
        const user = await User.findOne(query);
=======
        const { phoneNumber, password } = req.body;
        // const { email, password } = req.body;
    
        // 1. Check for phone and password
        if (!phoneNumber || !password) {
          return res.status(400).json({ message: 'Please provide phone number and password' });
        }
    
        // 2. Find user by phone number
        const user = await User.findOne({ phoneNumber });
        // const user = await User.findOne({ email });
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
    
        // 3. If user exists AND password matches
        // We use the comparePassword method we defined in User.js
        if (user && (await user.comparePassword(password))) {
<<<<<<< HEAD
            const payload = {
=======
            res.status(200).json({
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
<<<<<<< HEAD
            };
            const token = generateToken(user._id);
            // Also set cookie for web GUI usage
            res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
            res.status(200).json({ ...payload, token });
=======
                token: generateToken(user._id),
            });
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
        } else {
            // Use a generic message for security
            res.status(401).json({ message: 'Invalid credentials' });
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(500).json({ message: 'Database Server error', error: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Get current user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler (async (req, res) => {
  // req.user is attached by the authMiddleware
  // We already fetched the user in the middleware, so just return it
  // The password was already deselected in the middleware query
  res.status(200).json(req.user);
});

module.exports = { registerUser, authUser, getUserProfile, getMe };