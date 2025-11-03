import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_ENDPOINTS } from '../config/api';

const TrackOrder = () => {
  const navigate = useNavigate();
  const { userInfo } = useApp();
  const [mobile, setMobile] = useState(userInfo.mobile || '');
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showOrdersList, setShowOrdersList] = useState(false);
  const [showManualTrack, setShowManualTrack] = useState(false);

  useEffect(() => {
    if (userInfo.mobile && userInfo.isVerified) {
      setMobile(userInfo.mobile);
      fetchUserOrders();
    }
  }, [userInfo]);

  const fetchUserOrders = async () => {
    if (!userInfo.mobile) return;
    
    setIsLoadingOrders(true);
    try {
      const response = await fetch(API_ENDPOINTS.GET_ORDERS_BY_MOBILE(userInfo.mobile));
      const data = await response.json();
      
      if (data.success) {
        setUserOrders(data.data || []);
        setShowOrdersList(true);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleTrackOrder = () => {
    const newErrors = {};

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!orderId.trim()) {
      newErrors.orderId = 'Please enter order ID';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate(`/track-order/${orderId}?mobile=${mobile}`);
    }
  };

  const handleOrderClick = (order) => {
    navigate(`/track-order/${order.id || order.orderId}?mobile=${mobile}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-yellow-100 text-yellow-800',
      'ready': 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'confirmed': '✅',
      'preparing': '👨‍🍳',
      'ready': '📦',
      'out-for-delivery': '🚚',
      'delivered': '🎉',
      'cancelled': '❌'
    };
    return icons[status] || '📋';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
        <p className="text-gray-600">Find and track your orders from Hotel Dhanlakshmi</p>
      </div>

      {/* User Orders Section */}
      {userInfo.mobile && userInfo.isVerified ? (
        <div className="space-y-6">
          {/* Your Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2">📋</span>
                Your Recent Orders
              </h2>
              <button
                onClick={() => setShowManualTrack(!showManualTrack)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {showManualTrack ? 'Hide Manual Track' : 'Track by Order ID'}
              </button>
            </div>

            {isLoadingOrders ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your orders...</p>
              </div>
            ) : userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id || order.orderId}
                    onClick={() => handleOrderClick(order)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">
                            Order #{order.id || order.orderId}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <span className="mr-1">{getStatusIcon(order.status)}</span>
                            {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📅 {new Date(order.createdAt || order.timestamp).toLocaleDateString()}</span>
                          <span>💰 ₹{order.total}</span>
                          <span>🍽️ {order.items.length} items</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {userOrders.length > 5 && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => navigate('/orders')}
                      className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                    >
                      View All Orders ({userOrders.length})
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            )}
          </div>

          {/* Manual Track Section */}
          {showManualTrack && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔍</span>
                Track by Order ID
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.mobile ? 'border-red-500' : 'border-gray-200'
                    }`}
                    maxLength="10"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter order ID (e.g., ORD123...)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                      errors.orderId ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.orderId && (
                    <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleTrackOrder}
                disabled={!mobile || !orderId}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔍 Track Order
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            Track Your Order
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.mobile ? 'border-red-500' : 'border-gray-200'
                }`}
                maxLength="10"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                placeholder="Enter order ID (e.g., ORD123...)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all ${
                  errors.orderId ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.orderId && (
                <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleTrackOrder}
            disabled={!mobile || !orderId}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Track Order
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Tip:</strong> Complete user setup to see your order history automatically.
            </p>
            <button
              onClick={() => navigate('/setup')}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Complete Setup →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrackOrder;
