import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- Helper functions copied from MenuCard ---
const getTypeColor = (type) => {
  switch (type) {
    case 'veg': return 'text-green-800 bg-green-100';
    case 'non-veg': return 'text-red-800 bg-red-100';
    case 'egg': return 'text-yellow-800 bg-yellow-100';
    default: return 'text-gray-800 bg-gray-100';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'veg': return '🟢';
    case 'non-veg': return '🔴';
    case 'egg': return '🟡';
    default: return '⚪';
  }
};
// --- End of helper functions ---


const BestSellersToday = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useApp();
  
  // --- State to handle image errors for multiple cards ---
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/best-sellers/today`);
      if (response.ok) {
        const data = await response.json();
        setBestSellers(data.data || []);
      }
    } catch (error) {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };
  
  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  if (loading || bestSellers.length === 0) {
    return null; 
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <hr className="border-t-2 border-orange-200 mb-8" />
        
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Most Ordered Today
          </h2>
        </div>

        {/* --- Card Grid --- */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory justify-start md:justify-center">
          {bestSellers.map((item, index) => {
            const product = item.product; // Get the nested product object
            if (!product) return null; // Skip if product data is missing

            return (
              // --- MODIFICATION: Using MenuCard's styles ---
              <div
                key={product.id}
                className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-500 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-900">
                  {imageErrors[product.id] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-6xl opacity-70">🍽️</span>
                    </div>
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                      onError={() => handleImageError(product.id)}
                    />
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-md ${getTypeColor(product.type)}`}>
                      <span className="mr-1">{getTypeIcon(product.type)}</span>
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </span>
                  </div>

                  {/* Price Badge (Gold) */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-yellow-500 text-black px-3 py-2 rounded-full text-sm font-bold shadow-md">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* --- ADDED: Best Seller Badges --- */}
                  <div className="absolute bottom-3 left-3 bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md">
                    #{index + 1}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-semibold shadow-md">
                    {item.soldCount} Sold
                  </div>
                  {/* --- END OF ADDED BADGES --- */}

                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Name centered */}
                  <div className="mb-3 text-center" style={{ minHeight: '3.5rem' }}>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  
                  {/* Add to Cart Button (Gold/Amber) */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    <span className="flex items-center justify-center space-x-0">
                      <span>Add to Cart</span>
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <hr className="border-t-2 border-orange-200 mt-8" />
        
      </div>
    </div>
  );
};

export default BestSellersToday;