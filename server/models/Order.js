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
  total: {
    type: Number,
    required: true,
    min: 200,
    max: 2000
  },
  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, required: true, match: /^\d{6}$/ }
  },
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'confirmed'
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
