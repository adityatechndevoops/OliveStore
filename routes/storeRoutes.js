// server/routes/storeRoutes.js
const express = require('express');
const {
    getStores,
    getStoreById,
    createStore,
    updateStore,
    uploadStoreDocument,
    deleteStore,
} = require('../controllers/storeController');
const { protect, isStaffOrAdmin, isMerchant, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Admin-only operations for creating, updating, deleting stores
router.route('/')
    .get(protect, isAdmin, getStores)
    .post(protect, isAdmin, createStore);

// @route   PUT /api/stores/:id/documents
// @desc    Upload a single document (e.g., GST, FSSAI)
// 'document' is the field name in the form-data
router.route('/:id/documents')
    .put(protect, isMerchant, upload.single('document'), uploadStoreDocument) // Merchant uploads document

router.route('/:id')
    .get(protect, isAdmin, getStoreById)
    .put(protect, isAdmin, updateStore)
    .delete(protect, isAdmin, deleteStore);

// --- Admin / Staff Routes --- (Handled above with isAdmin)


module.exports = router;