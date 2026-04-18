const mongoose = require('mongoose');

// Tracks unique views per IP per product to prevent spam counting
const viewLogSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // TTL index: auto-delete after 1 hour to allow re-counting
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // 1 hour in seconds
    },
  }
);

viewLogSchema.index({ ipAddress: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('ViewLog', viewLogSchema);
