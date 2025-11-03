const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Create admin users if they don't exist
    await createAdminUsers();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't exit process, fall back to file storage
    console.log('📁 Falling back to file-based storage');
  }
};

const createAdminUsers = async () => {
  try {
    const User = require('../models/User');
    const adminMobiles = ['9876543210', '8765432109'];
    
    for (const mobile of adminMobiles) {
      const existingAdmin = await User.findOne({ mobile });
      if (!existingAdmin) {
        await User.create({
          mobile,
          name: 'Admin',
          address: {
            street: 'Hotel Dhanlakshmi',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          isVerified: true,
          isAdmin: true,
          verifiedAt: new Date()
        });
        console.log(`👨‍💼 Admin user created: ${mobile}`);
      }
    }
  } catch (error) {
    console.error('Error creating admin users:', error.message);
  }
};

module.exports = connectDB;
