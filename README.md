# 🏨 Hotel Dhanlakshmi - Maharashtrian Restaurant

A modern, full-stack restaurant management system featuring authentic Maharashtrian cuisine with online ordering, admin dashboard, and comprehensive business management tools.

## 🌟 Features

### 🍽️ Customer Features
- **Authentic Menu**: Traditional Maharashtrian dishes with detailed descriptions
- **Smart Ordering**: Guest checkout without forced registration
- **Multiple Payment Options**: Cash on Delivery & Online Payment (Razorpay)
- **Real-time Order Tracking**: Live status updates from kitchen to delivery
- **Best Sellers**: Daily top 5 most ordered items with horizontal scroll
- **Coupon System**: Discount codes with flexible rules (percentage/fixed, category/item specific)
- **Mobile Responsive**: Optimized for all devices with touch-friendly interface
- **Bilingual Support**: English and Marathi (देवनागरी) text throughout

### 👨‍💼 Admin Features
- **Comprehensive Dashboard**: Orders, products, revenue analytics, and settings
- **Order Management**: Real-time order status updates with WhatsApp notifications
- **Product Management**: Add, edit, delete menu items with image support
- **Coupon Management**: Create and manage discount campaigns
- **Revenue Tracking**: Daily, weekly, monthly revenue with discount analytics
- **Settings Management**: Restaurant info, operational hours, payment methods
- **Admin Security**: Secure login with mobile + password, credential updates
- **Best Sellers Analytics**: Track top-performing items with sales data

### 🔧 Technical Features
- **Modern Stack**: React + Node.js + MongoDB + Express
- **Security**: bcrypt password hashing, rate limiting, CORS protection
- **Real-time**: WhatsApp integration for order notifications
- **Scalable**: MongoDB with optimized queries and indexing
- **Production Ready**: Environment-based configuration, error handling
- **API Documentation**: RESTful APIs with comprehensive endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-dhanlakshmi
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create `server/.env`:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/hotel-dhanlakshmi
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Admin
   ADMIN_API_KEY=your-secure-admin-api-key
   ADMIN_PASSWORD=admin123
   
   # Payment (Razorpay)
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   
   # WhatsApp (Optional)
   WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
   WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-webhook-token
   
   # Client URL (for CORS)
   CLIENT_URL=http://localhost:5173
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_ADMIN_API_KEY=your-secure-admin-api-key
   VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
   ```

5. **Database Setup**
   ```bash
   cd server
   npm run create-admin
   ```

6. **Start Development Servers**
   
   Terminal 1 (Server):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Client):
   ```bash
   cd client
   npm run dev
   ```

7. **Access the Application**
   - Customer Site: http://localhost:5173
   - Admin Panel: http://localhost:5173/admin/login
   - API: http://localhost:5000

## 📱 Usage

### Customer Journey
1. **Browse Menu**: View categorized items with prices and descriptions
2. **Add to Cart**: Select items and quantities
3. **Apply Coupons**: Enter discount codes for savings
4. **Guest Checkout**: Provide delivery details without registration
5. **Choose Payment**: Cash on Delivery or Online Payment
6. **Track Order**: Receive WhatsApp updates on order status

### Admin Workflow
1. **Login**: Use mobile number (9876543210) and password (admin123)
2. **Dashboard**: Monitor orders, revenue, and key metrics
3. **Manage Orders**: Update status from confirmed → delivered
4. **Product Management**: Add new items, update prices, manage availability
5. **Coupon Campaigns**: Create discount codes with specific rules
6. **Settings**: Configure restaurant info, hours, payment methods
7. **Security**: Update admin mobile number and password

## 🏗️ Architecture

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Hero.jsx        # Landing page hero section
│   │   ├── MenuCard.jsx    # Product display cards
│   │   ├── BestSellersToday.jsx  # Daily top items
│   │   └── SmartRouter.jsx # Protected routing logic
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx        # Customer homepage
│   │   ├── Menu.jsx        # Full menu catalog
│   │   ├── CheckoutNew.jsx # Guest checkout flow
│   │   ├── AdminLogin.jsx  # Admin authentication
│   │   ├── AdminDashboard.jsx  # Admin control panel
│   │   └── CouponManager.jsx   # Coupon management
│   ├── context/            # React context for state
│   └── index.css          # Tailwind + custom styles
```

### Backend (Node.js + Express)
```
server/
├── models/                 # MongoDB schemas
│   ├── User.js            # Admin/customer users
│   ├── Order.js           # Order management
│   ├── Product.js         # Menu items
│   ├── Coupon.js          # Discount codes
│   ├── Otp.js             # OTP verification
│   └── Settings.js        # Restaurant settings
├── services/              # External integrations
│   └── whatsappService.js # WhatsApp notifications
├── scripts/               # Utility scripts
│   └── createAdmin.js     # Admin user creation
├── config/                # Configuration
│   └── database.js        # MongoDB connection
└── server.js              # Main application server
```

## 🔌 API Endpoints

