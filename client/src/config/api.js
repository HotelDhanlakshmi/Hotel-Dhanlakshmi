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
  
  // Admin endpoints
  ADMIN_SEND_OTP: `${API_BASE_URL}/api/admin/send-otp`,
  ADMIN_VERIFY_OTP: `${API_BASE_URL}/api/admin/verify-otp`,
  ADMIN_GET_ORDERS: `${API_BASE_URL}/api/admin/orders`,
  UPDATE_ORDER_STATUS: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/status`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_BASE_URL;
