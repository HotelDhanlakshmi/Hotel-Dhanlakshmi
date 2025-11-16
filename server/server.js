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
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const whatsappService = require('./services/whatsappService');
const connectDB = require('./config/database');
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Otp = require('./models/Otp');
const Settings = require('./models/Settings');
const menuData = require('./data/menuData');
const Coupon = require('./models/coupon');
const Banner = require('./models/BannerModel'); 
const bannerRoutes = require('./routes/banners.js')

require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173', // Development
  process.env.CLIENT_URL  // Production (set in environment variables)
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add this with your other routes
app.use('/api', bannerRoutes);

// Health check routes (add this after banner routes)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hotel Dhanlakshmi API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong', timestamp: new Date().toISOString() });
});

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

// Check if mobile is admin (from MongoDB)
async function isAdminMobile(mobile) {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ mobile, isAdmin: true });
      return !!user;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin mobile:', error);
    return false;
  }
}

// Get current settings with minOrderAmount
async function getCurrentSettings() {
  try {
    const settings = await Settings.getSettings();
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    // Return default settings if error - CHANGED TO 0
    return {
      minOrderAmount: 0, // CHANGED FROM 200 to 0
      maxCODAmount: 2000
    };
  }
}

// API for Banner Routes
app.get('/api/banners', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
                                .sort({ sortOrder: 1 }); // Sort by the order admin sets
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error('Error fetching active banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

const ADMIN_KEY = process.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024';

app.get('/api/admin/banners', async (req, res) => {
  if (req.headers['x-api-key'] !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const banners = await Banner.find({}).sort({ sortOrder: 1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

app.post('/api/admin/banners', async (req, res) => {
  if (req.headers['x-api-key'] !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    // Only save the simplified data
    const newBanner = new Banner({
      imageUrl: req.body.imageUrl,
      link: req.body.link || '/menu',
      isActive: req.body.isActive,
      sortOrder: req.body.sortOrder
    });
    const savedBanner = await newBanner.save();
    res.status(201).json({ success: true, data: savedBanner });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create banner', details: error.message });
  }
});

app.put('/api/admin/banners/:id', async (req, res) => {
  if (req.headers['x-api-key'] !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    // Only update the simplified data
    const updatedBannerData = {
      imageUrl: req.body.imageUrl,
      link: req.body.link || '/menu',
      isActive: req.body.isActive,
      sortOrder: req.body.sortOrder
    };

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      updatedBannerData,
      { new: true, runValidators: true } 
    );
    if (!updatedBanner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ success: true, data: updatedBanner });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update banner', details: error.message });
  }
});

app.delete('/api/admin/banners/:id', async (req, res) => {
  if (req.headers['x-api-key'] !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ error: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

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

// Get today's best sellers (public endpoint)
app.get('/api/best-sellers/today', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [] });
    }

    // Get start and end of today (IST timezone)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Aggregate orders to find most sold products today
    const bestSellers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $nin: ['cancelled'] } // Exclude cancelled orders
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.id',
          productName: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 } // Top 5 best sellers
    ]);

    // Enrich with product details
    const enrichedBestSellers = await Promise.all(
      bestSellers.map(async (item) => {
        const product = await Product.findOne({ id: item._id });
        return {
          id: item._id,
          name: item.productName,
          soldCount: item.totalQuantity,
          revenue: item.totalRevenue,
          product: product || null
        };
      })
    );

    res.json({
      success: true,
      data: enrichedBestSellers.filter(item => item.product),
      date: today.toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch best sellers' });
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

//Get all the Categories 

app.get('/api/categories', (req, res) => {
  try {
    // This just sends the categories array from your file
    if (menuData && menuData.categories) {
      res.status(200).json({ success: true, data: menuData.categories });
    } else {
      throw new Error('menuData.categories not found');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
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

// Coupon Routes ... (For Creating a Coupon , Fetching all the Coupon and Deleting the Coupon) .

app.post('/api/admin/coupons', async (req, res) => {
  try {
    // Check if coupon code already exists to prevent duplicates
    const existingCoupon = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "This coupon code already exists." });
    }

    // Create a new coupon instance using your Model
    const newCoupon = new Coupon({
      code: req.body.code,
      type: req.body.type,
      value: req.body.value,
      appliesTo: req.body.appliesTo,
      targetCategories: req.body.targetCategories,
      targetItems: req.body.targetItems,
      minOrder: req.body.minOrder,
      limit: req.body.limit,
      // 'uses' will default to 0 (as per your schema)
    });

    // Save the new coupon to your database
    const savedCoupon = await newCoupon.save();

    res.status(201).json({ success: true, data: savedCoupon });

  } catch (error) {
    console.error('Error creating coupon:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * ROUTE 2: GET ALL COUPONS
 * This runs when the CouponManager component first loads to build the list.
 */
app.get('/api/admin/coupons', async (req, res) => {
  try {
    // Find all coupons in the database and sort by most recently created
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: coupons });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * ROUTE 3: DELETE A COUPON
 * This runs when the admin clicks the "Delete" button on a coupon.
 */
app.delete('/api/admin/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params; // This 'id' is the MongoDB _id

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Send a simple success message
    res.status(200).json({ success: true, message: 'Coupon deleted' });

  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * The "Calculation Engine".
 * Securely calculates the subtotal, discount, and final total.
 */
async function calculateFinalAmount(cartItems, couponCode) {
  try {
    // 1. "Hydrate" the cart with data from your database
    const productIds = cartItems.map(item => item.id);

    // --- FIX 1: Query against your 'id' field, not '_id' ---
    const productsFromDB = await Product.find({ id: { $in: productIds } });

    // Create a price map for easy lookup
    const productMap = {};
    productsFromDB.forEach(p => {
      // --- FIX 2: Use 'p.id' as the key, not 'p._id' ---
      productMap[p.id] = {
        price: p.price,
        category: p.category
      };
    });

    // 2. Calculate subtotal securely
    let subtotal = 0;
    const hydratedCart = cartItems.map(item => {
      const product = productMap[item.id];
      const itemTotal = (product?.price || 0) * item.quantity;
      subtotal += itemTotal;
      return {
        ...item,
        price: product?.price || 0,
        category: product?.category || 'unknown',
        itemTotal: itemTotal
      };
    });

    // 3. Check for a valid coupon
    if (!couponCode) {
      return { isValid: true, newTotal: subtotal, discountAmount: 0, subtotal: subtotal };
    }

    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

    // 4. Run all coupon validation rules
    if (!coupon) return { isValid: false, error: 'Invalid coupon code' };
    if (coupon.uses >= coupon.limit) return { isValid: false, error: 'Coupon has expired' };
    if (subtotal < coupon.minOrder) return { isValid: false, error: `Minimum order of ₹${coupon.minOrder} required` };

    // 5. Calculate the discount
    let totalDiscount = 0;
    if (coupon.appliesTo === 'cart') {
      // --- "BULK" DISCOUNT ---
      if (coupon.type === 'percent') {
        totalDiscount = (subtotal * coupon.value) / 100;
      } else {
        totalDiscount = coupon.value;
      }
    } else if (coupon.appliesTo === 'specific') {
      // --- "SPECIFIC ITEM" DISCOUNT ---
      for (const item of hydratedCart) {
        const isCategoryMatch = coupon.targetCategories.includes(item.category);
        const isItemMatch = coupon.targetItems.includes(item.id);
        if (isCategoryMatch || isItemMatch) {
          if (coupon.type === 'percent') {
            totalDiscount += (item.itemTotal * coupon.value) / 100;
          } else {
            totalDiscount += coupon.value * item.quantity;
          }
        }
      }
    }

    if (totalDiscount === 0 && coupon) {
      return { isValid: false, error: 'Coupon not valid for items in cart' };
    }

    totalDiscount = Math.min(totalDiscount, subtotal);
    const newTotal = subtotal - totalDiscount;

    return {
      isValid: true,
      subtotal: subtotal,
      discountAmount: totalDiscount,
      newTotal: newTotal,
      couponCode: coupon.code // Send back the valid code
    };

  } catch (error) {
    console.error("Error in calculateFinalAmount:", error);
    return { isValid: false, error: 'Server calculation error' };
  }
}

/**
 * POST /api/validate-coupon
 * The frontend calls this to check a coupon and show the user the discount.
 */
app.post('/api/validate-coupon', async (req, res) => {
  try {
    const { cartItems, couponCode } = req.body;

    // Use the calculation engine
    const result = await calculateFinalAmount(cartItems, couponCode);

    res.json(result);

  } catch (error) {
    res.status(500).json({ isValid: false, error: 'Server Error' });
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

    // Store OTP in MongoDB
    if (mongoose.connection.readyState === 1) {
      // Delete any existing OTP for this mobile
      await Otp.deleteMany({ mobile, isAdmin: false });

      // Create new OTP with 5 minute expiry
      await Otp.create({
        mobile,
        otp,
        isAdmin: false,
        attempts: 0,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });
    } else {
      // Fallback to file storage
      const otpData = await readJsonFile(OTP_FILE) || {};
      otpData[mobile] = {
        otp,
        timestamp: Date.now(),
        attempts: 0
      };
      await writeJsonFile(OTP_FILE, otpData);
    }

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

    let storedOtpData = null;

    // Get OTP from MongoDB
    if (mongoose.connection.readyState === 1) {
      storedOtpData = await Otp.findOne({
        mobile,
        isAdmin: false,
        isVerified: false
      }).sort({ createdAt: -1 });

      if (!storedOtpData) {
        return res.status(400).json({ error: 'OTP not found or expired' });
      }

      // Check if OTP is expired
      if (new Date() > storedOtpData.expiresAt) {
        await Otp.deleteOne({ _id: storedOtpData._id });
        return res.status(400).json({ error: 'OTP expired' });
      }

      // Check attempts
      if (storedOtpData.attempts >= 3) {
        await Otp.deleteOne({ _id: storedOtpData._id });
        return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
      }

      // Verify OTP
      if (storedOtpData.otp !== otp) {
        storedOtpData.attempts++;
        await storedOtpData.save();
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      // OTP verified successfully
      storedOtpData.isVerified = true;
      await storedOtpData.save();

      // Delete the OTP after successful verification
      await Otp.deleteOne({ _id: storedOtpData._id });

    } else {
      // Fallback to file storage
      const otpData = await readJsonFile(OTP_FILE) || {};
      storedOtpData = otpData[mobile];

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
    }

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Razorpay: Create order
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// Razorpay: Verify payment signature
app.post('/api/verify-razorpay-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Create order - UPDATED WITH minOrderAmount VALIDATION
app.post('/api/orders', async (req, res) => {
  try {
    const { mobile, items, address, couponCode, paymentMethod = 'cod' } = req.body;

    // --- 1. GET CURRENT SETTINGS ---
    const settings = await getCurrentSettings();
    const minOrderAmount = settings.minOrderAmount || 0;
    const maxCODAmount = settings.maxCODAmount || 2000;

    // --- 2. SECURELY CALCULATE PRICE ---
    const { isValid, newTotal, discountAmount, subtotal, error } = await calculateFinalAmount(items, couponCode);

    if (!isValid) {
      return res.status(400).json({ error: error || 'Invalid coupon' });
    }

    // --- 3. VALIDATE ORDER AGAINST SETTINGS ---
    console.log('Order creation request:', { mobile, items: items?.length, newTotal, address, minOrderAmount, maxCODAmount });

    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    if (await isBlacklisted(mobile)) {
      return res.status(403).json({ error: 'Mobile number is blacklisted' });
    }

    // Validate minimum order amount from settings
    if (!newTotal || newTotal < minOrderAmount) {
      console.log('Invalid total:', newTotal, 'Minimum required:', minOrderAmount);
      return res.status(400).json({ error: `Minimum order amount is ₹${minOrderAmount}` });
    }

    // Validate COD limit from settings
    if (paymentMethod === 'cod' && newTotal > maxCODAmount) {
      console.log('COD limit exceeded:', newTotal, 'Max COD:', maxCODAmount);
      return res.status(400).json({ error: `Maximum COD limit is ₹${maxCODAmount}. Please use online payment.` });
    }

    // Check daily order limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysOrders = await Order.countDocuments({
      mobile,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const maxDailyOrders = settings.maxDailyOrders || 5;
    if (todaysOrders >= maxDailyOrders) {
      return res.status(400).json({ error: 'Daily order limit reached. Please try again tomorrow.' });
    }

    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    let order;
    if (mongoose.connection.readyState === 1) {
      // --- 4. SAVE TO MONGODB (with new fields) ---
      order = await Order.create({
        orderId,
        mobile,
        customerName: address.name,
        items,

        // --- Use the new secure values ---
        subtotal: subtotal,
        discountAmount: discountAmount,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        total: newTotal,

        address,
        paymentMethod: paymentMethod,
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000)
      });

      // --- 5. INCREMENT COUPON COUNT ---
      if (isValid && couponCode) {
        await Coupon.updateOne(
          { code: couponCode.toUpperCase() },
          { $inc: { uses: 1 } }
        );
        console.log(`Coupon ${couponCode} use count incremented.`);
      }

      // Update user info
      await User.findOneAndUpdate(
        { mobile },
        {
          mobile,
          deliveryAddress: address,
          lastOrderAt: new Date()
        },
        { upsert: true, new: true }
      );

    } else {
      // Fallback to file storage
      const orders = await readJsonFile(ORDERS_FILE) || [];
      const newOrder = {
        id: orderId,
        orderId,
        mobile,
        customerName: address.name,
        items,
        subtotal: subtotal,
        discountAmount: discountAmount,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        total: newTotal,
        address,
        paymentMethod: paymentMethod,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
      };

      orders.push(newOrder);
      await writeJsonFile(ORDERS_FILE, orders);
      order = newOrder;
    }

    // Send WhatsApp notification
    try {
      if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.NODE_ENV === 'production') {
        await whatsappService.sendOrderConfirmation(mobile, orderId, newTotal, items.length);
        console.log(`Order confirmation sent to ${mobile}`);
      } else {
        console.log(`📱 Order ${orderId} created for ${mobile} - ₹${newTotal} (WhatsApp disabled in dev mode)`);
      }
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
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
      return res.status(400).json({ error: 'Invalid mobile number format' });
    }

    // Check if mobile is admin from MongoDB
    const isAdmin = await isAdminMobile(mobile);
    if (!isAdmin) {
      return res.status(403).json({
        error: 'Unauthorized: This mobile number is not registered as an admin. Please enter the correct admin mobile number.'
      });
    }

    const otp = generateOTP();

    // Store OTP in MongoDB
    if (mongoose.connection.readyState === 1) {
      // Delete any existing OTP for this mobile
      await Otp.deleteMany({ mobile, isAdmin: true });

      // Create new OTP with 5 minute expiry
      await Otp.create({
        mobile,
        otp,
        isAdmin: true,
        attempts: 0,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });
    } else {
      // Fallback to file storage
      const otpData = await readJsonFile(OTP_FILE) || {};
      otpData[`admin_${mobile}`] = {
        otp,
        timestamp: Date.now(),
        attempts: 0,
        isAdmin: true
      };
      await writeJsonFile(OTP_FILE, otpData);
    }

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

// Admin Login with Password
app.post('/api/admin/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Check if mobile is admin from MongoDB
    const isAdmin = await isAdminMobile(mobile);
    if (!isAdmin) {
      return res.status(403).json({
        error: 'Unauthorized: This mobile number is not registered as an admin.'
      });
    }

    // Get admin user
    const adminUser = await User.findOne({ mobile, isAdmin: true });

    if (!adminUser) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }

    // Check if admin has password set
    if (!adminUser.password) {
      // Fallback to environment variable for backward compatibility
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
      if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Invalid credentials' });
      }
    } else {
      // Verify hashed password
      const isPasswordValid = await bcrypt.compare(password, adminUser.password);
      if (!isPasswordValid) {
        return res.status(403).json({ error: 'Invalid credentials' });
      }
    }

    // Update user's last login
    await User.findOneAndUpdate(
      { mobile },
      { lastLoginAt: new Date() }
    );

    const adminToken = `admin_${mobile}_${Date.now()}`;

    res.json({
      success: true,
      message: 'Admin login successful',
      token: adminToken,
      mobile: mobile
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number or OTP' });
    }

    // Check if mobile is admin from MongoDB
    const isAdmin = await isAdminMobile(mobile);
    if (!isAdmin) {
      return res.status(403).json({
        error: 'Unauthorized: This mobile number is not registered as an admin.'
      });
    }

    let storedOtpData = null;

    // Get OTP from MongoDB
    if (mongoose.connection.readyState === 1) {
      storedOtpData = await Otp.findOne({
        mobile,
        isAdmin: true,
        isVerified: false
      }).sort({ createdAt: -1 });

      if (!storedOtpData) {
        return res.status(400).json({ error: 'Admin OTP not found or expired' });
      }

      // Check if OTP is expired (handled by MongoDB TTL, but double check)
      if (new Date() > storedOtpData.expiresAt) {
        await Otp.deleteOne({ _id: storedOtpData._id });
        return res.status(400).json({ error: 'OTP expired' });
      }

      // Check attempts
      if (storedOtpData.attempts >= 3) {
        await Otp.deleteOne({ _id: storedOtpData._id });
        return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
      }

      // Verify OTP
      if (storedOtpData.otp !== otp) {
        storedOtpData.attempts++;
        await storedOtpData.save();
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      // OTP verified successfully
      storedOtpData.isVerified = true;
      await storedOtpData.save();

      // Update user's last login
      await User.findOneAndUpdate(
        { mobile },
        { lastLoginAt: new Date() }
      );

      // Delete the OTP after successful verification
      await Otp.deleteOne({ _id: storedOtpData._id });

    } else {
      // Fallback to file storage
      const otpData = await readJsonFile(OTP_FILE) || {};
      storedOtpData = otpData[`admin_${mobile}`];

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

      // OTP verified successfully
      delete otpData[`admin_${mobile}`];
      await writeJsonFile(OTP_FILE, otpData);
    }

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

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let updatedOrder = null;

    // Update in MongoDB
    if (mongoose.connection.readyState === 1) {
      updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        {
          status: status,
          updatedAt: new Date(),
          // If status is delivered, set deliveredAt
          ...(status === 'delivered' && { deliveredAt: new Date() })
        },
        { new: true } // Return updated document
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Send WhatsApp notification for status update
      try {
        if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.NODE_ENV === 'production') {
          await whatsappService.sendStatusUpdate(updatedOrder.mobile, orderId, status);
          console.log(`Status update notification sent to ${updatedOrder.mobile}`);
        } else {
          console.log(`📱 Status update for order ${orderId}: ${status} (WhatsApp disabled in dev mode)`);
        }
      } catch (whatsappError) {
        console.error('WhatsApp notification failed:', whatsappError.message);
        // Continue even if WhatsApp fails
      }

    } else {
      // Fallback to file storage
      const orders = await readJsonFile(ORDERS_FILE) || [];
      const orderIndex = orders.findIndex(o => o.id === orderId);

      if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
      }

      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      if (status === 'delivered') {
        orders[orderIndex].deliveredAt = new Date().toISOString();
      }

      await writeJsonFile(ORDERS_FILE, orders);
      updatedOrder = orders[orderIndex];
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
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

// Settings Management (Admin)

// Get settings
app.get('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get admin profile
app.get('/api/admin/profile', adminAuth, async (req, res) => {
  try {
    const adminSession = req.headers['x-admin-mobile'];
    if (!adminSession) {
      return res.status(401).json({ error: 'Admin session not found' });
    }

    const admin = await User.findOne({ mobile: adminSession, isAdmin: true }).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ error: 'Failed to fetch admin profile' });
  }
});

// Update settings
app.put('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    // Update only provided fields
    Object.keys(req.body).forEach(key => {
      if (settings.schema.paths[key]) {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Update admin mobile number
app.put('/api/admin/update-mobile', adminAuth, async (req, res) => {
  try {
    const { currentMobile, newMobile, password } = req.body;

    // Validation
    if (!currentMobile || !newMobile || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!isValidMobile(currentMobile) || !isValidMobile(newMobile)) {
      return res.status(400).json({ error: 'Invalid mobile number format' });
    }

    // Get current admin
    const admin = await User.findOne({ mobile: currentMobile, isAdmin: true });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify password
    if (!admin.password) {
      // First time - verify against environment variable
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
      if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Invalid password' });
      }
    } else {
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(403).json({ error: 'Invalid password' });
      }
    }

    // Check if new mobile already exists
    const existingUser = await User.findOne({ mobile: newMobile });
    if (existingUser && existingUser.mobile !== currentMobile) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // Update mobile
    admin.mobile = newMobile;
    await admin.save();

    res.json({
      success: true,
      message: 'Mobile number updated successfully',
      newMobile: newMobile
    });
  } catch (error) {
    console.error('Error updating mobile:', error);
    res.status(500).json({ error: 'Failed to update mobile number', details: error.message });
  }
});

// Update admin password
app.put('/api/admin/update-password', adminAuth, async (req, res) => {
  try {
    const { mobile, currentPassword, newPassword } = req.body;

    // Validation
    if (!mobile || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get admin
    const admin = await User.findOne({ mobile, isAdmin: true });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Check if admin has password set
    if (!admin.password) {
      // First time setting password - verify against environment variable
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
      if (currentPassword !== ADMIN_PASSWORD) {
        return res.status(403).json({ error: 'Current password is incorrect' });
      }
    } else {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isPasswordValid) {
        return res.status(403).json({ error: 'Current password is incorrect' });
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password', details: error.message });
  }
});

// Get revenue statistics (Admin)
app.get('/api/admin/revenue', adminAuth, async (req, res) => {
  try {
    const { period } = req.query; // 'today', 'week', 'month', 'all'

    let startDate;
    const now = new Date();

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(0); // All time
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $nin: ['cancelled'] }
    });

    const revenue = {
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
        : 0,
      totalDiscount: orders.reduce((sum, order) => sum + (order.discountAmount || 0), 0),
      subtotalRevenue: orders.reduce((sum, order) => sum + order.subtotal, 0),
      period: period || 'all',
      startDate: startDate.toISOString()
    };

    res.json({ success: true, data: revenue });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ error: 'Failed to fetch revenue' });
  }
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