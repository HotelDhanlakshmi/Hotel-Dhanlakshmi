const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const mongoose = require('mongoose');
const whatsappService = require('./services/whatsappService');
const connectDB = require('./config/database');
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');

require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/admin', express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// OTP rate limiting
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 OTP requests per minute
  message: 'Too many OTP requests, please try again later.'
});

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const OTP_FILE = path.join(DATA_DIR, 'otps.json');
const BLACKLIST_FILE = path.join(DATA_DIR, 'blacklist.json');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

// Initialize data directory and files
async function initializeData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Initialize files if they don't exist
    const files = [
      { path: ORDERS_FILE, data: [] },
      { path: OTP_FILE, data: {} },
      { path: BLACKLIST_FILE, data: [] },
      { path: MENU_FILE, data: require('./data/menuData.js') }
    ];

    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.data, null, 2));
      }
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Utility functions
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate mobile number
function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

// Check if mobile is blacklisted
async function isBlacklisted(mobile) {
  const blacklist = await readJsonFile(BLACKLIST_FILE) || [];
  return blacklist.includes(mobile);
}

// Admin mobile numbers (in production, store in database)
const ADMIN_MOBILES = ['9876543210', '8765432109']; // Add your admin numbers

// Check if mobile is admin
function isAdminMobile(mobile) {
  return ADMIN_MOBILES.includes(mobile);
}

// API Routes

// Get menu items (public endpoint)
app.get('/api/menu', async (req, res) => {
  try {
    // Try MongoDB first
    const products = await Product.find({ available: true }).sort({ category: 1, name: 1 });
    
    if (products.length > 0) {
      // Group products by category for frontend compatibility
      const categories = [
        { id: 'pizza-burger', name: 'Pizza/Burger', icon: '🍕' },
        { id: 'chicken', name: 'Chicken', icon: '🍗' },
        { id: 'mutton', name: 'Mutton', icon: '🐑' },
        { id: 'fish', name: 'Fish', icon: '🐟' },
        { id: 'rice-roti', name: 'Rice/Roti', icon: '🍚' },
        { id: 'paratha', name: 'Paratha', icon: '🫓' },
        { id: 'starters', name: 'Starters', icon: '🥗' },
        { id: 'biryani', name: 'Biryani', icon: '🍛' },
        { id: 'chinese-veg', name: 'Chinese-Veg', icon: '🥢' },
        { id: 'chinese-non-veg', name: 'Chinese Non-Veg', icon: '🥡' },
        { id: 'veg-main-course', name: 'Veg-Main Course', icon: '🥘' },
        { id: 'tandoori-kabab', name: 'Tandoori/Kabab', icon: '🔥' },
        { id: 'sp-thali', name: 'Sp.Thali', icon: '🍽️' },
        { id: 'beverages', name: 'Beverages', icon: '🥤' },
        { id: 'soups', name: 'Soups', icon: '🍲' }
      ];
      
      res.json({ categories, items: products });
    } else {
      // Fallback to file system
      const menu = await readJsonFile(MENU_FILE) || { categories: [], items: [] };
      res.json(menu);
    }
  } catch (error) {
    console.error('Error reading menu:', error);
    // Fallback to file system
    try {
      const menu = await readJsonFile(MENU_FILE) || { categories: [], items: [] };
      res.json(menu);
    } catch (fileError) {
      console.error('Error reading menu file:', fileError);
      res.status(500).json({ error: 'Failed to load menu' });
    }
  }
});

