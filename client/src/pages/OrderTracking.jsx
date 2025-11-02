import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { orders, currentOrder, dispatch } = useApp();
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState({ lat: 19.0760, lng: 72.8777 });
  const [customerLocation] = useState({ lat: 19.0896, lng: 72.8656 });

  const order = orders.find(o => o.id === orderId) || currentOrder;

  const orderStatuses = [
    { id: 'confirmed', label: 'Order Confirmed', icon: '✅', time: '2 min ago' },
    { id: 'preparing', label: 'Preparing Food', icon: '👨‍🍳', time: '5 min ago' },
    { id: 'ready', label: 'Ready for Pickup', icon: '📦', time: '2 min ago' },
    { id: 'picked_up', label: 'Out for Delivery', icon: '🚚', time: '1 min ago' },
    { id: 'delivered', label: 'Delivered', icon: '🎉', time: null }
  ];

  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    switch (order.status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'picked_up': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  // Simulate real-time order status updates
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const statusProgression = ['confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
    const currentIndex = statusProgression.indexOf(order.status);
    
    if (currentIndex < statusProgression.length - 1) {
      const timer = setTimeout(() => {
        const nextStatus = statusProgression[currentIndex + 1];
        dispatch({
          type: 'UPDATE_ORDER_STATUS',
          payload: { orderId: order.id, status: nextStatus }
        });
      }, 10000); // Update every 10 seconds for demo

      return () => clearTimeout(timer);
    }
  }, [order, dispatch]);

  // Simulate delivery boy movement
  useEffect(() => {
    if (!order || order.status !== 'picked_up') return;

    const interval = setInterval(() => {
      setDeliveryBoyLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [order]);

  const getEstimatedTime = () => {
    if (!order) return 'N/A';
    const orderTime = new Date(order.orderTime);
    const estimatedDelivery = new Date(order.estimatedDelivery);
    const now = new Date();
    
    if (order.status === 'delivered') return 'Delivered';
    
    const remainingTime = Math.max(0, estimatedDelivery - now);
    const minutes = Math.floor(remainingTime / (1000 * 60));
    
    return minutes > 0 ? `${minutes} min` : 'Arriving soon';
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-8">We couldn't find an order with ID: {orderId}</p>
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
        <p className="text-gray-600">Order ID: <span className="font-mono font-semibold">{order.id}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Status */}
        <div className="space-y-6">
          {/* Estimated Delivery */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-1">Estimated Delivery</h3>
                <p className="text-orange-100">Your delicious food is on the way!</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{getEstimatedTime()}</div>
                <p className="text-orange-100 text-sm">remaining</p>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Status</h3>
            <div className="space-y-4">
              {orderStatuses.map((status, index) => {
                const isCompleted = index <= getCurrentStatusIndex();
                const isCurrent = index === getCurrentStatusIndex();
                
                return (
                  <div key={status.id} className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-green-200 animate-pulse' : ''}`}>
                      {status.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                        {status.label}
                      </p>
                      {status.time && isCompleted && (
                        <p className="text-sm text-gray-500">{status.time}</p>
                      )}
                    </div>
                    {isCurrent && (
                      <div className="text-green-600 font-semibold text-sm">
                        In Progress
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Boy Info */}
          {order.status === 'picked_up' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Partner</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">R</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Rahul Sharma</p>
                  <p className="text-gray-600">Delivery Partner</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm text-gray-600">4.8 (250+ deliveries)</span>
                  </div>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  📞 Call
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Map & Order Details */}
        <div className="space-y-6">
          {/* Live Tracking Map */}
          {order.status === 'picked_up' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Tracking</h3>
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                {/* Simulated Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 opacity-50"></div>
                
                {/* Customer Location */}
                <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full">
                  🏠
                </div>
                <span className="absolute top-12 right-2 text-xs font-medium bg-white px-2 py-1 rounded shadow">
                  Your Location
                </span>

                {/* Delivery Boy Location */}
                <div className="absolute bottom-8 left-8 bg-blue-500 text-white p-2 rounded-full animate-bounce">
                  🚚
                </div>
                <span className="absolute bottom-16 left-4 text-xs font-medium bg-white px-2 py-1 rounded shadow">
                  Delivery Partner
                </span>

                {/* Route Line */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-0.5 bg-blue-500 opacity-60 transform rotate-45"></div>
                </div>

                <div className="text-center z-10">
                  <p className="text-gray-600 font-medium">📍 Live Location Tracking</p>
                  <p className="text-sm text-gray-500 mt-1">Distance: ~2.3 km</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h3>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {order.items.map((item) => (
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

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-semibold">₹{order.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">Cash on Delivery</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Time</span>
                <span className="font-semibold">
                  {new Date(order.orderTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors">
                <span>💬</span>
                <span>Chat with Support</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors">
                <span>📞</span>
                <span>Call Restaurant</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
