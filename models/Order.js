// server/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    productId: { type: String },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    imageUrl: { type: String }, // For product image in the UI
    status: {
        type: String,
        enum: ['Accepted', 'Rejected', 'Refunded', 'Damaged', 'Missing' ],
        default: 'Accepted',
    },
});

const orderSchema = mongoose.Schema(
    // A human-readable ID you can generate (e.g., 'KRN-1001')
    {
        orderId: { 
            type: String,
            required: true,
            unique: true
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
        customer: { 
            name: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            address: {
                street: { type: String },
                city: { type: String },
                pincode: { type: String },
                coordinates: [Number] // [lng, lat]
            },
        },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true, default: 0 },
        paymentStatus: {
            method: { type: String, enum: ['COD', 'Online'] },
            status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
            transactionId: String,
        },
        orderStatus: {
            type: String,
            enum: [
                'Created',
                'Approved',
                'Billed',
                'Enroute',
                'Delivered',
                'Cancelled',
                'Returned',
            ],
            default: 'Created',
        },
        // enum: [
        //   'Pending',        // Order placed by customer
        //   'Accepted',       // Store accepts the order
        //   'Rejected',       // Store rejects the order
        //   'Preparing',      // Store is packing
        //   'Ready for Pickup', // For delivery partner
        //   'Out for Delivery',
        //   'Delivered',
        //   'Cancelled'       // Cancelled by customer or store
        // ],
        orderProgress: [ // For the timeline in the UI
            {
                status: { type: String },
                timestamp: { type: Date, default: Date.now },
                remark: { type: String },
            },
        ],
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                comment: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        issues: [
            {
                type: String,
                enum: [
                    'Quality Issue',
                    'Missing Item',
                    'Expired Item',
                    'Wrong Item',
                    'Expectation Mismatch',
                    'Damaged Item',
                    'Handling Charge',
                    'Price Mismatch',
                    'Packaging Issue',
                    'Ordered By Mistake',
                    'Delight Resolution',
                    'POP Issue',
                    'Other'
                ],
            },
        ],
        refundSummary: {
            postDeliveryRefunds: { type: Number, default: 0 },
            totalRefund: { type: Number, default: 0 },
            resolvedIssues: { type: Number, default: 0 },
            rottenItemCount: { type: Number, default: 0 },
            damagedItemCount: { type: Number, default: 0 },
        },
        // For linking to complaints, if we build a separate system
        complaintId: { type: String },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;