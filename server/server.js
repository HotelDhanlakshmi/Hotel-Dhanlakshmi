const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const whatsappService = require('./services/whatsappService');
require('dotenv').config();

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

// API Routes

// Get menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await readJsonFile(MENU_FILE);
    if (!menu) {
      return res.status(500).json({ error: 'Failed to load menu' });
    }
    res.json({ success: true, data: menu });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    // Validation
    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    if (await isBlacklisted(mobile)) {
      return res.status(403).json({ error: 'Mobile number is blacklisted' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items' });
    }

    if (!total || total < 200) {
      return res.status(400).json({ error: 'Minimum order amount is ₹200' });
    }

    if (total > 2000) {
      return res.status(400).json({ error: 'Maximum COD limit is ₹2000' });
    }

    if (!address || !address.name || !address.street || !address.city || !address.pincode) {
      return res.status(400).json({ error: 'Complete address is required' });
    }

    // Check daily order limit
    const orders = await readJsonFile(ORDERS_FILE) || [];
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      order.mobile === mobile && 
      new Date(order.timestamp).toDateString() === today
    );

    if (todayOrders.length >= 3) {
      return res.status(400).json({ error: 'Daily order limit exceeded (3 orders per day)' });
    }

    // Create order
    const order = {
      id: `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      mobile,
      items,
      total,
      address,
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
    };

    orders.push(order);
    await writeJsonFile(ORDERS_FILE, orders);

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

    if (!isValidMobile(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number' });
    }

    const orders = await readJsonFile(ORDERS_FILE) || [];
    const userOrders = orders.filter(o => o.mobile === mobile);

    res.json({ success: true, data: userOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
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
    const orders = await readJsonFile(ORDERS_FILE) || [];
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
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
