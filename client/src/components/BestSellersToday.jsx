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
      // Silently fail - not critical
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  if (loading || bestSellers.length === 0) {
    return null; // Don't show anything if loading or no data
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <span className="text-white font-semibold text-sm">🔥 TODAY'S TOP 5</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Most Ordered Today
            </h2>
          </div>
          <p className="text-orange-100 text-xs hidden md:block">
            ⏰ Updated daily
          </p>
        </div>

        {/* Horizontal Scroll Cards - More Compact */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {bestSellers.map((item, index) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-48 bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 snap-start"
            >
              {/* Compact Header with Badge */}
              <div className="relative bg-gradient-to-br from-orange-100 to-red-100 h-20 flex items-center justify-center">
                <div className="absolute top-1 left-1 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
                  #{index + 1}
                </div>
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                  {item.soldCount}
                </div>
                <span className="text-3xl">
                  {item.product?.type === 'veg' ? '🥗' : '🍗'}
                </span>
              </div>

              {/* Compact Product Info */}
              <div className="p-3">
                <h3 className="font-bold text-gray-800 text-xs mb-1 line-clamp-2 h-8">
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-orange-600">
                    ₹{item.product?.price}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
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
      </div>
    </div>
  );
};

export default BestSellersToday;
