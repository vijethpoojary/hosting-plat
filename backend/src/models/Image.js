const mongoose = require('mongoose');

// Stores images as base64 in MongoDB when Cloudinary is not used (MEDIA=mongo)
const imageSchema = new mongoose.Schema(
  {
    data: { type: String, required: true },   // base64 encoded image
    contentType: { type: String, required: true }, // e.g. image/jpeg
    originalName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);
