// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // User endpoints
  SEND_OTP: `${API_BASE_URL}/api/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/api/verify-otp`,
  CREATE_ORDER: `${API_BASE_URL}/api/orders`,
  GET_ORDER: (orderId) => `${API_BASE_URL}/api/orders/${orderId}`,
  GET_ORDERS_BY_MOBILE: (mobile) => `${API_BASE_URL}/api/orders/mobile/${mobile}`,
  
  // Menu endpoints
  GET_MENU: `${API_BASE_URL}/api/menu`,
  GET_PRODUCTS: `${API_BASE_URL}/api/products`,
  GET_CATEGORIES: `${API_BASE_URL}/api/categories`,
  
  // Coupon endpoints
  VALIDATE_COUPON: `${API_BASE_URL}/api/validate-coupon`,
  
  // Payment endpoints
  CREATE_RAZORPAY_ORDER: `${API_BASE_URL}/api/create-razorpay-order`,
  VERIFY_RAZORPAY_PAYMENT: `${API_BASE_URL}/api/verify-razorpay-payment`,
  
  // Admin endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/api/admin/login`,
  ADMIN_SEND_OTP: `${API_BASE_URL}/api/admin/send-otp`,
  ADMIN_VERIFY_OTP: `${API_BASE_URL}/api/admin/verify-otp`,
  ADMIN_GET_ORDERS: `${API_BASE_URL}/api/admin/orders`,
  ADMIN_GET_PRODUCTS: `${API_BASE_URL}/api/admin/products`,
  ADMIN_CREATE_PRODUCT: `${API_BASE_URL}/api/admin/products`,
  ADMIN_UPDATE_PRODUCT: (productId) => `${API_BASE_URL}/api/admin/products/${productId}`,
  ADMIN_DELETE_PRODUCT: (productId) => `${API_BASE_URL}/api/admin/products/${productId}`,
  ADMIN_GET_COUPONS: `${API_BASE_URL}/api/admin/coupons`,
  ADMIN_CREATE_COUPON: `${API_BASE_URL}/api/admin/coupons`,
  ADMIN_DELETE_COUPON: (couponId) => `${API_BASE_URL}/api/admin/coupons/${couponId}`,
  UPDATE_ORDER_STATUS: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/status`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_BASE_URL;
