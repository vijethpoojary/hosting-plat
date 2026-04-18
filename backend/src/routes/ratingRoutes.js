const express = require('express');
const router = express.Router();
const { rateOwner, getOwnerRatings, getMyRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, rateOwner);
router.get('/owner/:ownerId', getOwnerRatings);
router.get('/my-rating/:ownerId', protect, getMyRating);

module.exports = router;
