# 🏨 Hotel Dhanlakshmi - Food Ordering Website

A modern, responsive food ordering website built with React, Vite, and Tailwind CSS for Hotel Dhanlakshmi restaurant.

## ✨ Features

### 🍽️ **Menu & Ordering**
- **Complete Menu Display**: 200+ authentic Indian dishes across 15 categories
- **Smart Category Filtering**: Pizza/Burger, Chicken, Mutton, Fish, Biryani, Chinese, etc.
- **Real-time Search**: Find your favorite dishes instantly
- **Beautiful Food Cards**: Attractive design with pricing and dietary indicators
- **Add to Cart**: Seamless cart management without login required for browsing

### 🔐 **Authentication System**
- **Multi-step Signup**: 3-step registration process
  - Step 1: Basic Information (Name, Email, Phone)
  - Step 2: Security (Password Setup)
  - Step 3: Delivery Address
- **Smart Login Flow**: Users must login to add items to cart
- **User Profile Management**: Store customer details and preferences

### 🛒 **Shopping Cart & Checkout**
- **Interactive Cart**: Add, remove, update quantities
- **Price Calculation**: Automatic subtotal, taxes, and total calculation
- **Cash on Delivery**: Primary payment method
- **Order Summary**: Detailed breakdown before checkout
- **Delivery Address**: Use saved address from registration

### 📱 **Real-time Order Tracking**
- **Live Order Status**: 5-stage tracking system
  - Order Confirmed ✅
  - Preparing Food 👨‍🍳
  - Ready for Pickup 📦
  - Out for Delivery 🚚
  - Delivered 🎉
- **Delivery Partner Info**: See assigned delivery person
- **Live Location Tracking**: Simulated real-time GPS tracking
- **Estimated Delivery Time**: Dynamic time calculations
- **Customer Support**: Direct chat and call options

### 🎨 **Design & UX**
- **Modern UI**: Beautiful gradient designs and animations
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Loading States**: Professional loading indicators
- **Error Handling**: Graceful error states and fallbacks

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.16
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **Icons**: Emoji-based design system
- **Animations**: CSS animations and Tailwind transitions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HotelDhanlakshmi/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional required packages**
   ```bash
   npm install react-router-dom
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔄 Order Flow

1. **Browse Menu** - View all items without login
2. **Add to Cart** - Login required to add items
3. **Review Cart** - Modify quantities, see totals
4. **Checkout** - Enter delivery details, select payment
5. **Track Order** - Real-time status updates and location tracking

## 🎯 Future Enhancements

- **Backend Integration** - Express.js and Node.js API
- **Database** - MongoDB for data persistence
- **Payment Gateway** - Online payment options
- **Admin Panel** - Restaurant management dashboard
- **Push Notifications** - Order status updates
- **Reviews & Ratings** - Customer feedback system

---

**Built with ❤️ for Hotel Dhanlakshmi**
