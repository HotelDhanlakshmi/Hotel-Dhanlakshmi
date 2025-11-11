import { useState, useEffect } from 'react'; // Make sure useEffect is imported
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const QuickCheckout = () => {
  const { cart, userInfo, dispatch } = useApp();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // --- 1. ADD NEW STATES FOR COUPON ---
  const [couponCode, setCouponCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState(null); // Will store { isValid, newTotal, ... }
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // --- 2. UPDATE YOUR PRICE CALCULATIONS ---
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 0;
  const taxes = Math.round(subtotal * 0.05);

  // 'total' is now dynamic
  const total = (discountInfo ? discountInfo.newTotal : subtotal) + taxes;

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // --- 3. ADD THE "APPLY COUPON" FUNCTION ---
  const handleApplyCoupon = async () => {
    setIsApplying(true);
    setCouponError("");
    setDiscountInfo(null);

    // Send only the 'id' and 'quantity' to the server
    const cartItems = cart.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    try {
      const response = await fetch(`${API_URL}/api/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems,
          couponCode: couponCode
        })
      });
      const data = await response.json();
      if (data.isValid) {
        setDiscountInfo(data);
      } else {
        setCouponError(data.error || 'Invalid coupon');
      }
    } catch (err) {
      setCouponError("Could not connect to server.");
    } finally {
      setIsApplying(false);
    }
  };

  // --- 4. MODIFY 'handlePlaceOrder' ---
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    // Prepare the raw data for the server
    const orderData = {
      mobile: userInfo.mobile,
      items: cart, // Send full cart items
      address: userInfo.deliveryAddress,
      customerName: userInfo.deliveryAddress.name,
      
      // --- THIS IS THE KEY CHANGE ---
      // Send the couponCode. If one was applied, use it.
      couponCode: discountInfo ? couponCode : null,
      
      // --- 'total' IS REMOVED ---
      // The server will calculate it securely.
    };

    console.log('Sending order data:', orderData); // Debug log

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      console.log('Order response:', data); // Debug log

      if (data.success) {
        dispatch({ type: 'CLEAR_CART' });
        // Use data.data.orderId from your server's response
        navigate(`/track-order/${data.data.orderId}?mobile=${userInfo.mobile}`);
      } else {
        console.error('Order creation failed:', data);
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    // ... (your empty cart JSX is fine) ...
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to your cart.</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quick Checkout</h1>
        <p className="text-gray-600">Review and confirm your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🍽️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* --- COUPON FORM ADDED HERE --- */}
            <div className="space-y-3 mb-4 border-t pt-4">
              <label className="block text-sm font-medium text-gray-700">
                Apply Coupon
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={isApplying}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                >
                  {isApplying ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
              {discountInfo && (
                <p className="text-green-600 text-sm mt-1">
                  Coupon applied! You saved ₹{discountInfo.discountAmount.toFixed(2)}
                </p>
              )}
            </div>

            {/* --- PRICE BREAKDOWN UPDATED --- */}
            <div className="space-y-3 mb-6 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {/* This part is new */}
              {discountInfo && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{discountInfo.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold">₹{taxes.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Amount</span>
                {/* 'total' is now your new dynamic total */}
                <span className="font-bold text-orange-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Details</h3>
            
            {/* Mobile Number */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-600">📱</span>
                <div>
                  <p className="font-medium text-gray-800">Mobile Number</p>
                  <p className="text-sm text-gray-600">+91 {userInfo.mobile}</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                    Verified ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-xl">🏠</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-1">Delivery Address</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium">{userInfo.deliveryAddress.name}</p>
                      <p>{userInfo.deliveryAddress.street}</p>
                      <p>{userInfo.deliveryAddress.city}, {userInfo.deliveryAddress.state} - {userInfo.deliveryAddress.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-700">
                <span>🕒</span>
                <span className="text-sm font-medium">Estimated Delivery: 30-40 minutes</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-medium text-gray-800">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when your order arrives</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Selected
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button (UPDATED) */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full maharashtrian-gradient hover:shadow-glow text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none shadow-md"
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Placing Order...</span>
                </div>
              ) : (
                // Button text shows the correct dynamic total
                `Place Order - ₹${total.toFixed(2)}`
              )}
            </button>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <span>✅</span>
                <span className="text-sm font-medium">Safe & Secure • No OTP Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCheckout;