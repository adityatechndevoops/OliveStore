const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { listUsers, updateUserRole, deleteUser } = require('../controllers/userAdminController');

router.get('/', protect, isAdmin, listUsers);
router.put('/:id/role', protect, isAdmin, updateUserRole);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;


