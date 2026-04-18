const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters'],
      trim: true,
    },
  },
  { timestamps: true }
);

// One rating per user per owner
ratingSchema.index({ user: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
