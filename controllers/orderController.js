// server/controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Store = require('../models/Store');

/**
 * @desc    Generate a unique, human-readable Order ID
 * @returns {string} A unique ID (e.g., KRN-A8C1)
 */
const generateOrderId = async () => {
    while (true) {
        const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase();
        const orderId = `KRN-${randomPart}`;
        
        const exists = await Order.findOne({ orderId });
        if (!exists) {
            return orderId;
        }
    }
};

/**
 * @desc    Get all orders for admin dashboard
 * @route   GET /api/orders
 * @access  Private (Admin/Staff Only)
 */
const getAllOrders = async (req, res) => {
    try {
        const query = {};
        
        if (req.query.status) {
            query.orderStatus = req.query.status;
        }
        if (req.query.storeId) {
            query.store = req.query.storeId;
        }

        const orders = await Order.find(query)
            .populate('store', 'storeName city')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get all orders for the logged-in merchant
 * @route   GET /api/orders/me
 * @access  Private (Merchant Only)
 */
const getMyStoreOrders = async (req, res) => {
    try {
        if (!req.user.stores || req.user.stores.length === 0) {
            return res.status(200).json([]);
        }

        const orders = await Order.find({ store: { $in: req.user.stores } })
            .sort({ createdAt: -1 })
            .limit(50);
            
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Get a single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (Admin/Staff OR Merchant owner)
 */
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('store', 'storeName address owner')
            .populate('comments.user', 'name');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (
            req.user.role === 'admin' ||
            req.user.role === 'staff' ||
            (req.user.role === 'merchant' && order.store.owner.toString() === req.user.id)
        ) {
            res.status(200).json(order);
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (Merchant Only)
 */
const createOrder = async (req, res) => {
    try {
        const { storeId, customer, items, totalAmount, paymentDetails } = req.body;

        if (!storeId || !customer || !items || !totalAmount || !paymentDetails) {
            return res.status(400).json({ message: 'Please provide all order details' });
        }

        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        if (store.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only create orders for your own store' });
        }
        
        const newOrderId = await generateOrderId();

        const order = await Order.create({
            orderId: newOrderId,
            store: storeId,
            customer,
            items,
            totalAmount,
            paymentDetails,
            orderStatus: 'Pending',
            orderProgress: [{ status: 'Created', remark: 'Order initiated' }]
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin/Staff OR Merchant owner)
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { status, remark } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const order = await Order.findById(req.params.id)
            .populate('store', 'owner');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (
            !(req.user.role === 'admin' ||
            req.user.role === 'staff' ||
            (req.user.role === 'merchant' && order.store.owner.toString() === req.user.id))
        ) {
            return res.status(403).json({ message: 'Access denied' });
        }

        order.orderStatus = status;
        order.orderProgress.push({ status, remark, timestamp: Date.now() });

        // Update timestamps based on status
        switch (status) {
            case 'Accepted':
                order.timestamps.acceptedAt = Date.now();
                break;
            case 'Preparing':
                order.timestamps.preparedAt = Date.now();
                break;
            case 'Out for Delivery':
                order.timestamps.pickedUpAt = Date.now();
                break;
            case 'Delivered':
                order.timestamps.deliveredAt = Date.now();
                break;
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * @desc    Add comment to order
 * @route   POST /api/orders/:id/comment
 * @access  Private
 */
const addOrderComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.comments.push({ user: req.user._id, comment });
        const updatedOrder = await order.save();
        res.status(201).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

/**
 * @desc    Update refund summary
 * @route   PUT /api/orders/:id/refund
 * @access  Private/Admin
 */
const updateRefundSummary = asyncHandler(async (req, res) => {
    const { postDeliveryRefunds, totalRefund, resolvedIssues, rottenItemCount, damagedItemCount } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.refundSummary = {
            ...order.refundSummary,
            postDeliveryRefunds: postDeliveryRefunds ?? order.refundSummary.postDeliveryRefunds,
            totalRefund: totalRefund ?? order.refundSummary.totalRefund,
            resolvedIssues: resolvedIssues ?? order.refundSummary.resolvedIssues,
            rottenItemCount: rottenItemCount ?? order.refundSummary.rottenItemCount,
            damagedItemCount: damagedItemCount ?? order.refundSummary.damagedItemCount
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    getAllOrders,
    getMyStoreOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    addOrderComment,
    updateRefundSummary
};
