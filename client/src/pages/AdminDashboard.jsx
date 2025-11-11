import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// CORRECT
import CouponManager from "./CouponManager";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // --- MODIFICATION: Set default tab to 'overview' to match your tab array
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    totalProducts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    type: 'veg',
    image: '',
    available: true
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Check admin session
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
      navigate('/admin/login');
      return;
    }

    const session = JSON.parse(adminSession);
    // Check if session is expired (24 hours)
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      localStorage.removeItem('admin_session');
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch orders
      const ordersResponse = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024'
        }
      });

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.data || []);

        // Calculate stats
        const totalOrders = ordersData.data?.length || 0;
        const pendingOrders = ordersData.data?.filter(order =>
          ['pending', 'confirmed', 'preparing'].includes(order.status)
        ).length || 0;

        const today = new Date().toDateString();
        const todayRevenue = ordersData.data?.filter(order =>
          new Date(order.createdAt).toDateString() === today
        ).reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

        // Fetch products from database
        const productsResponse = await fetch(`${API_URL}/api/admin/products`, {
          headers: {
            'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024'
          }
        });

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const productsList = productsData.data || [];
          setProducts(productsList);

          setStats({
            totalOrders,
            pendingOrders,
            todayRevenue,
            totalProducts: productsList.length
          });
        } else {
          setStats({
            totalOrders,
            pendingOrders,
            todayRevenue,
            totalProducts: 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/', { replace: true });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order:', orderId, 'to status:', newStatus);

      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (response.ok) {
        // Update local state immediately for better UX
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );

        // Show success message
        console.log('✅ Order status updated successfully');

        // Optionally refresh data from server
        // fetchData();
      } else {
        console.error('Failed to update order status:', data.error);
        alert(`Failed to update order status: ${data.error || 'Unknown error'}`);
        // Refresh to revert the change
        fetchData();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Network error: Unable to update order status');
    }
  };

  // Product Management Functions
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        type: product.type || 'veg',
        image: product.image || '',
        available: product.available !== false
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        type: 'veg',
        image: '',
        available: true
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      type: 'veg',
      image: '',
      available: true
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        id: editingProduct ? editingProduct.id : `item_${Date.now()}`
      };

      const url = editingProduct
        ? `${API_URL}/api/admin/products/${editingProduct.id}`
        : `${API_URL}/api/admin/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        closeProductModal();
        fetchData(); // Refresh data
        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'Failed to save product'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': import.meta.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024'
        }
      });

      if (response.ok) {
        fetchData(); // Refresh data
        alert('Product deleted successfully!');
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'Failed to delete product'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HD</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Hotel Dhanlakshmi</h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh"
              >
                ↻
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">TO</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalOrders}</div>
                <div className="text-gray-600">Total Orders</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 font-bold">PO</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
                <div className="text-gray-600">Pending Orders</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">₹</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">₹{stats.todayRevenue}</div>
                <div className="text-gray-600">Today's Revenue</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold">TP</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
                <div className="text-gray-600">Total Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'orders', name: 'Orders' },
                { id: 'products', name: 'Products' },
                { id: 'coupons', name: 'Coupons' },
                { id: 'settings', name: 'Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

                {/* Recent Orders */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.mobile}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              ₹{order.total}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Orders</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.id}</div>
                              <div className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.address.name}</div>
                              <div className="text-sm text-gray-500">+91 {order.mobile}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {order.items.map((item, index) => (
                                <div key={index}>
                                  {item.name} x{item.quantity}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ₹{order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`text-sm border border-gray-300 rounded px-2 py-1 ${getStatusColor(order.status)}`}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="out-for-delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => alert(`Order Details:\n\nID: ${order.id}\nCustomer: ${order.address.name}\nMobile: +91 ${order.mobile}\nAddress: ${order.address.street}, ${order.address.city}\nTotal: ₹${order.total}\n\nItems:\n${order.items.map(item => `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
                  <button
                    onClick={() => openProductModal()}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Add New Product</span>
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-gray-400">+</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first product to the menu.</p>
                    <button
                      onClick={() => openProductModal()}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all"
                    >
                      Add First Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.type === 'veg' ? 'bg-green-100 text-green-800' :
                                product.type === 'non-veg' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                              }`}>
                              {product.type === 'veg' ? 'VEG' : product.type === 'non-veg' ? 'NON-VEG' : 'EGG'}
                            </span>
                          </div>
                          {!product.available && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Unavailable
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                            <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                          </div>

                          {product.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                          )}

                          {product.category && (
                            <div className="mb-3">
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {product.category}
                              </span>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <button
                              onClick={() => openProductModal(product)}
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                            >
                              <span>✎</span>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors flex items-center justify-center space-x-1"
                            >
                              <span>×</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- 2. ADD THE LOGIC TO RENDER THE COUPON MANAGER --- */}
            {activeTab === 'coupons' && (
              <CouponManager />
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Restaurant Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                        <input
                          type="text"
                          defaultValue="Hotel Dhanlakshmi"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+91 9876543210"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Order Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
                        <input
                          type="number"
                          defaultValue="200"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max COD Amount</label>
                        <input
                          type="number"
                          defaultValue="2000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (minutes)</label>
                        <input
                          type="number"
                          defaultValue="40"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button className="maharashtrian-gradient hover:shadow-glow text-white px-6 py-3 rounded-lg transition-all">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={closeProductModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="pizza-burger">Pizza/Burger</option>
                      <option value="chicken">Chicken</option>
                      <option value="mutton">Mutton</option>
                      <option value="fish">Fish</option>
                      <option value="rice-roti">Rice/Roti</option>
                      <option value="paratha">Paratha</option>
                      <option value="starters">Starters</option>
                      <option value="biryani">Biryani</option>
                      <option value="chinese-veg">Chinese-Veg</option>
                      <option value="chinese-non-veg">Chinese Non-Veg</option>
                      <option value="veg-main-course">Veg-Main Course</option>
                      <option value="tandoori-kabab">Tandoori/Kabab</option>
                      <option value="sp-thali">Sp.Thali</option>
                      <option value="beverages">Beverages</option>
                      <option value="soups">Soups</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Food Type *
                    </label>
                    <select
                      required
                      value={productForm.type}
                      onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                      <option value="egg">Egg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image URL"
                  />
                  {productForm.image && (
                    <div className="mt-2">
                      <img
                        src={productForm.image}
                        alt="Preview"
                        className="w-32 h-24 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    checked={productForm.available}
                    onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="available" className="text-sm text-gray-700">
                    Product is available for ordering
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeProductModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;