// Get products by category (public endpoint)
app.get('/api/products/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ 
      category: categoryId, 
      available: true 
    }).sort({ name: 1 });
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all available products (public endpoint)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ available: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Send OTP
app.post('/api/send-otp', otpLimiter, async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    if (await isBlacklisted(mobile)) {
      return res.status(403).json({ error: 'Mobile number is blacklisted' });
    }

    const otp = generateOTP();
    const otpData = await readJsonFile(OTP_FILE) || {};
    
    otpData[mobile] = {
      otp,
      timestamp: Date.now(),
      attempts: 0
    };

    await writeJsonFile(OTP_FILE, otpData);

    // Send OTP via WhatsApp
    try {
      if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.NODE_ENV === 'production') {
        await whatsappService.sendOTP(mobile, otp);
        console.log(`WhatsApp OTP sent to ${mobile}`);
      } else {
        // Development mode - show OTP in console
        console.log(`🔐 OTP for ${mobile}: ${otp}`);
      }
    } catch (whatsappError) {
      console.error('WhatsApp send failed, OTP stored for manual verification:', whatsappError.message);
      // Continue even if WhatsApp fails - OTP is stored for verification
    }

    res.json({ 
      success: true, 
      message: 'OTP sent successfully via WhatsApp',
      // Show OTP in development mode only
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number or OTP' });
    }

    const otpData = await readJsonFile(OTP_FILE) || {};
    const storedOtpData = otpData[mobile];

    if (!storedOtpData) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedOtpData.timestamp > 5 * 60 * 1000) {
      delete otpData[mobile];
      await writeJsonFile(OTP_FILE, otpData);
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Check attempts
    if (storedOtpData.attempts >= 3) {
      delete otpData[mobile];
      await writeJsonFile(OTP_FILE, otpData);
      return res.status(400).json({ error: 'Too many attempts' });
    }

    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts++;
      await writeJsonFile(OTP_FILE, otpData);
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified successfully
    delete otpData[mobile];
    await writeJsonFile(OTP_FILE, otpData);

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { mobile, items, total, address } = req.body;
    console.log('Order creation request:', { mobile, items: items?.length, total, address });

    // Validation
    if (!mobile || !isValidMobile(mobile)) {
      console.log('Invalid mobile:', mobile);
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    if (await isBlacklisted(mobile)) {
      return res.status(403).json({ error: 'Mobile number is blacklisted' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items:', items);
      return res.status(400).json({ error: 'Invalid items' });
    }

    if (!total || total < 200) {
      console.log('Invalid total:', total);
      return res.status(400).json({ error: 'Minimum order amount is ₹200' });
    }

    if (total > 2000) {
      console.log('Total too high:', total);
      return res.status(400).json({ error: 'Maximum COD limit is ₹2000' });
    }

    if (!address || !address.name || !address.street || !address.city || !address.pincode) {
      console.log('Invalid address:', address);
      return res.status(400).json({ error: 'Complete address is required' });
    }

    // Check daily order limit
    let todayOrders = [];
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      todayOrders = await Order.find({
        mobile,
        createdAt: { $gte: today, $lt: tomorrow }
      });
    } else {
      // Fallback to file storage
      const orders = await readJsonFile(ORDERS_FILE) || [];
      const todayStr = new Date().toDateString();
      todayOrders = orders.filter(order => 
        order.mobile === mobile && 
        new Date(order.timestamp).toDateString() === todayStr
      );
    }

    if (todayOrders.length >= 3) {
      return res.status(400).json({ error: 'Daily order limit exceeded (3 orders per day)' });
    }

    // Create order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    let order;
    if (mongoose.connection.readyState === 1) {
      // Save to MongoDB
      order = await Order.create({
        orderId,
        mobile,
        customerName: address.name,
        items,
        total,
        address,
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000)
      });
      
      // Also save/update user info
      await User.findOneAndUpdate(
        { mobile },
        {
          mobile,
          name: address.name,
          address: {
            street: address.street,
            city: address.city,
            state: address.state || 'Maharashtra',
            pincode: address.pincode
          },
          isVerified: true,
          verifiedAt: new Date(),
          lastLoginAt: new Date()
        },
        { upsert: true, new: true }
      );
      
    } else {
      // Fallback to file storage
      order = {
        id: orderId,
        mobile,
        items,
        total,
        address,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
      };

      const orders = await readJsonFile(ORDERS_FILE) || [];
      orders.push(order);
      await writeJsonFile(ORDERS_FILE, orders);
    }

    // Send WhatsApp order confirmation
    try {
      if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.NODE_ENV === 'production') {
        await whatsappService.sendOrderConfirmation(mobile, order);
        console.log(`WhatsApp order confirmation sent to ${mobile}`);
      }
    } catch (whatsappError) {
      console.error('WhatsApp order confirmation failed:', whatsappError.message);
      // Don't fail the order creation if WhatsApp fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      data: {
        id: order.orderId || order.id,
        ...order
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { mobile } = req.query;

    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Valid mobile number is required' });
    }

    const orders = await readJsonFile(ORDERS_FILE) || [];
    const order = orders.find(o => o.id === orderId && o.mobile === mobile);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get orders by mobile
app.get('/api/orders/mobile/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;

    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    let userOrders = [];
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      userOrders = await Order.find({ mobile })
        .sort({ createdAt: -1 }) // Most recent first
        .lean();
      
      // Convert MongoDB format to frontend format
      userOrders = userOrders.map(order => ({
        id: order.orderId,
        orderId: order.orderId,
        mobile: order.mobile,
        items: order.items,
        total: order.total,
        address: order.address,
        status: order.status,
        timestamp: order.createdAt,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      }));
    } else {
      // Fallback to file storage
      const orders = await readJsonFile(ORDERS_FILE) || [];
      userOrders = orders.filter(o => o.mobile === mobile);
    }

    res.json({ success: true, data: userOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin OTP endpoints
app.post('/api/admin/send-otp', otpLimiter, async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    if (!isAdminMobile(mobile)) {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    const otp = generateOTP();
    const otpData = await readJsonFile(OTP_FILE) || {};
    
    otpData[`admin_${mobile}`] = {
      otp,
      timestamp: Date.now(),
      attempts: 0,
      isAdmin: true
    };

    await writeJsonFile(OTP_FILE, otpData);

    // Send OTP via WhatsApp for admin
    try {
      if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.NODE_ENV === 'production') {
        await whatsappService.sendOTP(mobile, otp);
        console.log(`Admin WhatsApp OTP sent to ${mobile}`);
      } else {
        console.log(`🔐 Admin OTP for ${mobile}: ${otp}`);
      }
    } catch (whatsappError) {
      console.error('Admin WhatsApp send failed:', whatsappError.message);
    }

    res.json({ 
      success: true, 
      message: 'Admin OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Error sending admin OTP:', error);
    res.status(500).json({ error: 'Failed to send admin OTP' });
  }
});

app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number or OTP' });
    }

    if (!isAdminMobile(mobile)) {
      return res.status(403).json({ error: 'Not authorized as admin' });
    }

    const otpData = await readJsonFile(OTP_FILE) || {};
    const storedOtpData = otpData[`admin_${mobile}`];

    if (!storedOtpData || !storedOtpData.isAdmin) {
      return res.status(400).json({ error: 'Admin OTP not found or expired' });
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedOtpData.timestamp > 5 * 60 * 1000) {
      delete otpData[`admin_${mobile}`];
      await writeJsonFile(OTP_FILE, otpData);
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Check attempts
    if (storedOtpData.attempts >= 3) {
      delete otpData[`admin_${mobile}`];
      await writeJsonFile(OTP_FILE, otpData);
      return res.status(400).json({ error: 'Too many attempts' });
    }

    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts++;
      await writeJsonFile(OTP_FILE, otpData);
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified successfully - generate admin token
    delete otpData[`admin_${mobile}`];
    await writeJsonFile(OTP_FILE, otpData);

    const adminToken = `admin_${mobile}_${Date.now()}`;

    res.json({ 
      success: true, 
      message: 'Admin OTP verified successfully',
      token: adminToken,
      mobile: mobile
    });
  } catch (error) {
    console.error('Error verifying admin OTP:', error);
    res.status(500).json({ error: 'Failed to verify admin OTP' });
  }
});

