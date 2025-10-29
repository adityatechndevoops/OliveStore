// server/controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Store = require('../models/Store'); // Needed to validate store existence

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
    // You can add filtering/pagination here based on req.query
    const orders = await Order.find({})
        .populate('store', 'storeName contactNumber') // Populate store info
        .populate('comments.user', 'name'); // Populate user who made comments
    res.json(orders);
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('store', 'storeName ownerName contactNumber address')
        .populate('comments.user', 'name');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private/Admin (or potentially by store owners if we build that interface)
const createOrder = asyncHandler(async (req, res) => {
    const {
        storeId,
        orderId,
        customerName,
        customerContact,
        deliveryAddress,
        items,
    } = req.body;

    const storeExists = await Store.findById(storeId);
    if (!storeExists) {
        res.status(404);
        throw new Error('Associated store not found');
    }

    // Calculate total amount from items
    const totalAmount = items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
    );

    const order = new Order({
        store: storeId,
        orderId,
        customerName,
        customerContact,
        deliveryAddress,
        items,
        totalAmount,
        orderProgress: [{ status: 'Created', remark: 'Order initiated' }],
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, remark } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = status || order.orderStatus;
        order.orderProgress.push({ status, remark, timestamp: new Date() }); // Add to progress history

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Add a comment to an order
// @route   POST /api/orders/:id/comment
// @access  Private
const addOrderComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        order.comments.push({ user: req.user._id, comment }); // Use req.user._id from protect middleware
        const updatedOrder = await order.save();
        res.status(201).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update refund summary
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
const updateRefundSummary = asyncHandler(async (req, res) => {
    const { postDeliveryRefunds, totalRefund, resolvedIssues, rottenItemCount, damagedItemCount } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        order.refundSummary.postDeliveryRefunds = postDeliveryRefunds !== undefined ? postDeliveryRefunds : order.refundSummary.postDeliveryRefunds;
        order.refundSummary.totalRefund = totalRefund !== undefined ? totalRefund : order.refundSummary.totalRefund;
        order.refundSummary.resolvedIssues = resolvedIssues !== undefined ? resolvedIssues : order.refundSummary.resolvedIssues;
        order.refundSummary.rottenItemCount = rottenItemCount !== undefined ? rottenItemCount : order.refundSummary.rottenItemCount;
        order.refundSummary.damagedItemCount = damagedItemCount !== undefined ? damagedItemCount : order.refundSummary.damagedItemCount;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    addOrderComment,
    updateRefundSummary,
};