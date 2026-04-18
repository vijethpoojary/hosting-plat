const mongoose = require('mongoose');

const contactLogSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Optional: logged-in user who clicked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

contactLogSchema.index({ product: 1, ipAddress: 1, createdAt: -1 });
contactLogSchema.index({ owner: 1 });

module.exports = mongoose.model('ContactLog', contactLogSchema);
