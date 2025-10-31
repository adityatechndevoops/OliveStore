// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();

const {
    getOrders,
    getAllOrders,
    getMyStoreOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    addOrderComment,
    updateRefundSummary,
} = require('../controllers/orderController');

const { 
    protect, 
    isAdmin,
    isMerchant, 
    isStaffOrAdmin 
} = require('../middleware/authMiddleware');

// --- FUTURE MICROSERVICE NOTE ---
// When this becomes a separate "Order Service", all these routes will
// move to that new server. Your "API Gateway" (your main server)
// will simply forward requests to it. This structure is perfect for that.

// General Order Routes
router.route('/')
    .get(protect, isStaffOrAdmin, getAllOrders)    // Get all orders (Admin Dashboard)
    .post(protect, isMerchant, createOrder);       // Create order (Merchant only)

// Merchant-specific Routes
router.get('/me', protect, isMerchant, getMyStoreOrders);  // Get merchant's orders

// Order-specific Routes
router.route('/:id')
    .get(protect, getOrderById);                   // Get single order

router.route('/:id/status')
    .put(protect, updateOrderStatus);              // Update order status

router.route('/:id/comment')
    .post(protect, addOrderComment);               // Add comment to order

router.route('/:id/refund')
    .put(protect, isAdmin, updateRefundSummary);     // Update refund details

module.exports = router;
