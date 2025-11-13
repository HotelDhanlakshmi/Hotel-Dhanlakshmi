const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    // Only required for admin users
    required: function() {
      return this.isAdmin === true;
    }
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, match: /^\d{6}$/ }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false,
    index: true // Index for faster admin queries
  },
  verifiedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  }
});

// Index for faster queries
userSchema.index({ mobile: 1, isAdmin: 1 });

module.exports = mongoose.model('User', userSchema);
