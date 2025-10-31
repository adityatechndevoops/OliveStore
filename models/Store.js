// server/models/Store.js
const mongoose = require('mongoose');

const storeSchema = mongoose.Schema(
    {
        storeName: {
          type: String,
          required: [true, 'Please add a store name'],
          trim: true,
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        contactNumber: { type: String, required: true, unique: true },
        email: { type: String, unique: true, sparse: true }, // Optional email
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        geolocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates:{
                type: [Number],
                index: '2dsphere', // Create a geospatial index
            },
        },
        verificationDocuments: {
            gstin: { type: String, unique: true, sparse: true }, // GST Identification Number
            fssaiLicense: { type: String, unique: true, sparse: true }, // Food Safety License
            // Array to store URLs of uploaded images (from S3/Cloudinary)
            documentUploads: [{
              docType: String, // e.g., 'gst_certificate', 'shop_photo'
              url: String,
            }],
        },
        onboardingStatus: {
            type: String,
            enum: ['Pending', 'Submitted', 'Verified', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        bankDetails: {
            accountHolderName: { type: String },
            accountNumber: { type: String },
            bankName: { type: String },
            ifscCode: { type: String },
        },
        operatingHours: [{
          day: String, // e.g., 'Monday'
          open: String,  // e.g., '09:00'
          close: String, // e.g., '21:00'
        }],
        isAcceptingOrders: {
          type: Boolean,
          default: false, // Goes 'true' only after 'Verified' status
        },
        // Link to the user who onboarded this store (if applicable)
        onboardedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true, }
);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;