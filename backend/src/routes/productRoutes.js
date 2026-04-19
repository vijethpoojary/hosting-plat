const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  logContact,
  createProduct,
  updateProduct,
  deleteProduct,
  getOwnerProducts,
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { upload } = require('../config/cloudinary');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/', getProducts);
router.get('/owner/dashboard', protect, requireRole('OWNER', 'ADMIN'), getOwnerProducts);
router.get('/:id', optionalAuth, getProduct);
router.post('/:id/contact', optionalAuth, contactLimiter, logContact);

// Owner-protected routes
router.post(
  '/',
  protect,
  requireRole('OWNER', 'ADMIN'),
  upload.array('images', 5),
  createProduct
);

router.put(
  '/:id',
  protect,
  requireRole('OWNER', 'ADMIN'),
  upload.array('images', 5),
  updateProduct
);

router.delete('/:id', protect, requireRole('OWNER', 'ADMIN'), deleteProduct);

module.exports = router;
