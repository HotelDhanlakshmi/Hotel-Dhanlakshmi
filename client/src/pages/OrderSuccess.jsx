import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useApp();
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);

  const orderData = location.state?.orderData;

  useEffect(() => {
    // Show account creation prompt if user doesn't have an account
    if (!userInfo.isVerified) {
      setShowAccountPrompt(true);
    }
  }, [userInfo]);

  const handleCreateAccount = () => {
    // Navigate to account creation with pre-filled data
    navigate('/create-account', {
      state: { fromOrder: true, orderData }
    });
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  const handleTrackOrder = () => {
    navigate(`/track-order/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for your order. We're preparing your delicious meal!</p>
          
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-2xl font-bold text-orange-600">{orderId}</p>
          </div>

          {orderData && (
            <div className="text-left space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold text-gray-800">₹{orderData.total}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-800">
                  {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Delivery Address</span>
                <span className="font-semibold text-gray-800 text-right">
                  {orderData.address?.name}<br />
                  {orderData.address?.street}, {orderData.address?.city}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-semibold text-gray-800">30-40 minutes</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleTrackOrder}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Track Order
            </button>
            <button
              onClick={handleContinueShopping}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Account Creation Prompt */}
        {showAccountPrompt && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Create an Account & Get Benefits!</h3>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Track all your orders in one place</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Faster checkout next time</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Exclusive offers and discounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>Order history and reordering</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCreateAccount}
                    className="bg-white text-orange-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Create Account (1 Click)
                  </button>
                  <button
                    onClick={() => setShowAccountPrompt(false)}
                    className="bg-transparent border-2 border-white text-white font-semibold py-2 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {orderData && orderData.items && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded flex items-center justify-center">
                      <span className="text-lg">🍽️</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-medium text-gray-800 mb-1">Need Help?</p>
              <p className="text-sm text-gray-600">
                Contact us at <a href="tel:+919876543210" className="text-orange-600 font-semibold">+91 98765 43210</a>
                {' '}or email <a href="mailto:support@hoteldhanlakshmi.com" className="text-orange-600 font-semibold">support@hoteldhanlakshmi.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
