import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BestSellersToday = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useApp();

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
    // We pass the full 'product' object to the cart
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  if (loading || bestSellers.length === 0) {
    return null; 
  }

  return (
    // --- MODIFICATION: Reduced vertical padding ---
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- REMOVED: Section Divider (Start) --- */}
        
        {/* --- Centralized Header (Simplified) --- */}
        <div className="text-center mb-6">
          <div className="bg-orange-100 inline-block rounded-full px-5 py-2 mb-3">
            <span className="text-orange-700 font-semibold text-base">🔥 TODAY'S TOP 5</span>
          </div>
          {/* --- MODIFICATION: Reduced heading size --- */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Most Ordered Today
          </h2>
          {/* --- REMOVED: Subtitle p tag --- */}
        </div>

        {/* --- Card Grid (Smaller Cards) --- */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory justify-start md:justify-center">
          {bestSellers.map((item, index) => (
            <div
              key={item.product.id}
              // --- MODIFICATION: Made card smaller and removed hover effect ---
              className="flex-shrink-0 w-48 bg-white rounded-xl shadow-lg overflow-hidden snap-start border border-gray-100"
            >
              {/* Product Image/Emoji Section */}
              <div className="relative bg-gradient-to-br from-orange-50 to-red-50 h-28 flex items-center justify-center">
                {/* Ranking Badge */}
                <div className="absolute top-2 left-2 bg-orange-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs shadow-md">
                  #{index + 1}
                </div>
                {/* Sold Count Badge */}
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold shadow-md">
                  {item.soldCount} Sold
                </div>

                {/* Image or Emoji Display */}
                {item.product?.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // --- MODIFICATION: Smaller emoji ---
                  <span className="text-4xl">
                    {item.product?.type === 'veg' ? '🥗' : '🍗'}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 flex flex-col justify-between flex-grow">
                {/* Name */}
                <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 h-10">
                  {item.product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  {/* Price */}
                  <span className="text-lg font-bold text-orange-700">
                    ₹{item.product.price}
                  </span>
                  {/* Type */}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    item.product?.type === 'veg' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.product?.type === 'veg' ? '🟢' : '🔴'}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(item.product)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors text-xs"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- REMOVED: Section Divider (End) --- */}
        
      </div>
    </div>
  );
};

export default BestSellersToday;