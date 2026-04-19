const express = require('express');
const router = express.Router();
const { rateOwner, getOwnerRatings, getMyRating, checkContactGate } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, rateOwner);
router.get('/owner/:ownerId', getOwnerRatings);
router.get('/my-rating/:ownerId', protect, getMyRating);
router.get('/can-review/:productId', protect, checkContactGate);

module.exports = router;
