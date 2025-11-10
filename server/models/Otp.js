const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
otpSchema.index({ mobile: 1, isAdmin: 1 });
otpSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Otp', otpSchema);
