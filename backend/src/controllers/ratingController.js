const Rating = require('../models/Rating');
const User = require('../models/User');
const Product = require('../models/Product');
const ContactLog = require('../models/ContactLog');

// POST /api/ratings — logged-in users only
const rateOwner = async (req, res, next) => {
  try {
    const { ownerId, rating, review, productId } = req.body;

    if (!ownerId || !rating || !productId) {
      return res.status(400).json({ success: false, message: 'ownerId, productId and rating are required' });
    }

    const owner = await User.findOne({ _id: ownerId, role: 'OWNER' });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    // Prevent rating yourself
    if (req.user._id.toString() === ownerId) {
      return res.status(400).json({ success: false, message: 'You cannot rate yourself' });
    }

    // Contact gate — must have contacted this product before reviewing
    const hasContacted = await ContactLog.findOne({
      user: req.user._id,
      product: productId,
    });

    if (!hasContacted) {
      return res.status(403).json({
        success: false,
        message: 'You can only review after contacting the owner via WhatsApp',
      });
    }

    // Upsert: update existing rating or create new one
    const existingRating = await Rating.findOne({ user: req.user._id, owner: ownerId });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
    } else {
      await Rating.create({ user: req.user._id, owner: ownerId, rating, review });
    }

    // Recalculate owner's average rating
    const stats = await Rating.aggregate([
      { $match: { owner: owner._id } },
      { $group: { _id: '$owner', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(ownerId, {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        totalRatings: stats[0].count,
      });
    }

    res.json({ success: true, message: existingRating ? 'Rating updated' : 'Rating submitted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/ratings/owner/:ownerId — get all ratings for an owner
const getOwnerRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ owner: req.params.ownerId })
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(20);

    res.json({ success: true, ratings });
  } catch (error) {
    next(error);
  }
};

// GET /api/ratings/my-rating/:ownerId — check if current user rated this owner
const getMyRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({ user: req.user._id, owner: req.params.ownerId });
    res.json({ success: true, rating });
  } catch (error) {
    next(error);
  }
};

// GET /api/ratings/can-review/:productId — check if user has contacted this product
const checkContactGate = async (req, res, next) => {
  try {
    const contacted = await ContactLog.findOne({
      user: req.user._id,
      product: req.params.productId,
    });
    res.json({ success: true, canReview: !!contacted });
  } catch (error) {
    next(error);
  }
};

module.exports = { rateOwner, getOwnerRatings, getMyRating, checkContactGate };
