const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser, getAllProducts, getContactLogs } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// All admin routes require ADMIN role
router.use(protect, requireRole('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/products', getAllProducts);
router.get('/contacts', getContactLogs);

module.exports = router;
