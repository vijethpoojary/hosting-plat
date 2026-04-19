const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['cars', 'dresses', 'electronics', 'furniture', 'tools', 'sports', 'other'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    priceUnit: {
      type: String,
      enum: ['per day', 'per hour', 'per week', 'per month'],
      default: 'per day',
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public_id for deletion
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    contactCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index for search and filtering performance
productSchema.index({ category: 1, price: 1 });
productSchema.index({ owner: 1 });
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ viewsCount: -1 });
productSchema.index({ contactCount: -1 });

module.exports = mongoose.model('Product', productSchema);
