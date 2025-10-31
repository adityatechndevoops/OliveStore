// server/controllers/storeController.js
const asyncHandler = require('express-async-handler');
const Store = require('../models/Store');
const User = require('../models/User');

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

/**
 * @desc    Upload a document for a store
 * @route   PUT /api/stores/:id/documents
 * @access  Private (Merchant only)
 */
const uploadStoreDocument = asyncHandler(async (req, res) => {
  try {
    const storeId = req.params.id;
    const { docType } = req.body; // e.g., 'gst_certificate', 'fssai_license', 'shop_photo'

    // 1. Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 2. Check if docType was provided
    if (!docType) {
      return res.status(400).json({ message: 'Document type (docType) is required' });
    }

    // 3. Find the store and check ownership
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    if (store.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized for this store' });
    }

    // 4. Create the document object
    const newDocument = {
      docType: docType,
      url: req.file.location, // 'req.file.location' is the S3 URL provided by multer-s3
    };

    // 5. Add the new document to the store's array
    store.verificationDocuments.documentUploads.push(newDocument);
    
    // 6. If this is the final step, update status
    // You can add logic here, e.g., if(docType === 'bank_passbook')
    store.onboardingStatus = 'Submitted'; // Move status from 'Pending' to 'Submitted'
    
    await store.save();

    res.status(200).json({ 
      message: 'Document uploaded successfully',
      fileUrl: req.file.location,
      store: store
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = {
    getStores,
    getStoreById,
    createStore,
    uploadStoreDocument,
    updateStore,
    deleteStore,
};