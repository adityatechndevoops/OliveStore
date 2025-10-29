// server/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    imageUrl: { type: String }, // For product image in the UI
    status: {
        type: String,
        enum: ['Accepted', 'Rejected', 'Refunded', 'Damaged', 'Missing'],
        default: 'Accepted',
    },
});

const orderSchema = mongoose.Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            required: true,
        },
        orderId: { type: String, required: true, unique: true },
        customerName: { type: String, required: true }, // Customer who placed order at Kirana
        customerContact: { type: String, required: true },
        deliveryAddress: {
            street: { type: String },
            city: { type: String },
            pincode: { type: String },
            geolocation: {
                latitude: { type: Number },
                longitude: { type: Number },
            },
        },
        totalAmount: { type: Number, required: true, default: 0 },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Success', 'Failed', 'Refunded'],
            default: 'Pending',
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
        orderProgress: [ // For the timeline in the UI
            {
                status: { type: String },
                timestamp: { type: Date, default: Date.now },
                remark: { type: String },
            },
        ],
        items: [orderItemSchema],
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