### Public Endpoints
```
GET  /api/menu                    # Get menu items
GET  /api/categories              # Get food categories
GET  /api/products               # Get all products
GET  /api/best-sellers/today     # Get daily best sellers
POST /api/orders                 # Create new order
POST /api/validate-coupon        # Validate discount code
POST /api/send-otp              # Send OTP for verification
POST /api/verify-otp            # Verify OTP code
```

### Admin Endpoints (Require API Key)
```
GET  /api/admin/orders           # Get all orders
PUT  /api/orders/:id/status      # Update order status
GET  /api/admin/products         # Get all products (admin)
POST /api/admin/products         # Add new product
PUT  /api/admin/products/:id     # Update product
DELETE /api/admin/products/:id   # Delete product
GET  /api/admin/coupons          # Get all coupons
POST /api/admin/coupons          # Create coupon
DELETE /api/admin/coupons/:id    # Delete coupon
GET  /api/admin/settings         # Get restaurant settings
PUT  /api/admin/settings         # Update settings
GET  /api/admin/revenue          # Get revenue analytics
PUT  /api/admin/update-mobile    # Update admin mobile
PUT  /api/admin/update-password  # Update admin password
```

### Payment Endpoints
```
POST /api/create-razorpay-order  # Create payment order
POST /api/verify-razorpay-payment # Verify payment signature
```

## 🎨 Design System

### Color Palette (Maharashtrian Theme)
- **Saffron**: #FF9933 (Primary brand color)
- **Deep Saffron**: #FF6600 (Accent)
- **Traditional Red**: #DC143C (Important actions)
- **Golden Yellow**: #FFD700 (Highlights)
- **Earth Brown**: #8B4513 (Text/borders)

### Typography
- **Marathi Text**: Noto Sans Devanagari, Mukti
- **English Text**: System fonts with fallbacks
- **Responsive Sizing**: Mobile-first approach

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Modals**: Backdrop blur with smooth animations

## 🔒 Security Features

### Authentication & Authorization
- **Admin Login**: Mobile number + password authentication
- **Password Hashing**: bcrypt with 10 salt rounds
- **API Key Protection**: Admin endpoints require valid API key
- **Session Management**: JWT-like tokens with expiration

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data in .env files

### Security Headers
- **Helmet.js**: Security headers middleware
- **HTTPS Ready**: SSL/TLS configuration support
- **Error Handling**: Secure error messages (no data leakage)

## 📊 Business Features

### Order Management
- **Status Tracking**: confirmed → preparing → ready → out-for-delivery → delivered
- **WhatsApp Integration**: Automatic notifications to customers
- **Daily Limits**: Configurable maximum orders per day
- **Time Management**: Restaurant hours and delivery time settings

### Revenue Analytics
- **Daily Revenue**: Real-time calculation excluding cancelled orders
- **Discount Tracking**: Monitor coupon usage and savings
- **Best Sellers**: Automatic daily reset with sales counting
- **Average Order Value**: Business intelligence metrics

### Coupon System
- **Flexible Rules**: Percentage or fixed amount discounts
- **Target Specific**: Apply to categories or individual items
- **Usage Limits**: Control total uses per coupon
- **Minimum Order**: Set minimum cart value requirements

## 🚀 Deployment

### Production Environment Setup

1. **Server Deployment** (Railway/Heroku/VPS)
   ```bash
   # Build and start
   cd server
   npm install --production
   npm start
   ```

2. **Client Deployment** (Vercel/Netlify)
   ```bash
   # Build for production
   cd client
   npm run build
   # Deploy dist/ folder
   ```

3. **Database** (MongoDB Atlas)
   - Create cluster and get connection string
   - Update MONGODB_URI in production environment

4. **Environment Variables**
   - Set all production environment variables
   - Use secure, random values for API keys
   - Configure payment gateway credentials

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection established
- [ ] Admin user created
- [ ] Payment gateway tested
- [ ] WhatsApp integration configured
- [ ] CORS origins updated
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring setup

## 🧪 Testing

### Manual Testing
```bash
# Test admin creation
npm run create-admin

# Test API endpoints
curl http://localhost:5000/api/health

# Test admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210","password":"admin123"}'
```

### Feature Testing
- [ ] Customer can browse menu
- [ ] Guest checkout works
- [ ] Coupons apply correctly
- [ ] Orders create successfully
- [ ] Admin can login
- [ ] Order status updates work
- [ ] Product management functions
- [ ] Revenue calculations accurate
- [ ] Mobile/password updates work

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test new features thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Maharashtrian Culture**: Inspiration for design and content
- **Open Source Community**: Libraries and tools used
- **Contributors**: Everyone who helped build this project

## 📞 Support

For support and questions:
- **Email**: support@hoteldhanlakshmi.com
- **Phone**: +91 9876543210
- **Address**: Mumbai, Maharashtra, India

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Complete restaurant management system
- ✅ Customer ordering with guest checkout
- ✅ Admin dashboard with full management
- ✅ Coupon system with flexible rules
- ✅ Revenue tracking and analytics
- ✅ Best sellers with daily reset
- ✅ Admin credential management
- ✅ WhatsApp integration
- ✅ Payment gateway integration
- ✅ Mobile-responsive design
- ✅ Production-ready deployment

---

*"अन्नं हे पूर्ण ब्रह्म" - Food is Divine* ✨