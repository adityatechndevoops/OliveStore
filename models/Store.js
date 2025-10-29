// server/models/Store.js
const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
    {
        storeName: { type: String, required: true },
        ownerName: { type: String, required: true },
        contactNumber: { type: String, required: true, unique: true },
        email: { type: String, unique: true, sparse: true }, // Optional email
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            geolocation: {
                latitude: { type: Number },
                longitude: { type: Number },
            },
        },
        gstin: { type: String, unique: true, sparse: true }, // GST Identification Number
        fssaiLicense: { type: String, unique: true, sparse: true }, // Food Safety License
        onboardingStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        bankDetails: {
            accountNumber: { type: String },
            ifscCode: { type: String },
            bankName: { type: String },
        },
        // Link to the user who onboarded this store (if applicable)
        onboardedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;