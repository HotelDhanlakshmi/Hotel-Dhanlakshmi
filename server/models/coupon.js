const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  /**
   * The coupon code the user will type. 
   * (e.g., "DIWALI20")
   */
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true, // Automatically converts "diwali20" to "DIWALI20"
  },

  /**
   * The type of discount.
   */
  type: {
    type: String,
    required: true,
    enum: ['percent', 'fixed'], // Either a percentage or a fixed amount
  },

  /**
   * The value of the discount.
   * (e.g., 20 for 20% or 50 for ₹50)
   */
  value: {
    type: Number,
    required: true,
  },

  /**
   * The "master switch" for your admin.
   * 'cart' = Bulk discount
   * 'specific' = Particular item discount
   */
  appliesTo: {
    type: String,
    required: true,
    enum: ['cart', 'specific'],
    default: 'cart',
  },

  /**
   * List of category IDs (e.g., ['biryani', 'pizza-burger'])
   * Only used if appliesTo is 'specific'.
   */
  targetCategories: {
    type: [String],
    default: [],
  },

  /**
   * List of item IDs (e.g., ['ch9', 'pb4'])
   * Only used if appliesTo is 'specific'.
   */
  targetItems: {
    type: [String],
    default: [],
  },

  /**
   * The minimum cart total required to use the coupon.
   */
  minOrder: {
    type: Number,
    required: true,
    default: 0, // No minimum by default
  },

  /**
   * The total number of times this coupon can be used.
   * (e.g., 50)
   */
  limit: {
    type: Number,
    required: true,
    min: 1, // Must be usable at least once
  },

  /**
   * How many times this coupon has already been used.
   */
  uses: {
    type: Number,
    required: true,
    default: 0,
  },

  /**
   * An optional expiry date for the coupon.
   */
  expiresAt: {
    type: Date,
  },

}, {
  // Automatically adds `createdAt` and `updatedAt` fields
  timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;