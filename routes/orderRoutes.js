// server/routes/orderRoutes.js
const express = require('express');
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    addOrderComment,
    updateRefundSummary,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(protect, admin, createOrder); // Only admin can create orders for now

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

router.route('/:id/comment')
    .post(protect, addOrderComment);

router.route('/:id/refund')
    .put(protect, admin, updateRefundSummary);


module.exports = router;