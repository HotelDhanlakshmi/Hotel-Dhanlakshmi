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
  cloudinaryId: {
    type: String,
    required: false, // Make this optional for now
    trim: true
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