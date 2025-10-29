// server/controllers/storeController.js
const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private/Admin
const getStores = asyncHandler(async (req, res) => {
    const stores = await Store.find({}).populate('onboardedBy', 'name email'); // Populate who onboarded the store
    res.json(stores);
});

// @desc    Get single store by ID
// @route   GET /api/stores/:id
// @access  Private/Admin
const getStoreById = asyncHandler(async (req, res) => {
    const store = await Store.findById(req.params.id).populate('onboardedBy', 'name email');

    if (store) {
        res.json(store);
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private/Admin
const createStore = asyncHandler(async (req, res) => {
    const {
        storeName,
        ownerName,
        contactNumber,
        email,
        address,
        gstin,
        fssaiLicense,
        onboardingStatus,
        bankDetails,
    } = req.body;

    const store = new Store({
        storeName,
        ownerName,
        contactNumber,
        email,
        address,
        gstin,
        fssaiLicense,
        onboardingStatus: onboardingStatus || 'Pending',
        bankDetails,
        onboardedBy: req.user._id, // User performing the creation
    });

    const createdStore = await store.save();
    res.status(201).json(createdStore);
});

// @desc    Update a store
// @route   PUT /api/stores/:id
// @access  Private/Admin
const updateStore = asyncHandler(async (req, res) => {
    const {
        storeName,
        ownerName,
        contactNumber,
        email,
        address,
        gstin,
        fssaiLicense,
        onboardingStatus,
        bankDetails,
    } = req.body;

    const store = await Store.findById(req.params.id);

    if (store) {
        store.storeName = storeName || store.storeName;
        store.ownerName = ownerName || store.ownerName;
        store.contactNumber = contactNumber || store.contactNumber;
        store.email = email || store.email;
        store.address = address || store.address;
        store.gstin = gstin || store.gstin;
        store.fssaiLicense = fssaiLicense || store.fssaiLicense;
        store.onboardingStatus = onboardingStatus || store.onboardingStatus;
        store.bankDetails = bankDetails || store.bankDetails;

        const updatedStore = await store.save();
        res.json(updatedStore);
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

// @desc    Delete a store
// @route   DELETE /api/stores/:id
// @access  Private/Admin
const deleteStore = asyncHandler(async (req, res) => {
    const store = await Store.findById(req.params.id);

    if (store) {
        await store.deleteOne(); // Use deleteOne() or remove() depending on Mongoose version
        res.json({ message: 'Store removed' });
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

module.exports = {
    getStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
};