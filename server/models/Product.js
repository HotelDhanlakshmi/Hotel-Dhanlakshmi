const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'pizza-burger', 'chicken', 'mutton', 'fish', 'rice-roti', 'paratha',
      'starters', 'biryani', 'chinese-veg', 'chinese-non-veg', 'veg-main-course',
      'tandoori-kabab', 'sp-thali', 'beverages', 'soups'
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['veg', 'non-veg', 'egg']
  },
  image: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ type: 1 });
productSchema.index({ available: 1 });

module.exports = mongoose.model('Product', productSchema);
