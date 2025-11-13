const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Restaurant Information
    restaurantName: {
        type: String,
        default: 'Hotel Dhanlakshmi'
    },
    phoneNumber: {
        type: String,
        default: '+91 9876543210'
    },
    email: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },

    // Order Settings
    minOrderAmount: {
        type: Number,
        default: 200,
        min: 0
    },
    maxCODAmount: {
        type: Number,
        default: 2000,
        min: 0
    },
    deliveryTime: {
        type: Number,
        default: 40, // minutes
        min: 10
    },
    maxDailyOrders: {
        type: Number,
        default: 50,
        min: 1
    },

    // Payment Settings
    onlinePaymentEnabled: {
        type: Boolean,
        default: false
    },
    codEnabled: {
        type: Boolean,
        default: true
    },

    // Operational Settings
    restaurantOpen: {
        type: Boolean,
        default: true
    },
    openingTime: {
        type: String,
        default: '09:00'
    },
    closingTime: {
        type: String,
        default: '22:00'
    },

    // Notification Settings
    whatsappNotifications: {
        type: Boolean,
        default: true
    },
    smsNotifications: {
        type: Boolean,
        default: false
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
settingsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
