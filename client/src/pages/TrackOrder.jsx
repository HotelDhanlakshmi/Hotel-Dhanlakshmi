import { useState } from 'react';
import { useApp } from '../context/AppContext';

const TrackOrder = () => {
  const { orders } = useApp();
  const [mobile, setMobile] = useState('');
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!mobile || !orderId) {
      setError('कृपया मोबाईल नंबर आणि ऑर्डर ID टाका • Please enter mobile number and order ID');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('कृपया वैध मोबाईल नंबर टाका • Please enter valid mobile number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find order by mobile and order ID
      const order = orders.find(o => o.mobile === mobile && o.id === orderId);
      
      if (order) {
        setFoundOrder(order);
      } else {
        setError('ऑर्डर सापडला नाही • Order not found');
        setFoundOrder(null);
      }
    } catch (err) {
      setError('काहीतरी चूक झाली • Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      confirmed: {
        icon: '✅',
        text: 'Order Confirmed',
        marathi: 'ऑर्डर कन्फर्म',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      preparing: {
        icon: '👨‍🍳',
        text: 'Preparing Food',
        marathi: 'जेवण तयार करत आहे',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      ready: {
        icon: '📦',
        text: 'Ready for Pickup',
        marathi: 'पिकअपसाठी तयार',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      'out-for-delivery': {
        icon: '🚚',
        text: 'Out for Delivery',
        marathi: 'डिलिव्हरीसाठी निघाले',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      },
      delivered: {
        icon: '🎉',
        text: 'Delivered',
        marathi: 'डिलिव्हर झाले',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }
    };
    return statusMap[status] || statusMap.confirmed;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="marathi-heading text-3xl md:text-4xl mb-4 text-orange-600">
            🔍 ऑर्डर ट्रॅक करा 🔍
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600 marathi-text">
            तुमच्या ऑर्डरची स्थिती पहा • Check your order status
          </p>
        </div>

        {/* Search Form */}
        <div className="maharashtrian-card rounded-xl shadow-traditional p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📱 Mobile Number • मोबाईल नंबर
              </label>
              <input
                type="tel"
                placeholder="Enter mobile number • मोबाईल नंबर टाका"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                maxLength="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🆔 Order ID • ऑर्डर ID
              </label>
              <input
                type="text"
                placeholder="Enter order ID • ऑर्डर ID टाका"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleTrackOrder}
            disabled={isLoading || !mobile || !orderId}
            className="w-full maharashtrian-gradient hover:shadow-glow text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                Tracking... • शोधत आहे...
              </div>
            ) : (
              '🔍 Track Order • ऑर्डर ट्रॅक करा'
            )}
          </button>
        </div>

        {/* Order Details */}
        {foundOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="maharashtrian-card rounded-xl shadow-traditional p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Order #{foundOrder.id}</h2>
                  <p className="text-gray-600 marathi-text">ऑर्डर तपशील • Order Details</p>
                </div>
                <div className={`px-4 py-2 rounded-full ${getStatusInfo(foundOrder.status).bgColor}`}>
                  <span className={`font-semibold ${getStatusInfo(foundOrder.status).color}`}>
                    {getStatusInfo(foundOrder.status).icon} {getStatusInfo(foundOrder.status).text}
                  </span>
                  <div className={`text-xs ${getStatusInfo(foundOrder.status).color} marathi-text`}>
                    {getStatusInfo(foundOrder.status).marathi}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Order Time:</span>
                  <div className="font-semibold">{formatTime(foundOrder.timestamp)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Total Amount:</span>
                  <div className="font-semibold text-orange-600">₹{foundOrder.total}</div>
                </div>
                <div>
                  <span className="text-gray-500">Payment:</span>
                  <div className="font-semibold">Cash on Delivery</div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="maharashtrian-card rounded-xl shadow-traditional p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🍽️ Order Items • ऑर्डर केलेले पदार्थ
              </h3>
              <div className="space-y-3">
                {foundOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-orange-600">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="maharashtrian-card rounded-xl shadow-traditional p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🏠 Delivery Address • डिलिव्हरी पत्ता
              </h3>
              <div className="text-gray-700">
                <div className="font-semibold">{foundOrder.address.name}</div>
                <div>{foundOrder.address.street}</div>
                <div>{foundOrder.address.city}, {foundOrder.address.state} - {foundOrder.address.pincode}</div>
                <div className="mt-2 text-sm text-gray-500">Mobile: {foundOrder.mobile}</div>
              </div>
            </div>

            {/* Support */}
            <div className="maharashtrian-card rounded-xl shadow-traditional p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🆘 Need Help? • मदत हवी आहे?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+919876543210"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  📞 Call Support • सपोर्टला कॉल करा
                </a>
                <a
                  href="https://wa.me/919876543210"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  💬 WhatsApp • व्हाट्सअप
                </a>
              </div>
            </div>
          </div>
        )}

        {/* No Order Found State */}
        {!foundOrder && !isLoading && mobile && orderId && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2 marathi-heading">
              ऑर्डर सापडला नाही
            </h3>
            <p className="text-xl text-gray-600 mb-6">Order Not Found</p>
            <p className="text-gray-500 mb-8">
              Please check your mobile number and order ID • कृपया तुमचा मोबाईल नंबर आणि ऑर्डर ID तपासा
            </p>
            <button
              onClick={() => {
                setMobile('');
                setOrderId('');
                setError('');
              }}
              className="maharashtrian-gradient text-white font-semibold py-3 px-6 rounded-lg transition-all hover:shadow-glow"
            >
              🔄 Try Again • पुन्हा प्रयत्न करा
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
