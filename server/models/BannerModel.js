const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true
  },
  subtitle: {
    type: String,
    required: false,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  // We'll store the image directly as base64 in MongoDB
  imageData: {
    type: String, // base64 encoded image
    required: false
  },
  link: {
    type: String,
    default: '/menu',
    trim: true
  },
  altText: {
    type: String,
    default: 'Banner Image',
    trim: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for sorting
bannerSchema.index({ sortOrder: 1, isActive: 1 });

module.exports = mongoose.model('Banner', bannerSchema);