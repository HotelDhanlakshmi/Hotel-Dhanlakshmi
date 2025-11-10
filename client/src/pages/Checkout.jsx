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

const Checkout = () => {
  const { cart, userInfo, dispatch } = useApp();
  const navigate = useNavigate();
  
  // Add loading state for debugging
  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-xl font-bold text-gray-800">Loading...</h2>
        </div>
      </div>
    );
  }
  
  // Auto-fill from saved user info
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 0; // Free delivery
  const taxes = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + deliveryFee + taxes;

  // Helper functions
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Save user info to localStorage when they type
  const handleMobileChange = (value) => {
    setMobile(value);
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: { mobile: value }
    });
  };

  const handleAddressChange = (field, value) => {
    const newAddress = { ...deliveryAddress, [field]: value };
    setDeliveryAddress(newAddress);
    dispatch({
      type: 'UPDATE_USER_INFO',
      payload: { deliveryAddress: newAddress }
    });
  };

  // Fraud prevention checks
  const isValidOrder = () => {
    const newErrors = {};

    // Mobile validation
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = 'कृपया वैध मोबाईल नंबर टाका • Please enter valid mobile number';
    }

    // Minimum order amount
    if (total < 200) {
      newErrors.amount = 'किमान ऑर्डर ₹200 • Minimum order amount ₹200';
    }

    // Maximum COD limit
    if (total > 2000) {
      newErrors.amount = 'COD मर्यादा ₹2000 • COD limit ₹2000';
    }

    // Address validation
    if (!deliveryAddress.name.trim()) {
      newErrors.name = 'नाव आवश्यक • Name required';
    }
    if (!deliveryAddress.street.trim()) {
      newErrors.street = 'पत्ता आवश्यक • Address required';
    }
    if (!deliveryAddress.city.trim()) {
      newErrors.city = 'शहर आवश्यक • City required';
    }
    if (!deliveryAddress.pincode || !/^\d{6}$/.test(deliveryAddress.pincode)) {
      newErrors.pincode = 'वैध पिनकोड टाका • Enter valid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!isValidOrder()) return;

    setIsPlacingOrder(true);

    try {
      // Simulate sending OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show OTP modal
      dispatch({
        type: 'SHOW_OTP_MODAL',
        payload: {
          mobile,
          orderData: {
            items: cart,
            total,
            address: deliveryAddress
          }
        }
      });

      // Clear cart after successful order (will be done after OTP verification)
      // dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to your cart before checkout.</p>
          <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>Debug Info:</strong> Cart items: {JSON.stringify(cart)}
            </p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
          >
            Browse Menu
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
        <p className="text-gray-600">Review your order and complete your purchase</p>
        {(userInfo.mobile || userInfo.deliveryAddress?.name) && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <span>✅</span>
              <span className="text-sm font-medium">
                Your information has been saved and will be auto-filled
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Customer Details & Address */}
        <div className="space-y-6">
          {/* Mobile Number */}
          <div className="maharashtrian-card rounded-lg shadow-traditional p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              📱 Mobile Number • मोबाईल नंबर
            </h3>
            <div className="space-y-4">
              <div>
                <input
                  type="tel"
                  placeholder="Enter mobile number • मोबाईल नंबर टाका"
                  value={mobile}
                  onChange={(e) => handleMobileChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                    errors.mobile ? 'border-red-500' : 'border-orange-200'
                  }`}
                  maxLength="10"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 text-sm">ℹ️</span>
                  <div className="text-xs text-blue-700">
                    <div className="font-medium">OTP Verification Required • OTP सत्यापन आवश्यक</div>
                    <div className="mt-1">
                      We'll send a 6-digit OTP to verify your order • आम्ही तुमच्या ऑर्डरची पुष्टी करण्यासाठी 6 अंकी OTP पाठवू
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="maharashtrian-card rounded-lg shadow-traditional p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              🏠 Delivery Address • डिलिव्हरी पत्ता
            </h3>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name • पूर्ण नाव"
                  value={deliveryAddress.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                    errors.name ? 'border-red-500' : 'border-orange-200'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <textarea
                  placeholder="Street Address • रस्त्याचा पत्ता"
                  value={deliveryAddress.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                    errors.street ? 'border-red-500' : 'border-orange-200'
                  }`}
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="City • शहर"
                    value={deliveryAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.city ? 'border-red-500' : 'border-orange-200'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="text"
                    placeholder="Pincode • पिनकोड"
                    value={deliveryAddress.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.pincode ? 'border-red-500' : 'border-orange-200'
                    }`}
                    maxLength="6"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              <div>
                <select
                  value={deliveryAddress.state}
                  onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                >
                  <option value="Maharashtra">Maharashtra • महाराष्ट्र</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-medium text-gray-800">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when your order arrives</p>
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    Recommended
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  disabled
                  className="text-orange-500 focus:ring-orange-500"
                />
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-medium text-gray-800">Online Payment</p>
                    <p className="text-sm text-gray-600">Coming Soon</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Instructions</h3>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="Any special instructions for delivery? (Optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded flex items-center justify-center">
                    <span className="text-lg">🍽️</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">₹{item.price} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                <span className="font-semibold">₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold">₹{Math.round(getTotalPrice() * 0.05)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-orange-600">₹{total}</span>
              </div>
            </div>

            {/* Estimated Delivery Time */}
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <span>🕒</span>
                <span className="text-sm font-medium">Estimated Delivery: 30-40 minutes</span>
              </div>
            </div>

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
                  <span>Placing Order...</span>
                </div>
              ) : (
                `Place Order - ₹${total}`
              )}
            </button>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <span>✅</span>
                <span className="text-sm font-medium">Safe & Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
