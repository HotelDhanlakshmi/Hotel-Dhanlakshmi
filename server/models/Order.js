const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  customerName: {
    type: String,
    required: true
  },
  items: [{
    id: String,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    type: { type: String, enum: ['veg', 'non-veg', 'egg'] }
  }],

  // --- MODIFIED SECTION FOR COUPONS ---
  
  /**
   * The price of the cart *before* any discounts.
   */
  subtotal: {
    type: Number,
    required: true,
  },
  
  /**
   * The amount of discount applied. (e.g., 50)
   */
  discountAmount: {
    type: Number,
    default: 0
  },
  
  /**
   * The coupon code that was used (e.g., "DIWALI20").
   */
  couponCode: {
    type: String,
    uppercase: true,
    trim: true
  },

  /**
   * The final price the customer has to pay.
   * (subtotal - discountAmount)
   */
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  // --- END OF MODIFIED SECTION ---

  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, required: true, match: /^\d{6}$/ }
  },
  status: {
    type: String,
    // Added 'pending' for when the order is created but not yet paid
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending' // Default to pending until payment is confirmed
  },
  paymentMethod: {
    type: String,
    default: 'cod'
  },
  estimatedDelivery: {
    type: Date,
    required: true
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);