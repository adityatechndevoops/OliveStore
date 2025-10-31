// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler'); // Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.

// Install this: npm install express-async-handler
// This helps avoid repetitive try-catch blocks in async controllers

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the token is sent in the headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 1. Get token from header (e.g., "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get user from the token's ID
            // Attach the user to the request object, but exclude the password
            req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        throw new Error('Not authorized, no token');
    }
});


// Check the user type if authenticated

// Checks if the user is a merchant
const isMerchant = (req, res, next) => {
  // This must run AFTER 'protect', as it depends on req.user
  if (req.user && req.user.role === 'merchant') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Merchant role required.' });
  }
};

// Checks if the user is an admin or staff (for your dashboard)
const isStaffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or Staff role required.' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, isMerchant, isStaffOrAdmin, isAdmin };