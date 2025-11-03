import { useApp } from '../context/AppContext';

const Debug = () => {
  const { cart, dispatch } = useApp();

  const addTestItem = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: 'test1',
        name: 'Test Item',
        price: 100,
        category: 'test',
        type: 'veg'
      }
    });
  };

  const clearCart = () => {
    cart.forEach(item => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cart State Debug</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(cart, null, 2)}</pre>
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={addTestItem}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Test Item
          </button>
          <button
            onClick={clearCart}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
        <div className="space-x-4">
          <a href="/cart" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block">
            Go to Cart
          </a>
          <a href="/checkout" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 inline-block">
            Go to Checkout
          </a>
          <a href="/menu" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 inline-block">
            Go to Menu
          </a>
        </div>
      </div>
    </div>
  );
};

export default Debug;
