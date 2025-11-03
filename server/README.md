# Hotel Dhanlakshmi - Backend API

🍽️ **Maharashtrian Restaurant Backend API** with mobile-first ordering system, OTP verification, and fraud prevention.

## 🚀 Features

### 📱 **Mobile-First Architecture**
- Mobile number as primary identifier
- OTP verification for each order
- No user registration required
- Cash on Delivery only

### 🛡️ **Fraud Prevention**
- OTP verification for all orders
- Daily order limits (3 orders per mobile)
- Minimum order amount (₹200)
- Maximum COD limit (₹2000)
- Mobile number blacklisting
- Rate limiting on API endpoints

### 📋 **Order Management**
- Real-time order tracking
- 5-stage order status system
- Admin dashboard for order management
- Automatic order cleanup

### 🔒 **Security Features**
- Helmet.js for security headers
- CORS protection
- Rate limiting
- Input validation
- API key authentication for admin

## 🛠️ **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Storage**: File-based JSON (development)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi
- **Scheduling**: node-cron
- **Logging**: Morgan

## 📦 **Installation**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## 🌐 **API Endpoints**

### 📋 **Menu Management**
```http
GET /api/menu
# Get all menu items with categories
```

### 📱 **OTP System**
```http
POST /api/send-otp
Content-Type: application/json
{
  "mobile": "9876543210"
}

POST /api/verify-otp
Content-Type: application/json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

### 🛒 **Order Management**
```http
POST /api/orders
Content-Type: application/json
{
  "mobile": "9876543210",
  "items": [...],
  "total": 500,
  "address": {...}
}

GET /api/orders/:orderId?mobile=9876543210
# Get specific order

GET /api/orders/mobile/:mobile
# Get all orders for a mobile number
```

### 👨‍💼 **Admin Endpoints**
```http
GET /api/admin/orders
X-API-Key: your_admin_api_key
# Get all orders

PUT /api/orders/:orderId/status
X-API-Key: your_admin_api_key
Content-Type: application/json
{
  "status": "preparing"
}
```

### 🏥 **Health Check**
```http
GET /api/health
# Server health status
```

## 📊 **Admin Dashboard**

Access the admin dashboard at: `http://localhost:5000/admin/admin.html`

### Features:
- 📈 Real-time order statistics
- 📋 Order management interface
- 🔄 Order status updates
- 📱 Mobile-responsive design
- 🇮🇳 Marathi language support

### Usage:
1. Enter your admin API key
2. View order statistics
3. Update order statuses
4. Monitor real-time data

## 🔧 **Configuration**

### Environment Variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_API_KEY=your_secure_admin_api_key_here
```

### Order Limits:
- **Minimum Order**: ₹200
- **Maximum COD**: ₹2000
- **Daily Limit**: 3 orders per mobile
- **OTP Expiry**: 5 minutes

### Rate Limits:
- **General API**: 100 requests per 15 minutes
- **OTP Requests**: 3 requests per minute

## 📁 **File Structure**

```
server/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment template
├── data/
│   ├── menuData.js       # Menu items data
│   ├── orders.json       # Orders storage
│   ├── otps.json         # OTP storage
│   └── blacklist.json    # Blacklisted numbers
└── public/
    └── admin.html        # Admin dashboard
```

## 🔄 **Order Status Flow**

1. **confirmed** - Order received and confirmed
2. **preparing** - Kitchen is preparing the food
3. **ready** - Food is ready for pickup/delivery
4. **out-for-delivery** - Order is out for delivery
5. **delivered** - Order successfully delivered

## 🛡️ **Security Measures**

### Input Validation:
- Mobile number format validation
- Order amount validation
- Address completeness check
- OTP format validation

### Rate Limiting:
- Prevents spam requests
- OTP request throttling
- IP-based limiting

### Fraud Prevention:
- Daily order limits per mobile
- Blacklist management
- Order amount restrictions
- OTP verification mandatory

## 🚀 **Deployment**

### Production Setup:
1. Set `NODE_ENV=production`
2. Configure proper API keys
3. Set up SMS service integration
4. Configure database (if migrating from file storage)
5. Set up process manager (PM2)

### SMS Integration:
Replace the mock OTP sending with actual SMS service:
```javascript
// In production, integrate with SMS service
// Examples: Twilio, AWS SNS, Fast2SMS
```

## 📝 **API Response Format**

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔍 **Monitoring & Logging**

- **Morgan**: HTTP request logging
- **Console**: Error and info logging
- **Cron Jobs**: Automatic cleanup tasks
- **Health Checks**: Server status monitoring

## 🤝 **Contributing**

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test all endpoints

## 📞 **Support**

For technical support or questions about the Hotel Dhanlakshmi API, please contact the development team.

---

**Hotel Dhanlakshmi** - Serving authentic Maharashtrian flavors with modern technology! 🇮🇳✨
