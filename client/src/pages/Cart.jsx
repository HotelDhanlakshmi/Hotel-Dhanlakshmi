import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { cart, dispatch, isAuthenticated } = useApp();

  const updateQuantity = (itemId, newQuantity) => {
    dispatch({
      type: 'UPDATE_CART_QUANTITY',
      payload: { id: itemId, quantity: newQuantity }
    });
  };

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login to View Cart</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to access your cart and place orders.</p>
          <button
            onClick={() => dispatch({ type: 'SHOW_AUTH_MODAL', payload: 'login' })}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any delicious items to your cart yet.</p>
          <Link
            to="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart</h1>
        <p className="text-gray-600">{getTotalItems()} items in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">₹{item.price} each</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'veg' ? 'text-green-600 bg-green-100' :
                    item.type === 'non-veg' ? 'text-red-600 bg-red-100' :
                    'text-yellow-600 bg-yellow-100'
                  }`}>
                    {item.type === 'veg' ? '🟢' : item.type === 'non-veg' ? '🔴' : '🟡'} {item.type}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
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
                <span className="font-semibold">Total</span>
                <span className="font-bold text-orange-600">₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-center block"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <span>✅</span>
                <span className="text-sm font-medium">Cash on Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
