import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  cart: [],
  showOtpModal: false,
  currentOrder: null,
  orders: [],
  otpData: {
    mobile: '',
    otp: '',
    isVerified: false,
    orderData: null
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };
    
    case 'SHOW_OTP_MODAL':
      return {
        ...state,
        showOtpModal: true,
        otpData: {
          ...state.otpData,
          mobile: action.payload.mobile,
          orderData: action.payload.orderData
        }
      };
    
    case 'HIDE_OTP_MODAL':
      return {
        ...state,
        showOtpModal: false,
        otpData: {
          mobile: '',
          otp: '',
          isVerified: false,
          orderData: null
        }
      };
    
    case 'SET_OTP':
      return {
        ...state,
        otpData: {
          ...state.otpData,
          otp: action.payload
        }
      };
    
    case 'VERIFY_OTP_SUCCESS':
      return {
        ...state,
        otpData: {
          ...state.otpData,
          isVerified: true
        }
      };
    
    case 'CREATE_ORDER':
      const newOrder = {
        id: `ORD${Date.now()}`,
        mobile: action.payload.mobile,
        items: action.payload.items,
        total: action.payload.total,
        address: action.payload.address,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString() // 45 minutes
      };
      
      // Store in localStorage for persistence
      const existingOrders = JSON.parse(localStorage.getItem('hotelDhanlakshmiOrders') || '[]');
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('hotelDhanlakshmiOrders', JSON.stringify(updatedOrders));
      
      return {
        ...state,
        orders: [...state.orders, newOrder],
        currentOrder: newOrder,
        cart: [],
        showOtpModal: false,
        otpData: {
          mobile: '',
          otp: '',
          isVerified: false,
          orderData: null
        }
      };
    
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId
          ? { ...state.currentOrder, status: action.payload.status }
          : state.currentOrder
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
