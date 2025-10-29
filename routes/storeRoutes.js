// server/routes/storeRoutes.js
const express = require('express');
const {
    getStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
} = require('../controllers/storeController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only operations for creating, updating, deleting stores
router.route('/')
    .get(protect, admin, getStores)
    .post(protect, admin, createStore);

router.route('/:id')
    .get(protect, admin, getStoreById)
    .put(protect, admin, updateStore)
    .delete(protect, admin, deleteStore);

module.exports = router;