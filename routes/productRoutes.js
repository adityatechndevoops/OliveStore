const express = require('express');
const router = express.Router();
const { protect, isStaffOrAdmin, isMerchant } = require('../middleware/authMiddleware');
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// List products (Admin/Staff) or Merchant own
router.get('/', protect, listProducts);

// Create product (Admin/Staff or Merchant for own store)
router.post('/', protect, createProduct);

router.get('/:id', protect, getProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;