// Admin routes (basic authentication with API key)
const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get all orders (admin)
app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    let orders = [];
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      orders = await Order.find({})
        .sort({ createdAt: -1 }) // Most recent first
        .lean();
      
      // Convert MongoDB format to frontend format
      orders = orders.map(order => ({
        id: order.orderId,
        orderId: order.orderId,
        mobile: order.mobile,
        items: order.items,
        total: order.total,
        address: order.address,
        status: order.status,
        timestamp: order.createdAt,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      }));
    } else {
      // Fallback to file storage
      orders = await readJsonFile(ORDERS_FILE) || [];
    }
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Product Management Endpoints (Admin)

// Initialize/Populate MongoDB with products
app.post('/api/admin/populate-products', adminAuth, async (req, res) => {
  try {
    const productData = require('./data/productData');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert all products
    const insertedProducts = await Product.insertMany(productData);
    
    res.json({ 
      success: true, 
      message: `Successfully populated ${insertedProducts.length} products`,
      data: insertedProducts 
    });
  } catch (error) {
    console.error('Error populating products:', error);
    res.status(500).json({ error: 'Failed to populate products' });
  }
});

// Get all products (admin)
app.get('/api/admin/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ category: 1, name: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add new product (admin)
app.post('/api/admin/products', adminAuth, async (req, res) => {
  try {
    const { name, description, price, category, type, image, available } = req.body;
    
    // Validation
    if (!name || !price || !type) {
      return res.status(400).json({ error: 'Name, price, and type are required' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }

    if (!['veg', 'non-veg', 'egg'].includes(type)) {
      return res.status(400).json({ error: 'Type must be veg, non-veg, or egg' });
    }

    const validCategories = [
      'pizza-burger', 'chicken', 'mutton', 'fish', 'rice-roti', 'paratha',
      'starters', 'biryani', 'chinese-veg', 'chinese-non-veg', 'veg-main-course',
      'tandoori-kabab', 'sp-thali', 'beverages', 'soups'
    ];
    
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const newProduct = new Product({
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      category: category?.trim() || '',
      type,
      image: image?.trim() || '',
      available: available !== false
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({ 
      success: true, 
      message: 'Product added successfully',
      data: savedProduct 
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product (admin)
app.put('/api/admin/products/:productId', adminAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category, type, image, available } = req.body;
    
    // Validation
    if (!name || !price || !type) {
      return res.status(400).json({ error: 'Name, price, and type are required' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }

    if (!['veg', 'non-veg', 'egg'].includes(type)) {
      return res.status(400).json({ error: 'Type must be veg, non-veg, or egg' });
    }

    const validCategories = [
      'pizza-burger', 'chicken', 'mutton', 'fish', 'rice-roti', 'paratha',
      'starters', 'biryani', 'chinese-veg', 'chinese-non-veg', 'veg-main-course',
      'tandoori-kabab', 'sp-thali', 'beverages', 'soups'
    ];
    
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      {
        name: name.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        category: category?.trim() || '',
        type,
        image: image?.trim() || '',
        available: available !== false
      },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ 
      success: true, 
      message: 'Product updated successfully',
      data: updatedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin)
app.delete('/api/admin/products/:productId', adminAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const deletedProduct = await Product.findOneAndDelete({ id: productId });
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ 
      success: true, 
      message: 'Product deleted successfully',
      data: deletedProduct 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update order status (admin)
app.put('/api/orders/:orderId/status', adminAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const orders = await readJsonFile(ORDERS_FILE) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    await writeJsonFile(ORDERS_FILE, orders);

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      data: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// WhatsApp webhook verification
app.get('/api/webhook/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// WhatsApp webhook for receiving messages
app.post('/api/webhook/whatsapp', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  
  if (!whatsappService.verifyWebhook(signature, req.body)) {
    return res.status(403).send('Forbidden');
  }

  const body = JSON.parse(req.body);
  
  // Handle incoming WhatsApp messages here
  console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));
  
  res.status(200).send('OK');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Hotel Dhanlakshmi API is running',
    timestamp: new Date().toISOString(),
    whatsapp: {
      configured: !!process.env.WHATSAPP_ACCESS_TOKEN,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ? 'Set' : 'Not Set'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Cleanup expired OTPs every hour
cron.schedule('0 * * * *', async () => {
  try {
    const otpData = await readJsonFile(OTP_FILE) || {};
    const now = Date.now();
    let cleaned = false;

    for (const mobile in otpData) {
      if (now - otpData[mobile].timestamp > 5 * 60 * 1000) {
        delete otpData[mobile];
        cleaned = true;
      }
    }

    if (cleaned) {
      await writeJsonFile(OTP_FILE, otpData);
      console.log('Expired OTPs cleaned up');
    }
  } catch (error) {
    console.error('Error cleaning up OTPs:', error);
  }
});

// Start server
async function startServer() {
  await initializeData();
  
  app.listen(PORT, () => {
    console.log(`🍽️ Hotel Dhanlakshmi API Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  });
}

startServer().catch(console.error);
