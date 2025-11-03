import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_ENDPOINTS } from '../config/api';

const AllOrders = () => {
  const { userInfo } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (userInfo.mobile && userInfo.isVerified) {
      fetchOrders();
    } else {
      setError('Please complete user setup first');
      setIsLoading(false);
    }
  }, [userInfo]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.GET_ORDERS_BY_MOBILE(userInfo.mobile));
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Network error while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchOrder = () => {
    if (!searchOrderId.trim()) {
      setSearchError('Please enter an order ID');
      return;
    }

    if (!userInfo.mobile) {
      setSearchError('Mobile number required for order tracking');
      return;
    }

    setSearchError('');
    navigate(`/track-order/${searchOrderId.trim()}?mobile=${userInfo.mobile}`);
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Your Orders...</h2>
          <p className="text-gray-600">Please wait while we fetch your order history</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Link
              to="/setup"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Complete Setup
            </Link>
            <Link
              to="/"
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Orders</h1>
        <p className="text-gray-600">Track all your orders from Hotel Dhanlakshmi</p>
      </div>

      {/* Search by Order ID */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Track Specific Order</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (e.g., ORD1762183330104ZM0O)"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchOrder()}
            />
            {searchError && (
              <p className="text-red-500 text-sm mt-1">{searchError}</p>
            )}
          </div>
          <button
            onClick={handleSearchOrder}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Track Order
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-8">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">👤</span>
          <div>
            <p className="font-semibold text-gray-800">{userInfo.deliveryAddress?.name}</p>
            <p className="text-sm text-gray-600">+91 {userInfo.mobile}</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders yet. Start by browsing our delicious menu!</p>
          <Link
            to="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">📋 Order History ({orders.length} orders)</h2>
          
          {orders.map((order) => (
            <div key={order.id || order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Order #{order.id || order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt || order.timestamp).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <span className="mr-2">{getStatusIcon(order.status)}</span>
                      {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">🍽️</span>
                      Order Items ({order.items.length} items)
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">
                                {item.type === 'veg' ? '🥗' : item.type === 'non-veg' ? '🍖' : '🍳'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">🏠</span>
                      Delivery Details
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <p className="font-medium text-gray-800">{order.address.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.address.street}<br/>
                          {order.address.city}, {order.address.state} - {order.address.pincode}
                        </p>
                        <p className="text-sm text-blue-600 mt-2">📱 +91 {order.mobile}</p>
                      </div>
                      
                      {order.estimatedDelivery && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-yellow-800">
                            🕒 Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">💰</span>
                    Payment Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span className="font-medium">₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Fees</span>
                      <span className="font-medium">₹{Math.round(order.total * 0.05)}</span>
                    </div>
                    <hr className="border-gray-300"/>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-800">Total Amount</span>
                      <span className="text-green-600">₹{order.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">💵 Cash on Delivery</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                  <div className="mb-4 sm:mb-0">
                    {order.status === 'delivered' ? (
                      <div className="flex items-center text-green-600">
                        <span className="mr-2">✅</span>
                        <span className="font-medium">Order Delivered Successfully</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <span className="mr-2">🚚</span>
                        <span className="font-medium">Order in Progress</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      to={`/track-order/${order.id || order.orderId}?mobile=${userInfo.mobile}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                    >
                      <span className="mr-2">📍</span>
                      Track Order
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
                        <span className="mr-2">🔄</span>
                        Reorder
                      </button>
                    )}
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
                      <span className="mr-2">📞</span>
                      Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Hungry for More?</h3>
        <p className="mb-4">Explore our delicious menu and place a new order!</p>
        <Link
          to="/menu"
          className="bg-white text-orange-500 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
        >
          Browse Menu
        </Link>
      </div>
    </div>
  );
};

export default AllOrders;
