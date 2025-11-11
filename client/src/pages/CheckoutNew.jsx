import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutNew = () => {
  const { cart, userInfo, dispatch } = useApp();
  const navigate = useNavigate();

  // Auto-fill from saved user info (guest-first approach)
  const [formData, setFormData] = useState({
    name: userInfo.deliveryAddress?.name || '',
    phone: userInfo.mobile || '',
    address: userInfo.deliveryAddress?.street || '',
    city: userInfo.deliveryAddress?.city || '',
    pincode: userInfo.deliveryAddress?.pincode || '',
    email: userInfo.email || ''
  });
  
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 0; // Free delivery
  const taxes = Math.round(subtotal * 0.05); // 5% tax
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + deliveryFee + taxes - discount;

  // Load Razorpay on component mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Save user info automatically as they type
  useEffect(() => {
    const saveUserInfo = () => {
      dispatch({
        type: 'UPDATE_USER_INFO',
        payload: {
          mobile: formData.phone,
          email: formData.email,
          deliveryAddress: {
            name: formData.name,
            street: formData.address,
            city: formData.city,
            state: 'Maharashtra',
            pincode: formData.pincode
          }
        }
      });
    };

    // Debounce save
    const timeoutId = setTimeout(saveUserInfo, 500);
    return () => clearTimeout(timeoutId);
  }, [formData, dispatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Pincode validation
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // Order amount validation
    if (total < 200) {
      newErrors.amount = 'Minimum order amount is ₹200';
    }

    if (paymentMethod === 'cod' && total > 2000) {
      newErrors.amount = 'COD limit is ₹2000. Please use online payment.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          couponCode: couponCode.toUpperCase()
        })
      });

      const data = await response.json();

      if (data.isValid) {
        setAppliedCoupon({
          code: data.couponCode,
          discountAmount: data.discountAmount
        });
        alert(`Coupon applied! You saved ₹${data.discountAmount}`);
      } else {
        alert(data.error || 'Invalid coupon code');
      }
    } catch (error) {
      alert('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleRazorpayPayment = async (orderData) => {
    try {
      // Create order on backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `order_${Date.now()}`
        })
      });

      const { order } = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: order.amount,
        currency: order.currency,
        name: 'Hotel Dhanlakshmi',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response) {
          // Payment successful
          await createOrder({
            ...orderData,
            paymentMethod: 'online',
            paymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature
          });
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#f97316'
        },
        modal: {
          ondismiss: function() {
            setIsPlacingOrder(false);
            alert('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      alert('Payment failed. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  const createOrder = async (orderDetails) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: formData.phone,
          items: cart,
          total: total,
          subtotal: subtotal,
          discountAmount: discount,
          couponCode: appliedCoupon?.code,
          address: {
            name: formData.name,
            street: formData.address,
            city: formData.city,
            state: 'Maharashtra',
            pincode: formData.pincode
          },
          email: formData.email,
          paymentMethod: orderDetails.paymentMethod || paymentMethod,
          paymentId: orderDetails.paymentId,
          razorpayOrderId: orderDetails.razorpayOrderId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart
        dispatch({ type: 'CLEAR_CART' });
        
        // Navigate to success page
        navigate(`/order-success/${data.data.orderId}`, {
          state: { orderData: data.data }
        });
      } else {
        alert(data.error || 'Failed to create order');
        setIsPlacingOrder(false);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsPlacingOrder(true);

    const orderData = {
      mobile: formData.phone,
      items: cart,
      total: total,
      address: {
        name: formData.name,
        street: formData.address,
        city: formData.city,
        state: 'Maharashtra',
        pincode: formData.pincode
      }
    };

    if (paymentMethod === 'online') {
      // Handle Razorpay payment
      await handleRazorpayPayment(orderData);
    } else {
      // Handle COD
      await createOrder({ ...orderData, paymentMethod: 'cod' });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order in just a few steps</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Customer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                  maxLength="10"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="House no., Building name, Street"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                    errors.address ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.city ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.pincode ? 'border-red-500' : 'border-gray-200'
                    }`}
                    maxLength="6"
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500 focus:ring-orange-500 w-5 h-5"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-medium text-gray-800">Online Payment</p>
                    <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Secure
                </span>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500 focus:ring-orange-500 w-5 h-5"
                />
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-medium text-gray-800">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when order arrives (Max ₹2000)</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">₹{item.price} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={appliedCoupon}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {appliedCoupon ? (
                  <button
                    onClick={removeCoupon}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:bg-gray-400"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Coupon "{appliedCoupon.code}" applied!
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes (5%)</span>
                <span className="font-semibold">₹{taxes}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-orange-600">₹{total}</span>
              </div>
            </div>

            {errors.amount && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.amount}</p>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className={`w-full font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform shadow-md hover:shadow-lg ${
                isPlacingOrder
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Place Order - ₹${total}`
              )}
            </button>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <span>🕒</span>
                <span className="text-sm font-medium">Delivery: 30-40 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutNew;
