import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Checkout = () => {
  const { cart, user, dispatch } = useApp();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const finalTotal = getTotalPrice() + Math.round(getTotalPrice() * 0.05);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    // Simulate order placement
    setTimeout(() => {
      const orderId = 'ORD' + Date.now();
      const newOrder = {
        id: orderId,
        items: [...cart],
        total: finalTotal,
        status: 'confirmed',
        paymentMethod,
        deliveryInstructions,
        customerInfo: user,
        orderTime: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        deliveryBoy: null
      };

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      setIsPlacingOrder(false);
      navigate(`/track-order/${orderId}`);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/')}
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
        <p className="text-gray-600">Review your order and complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Details & Payment */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-gray-600">{user?.phone}</p>
                  <p className="text-gray-600 mt-1">
                    {user?.address?.street}, {user?.address?.city}<br />
                    {user?.address?.state} - {user?.address?.pincode}
                  </p>
                </div>
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
                <span className="font-bold text-orange-600">₹{finalTotal}</span>
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
                `Place Order - ₹${finalTotal}`
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
