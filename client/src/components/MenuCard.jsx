import { useState } from 'react';

const MenuCard = ({ item, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case 'veg': return 'text-green-600 bg-green-100';
      case 'non-veg': return 'text-red-600 bg-red-100';
      case 'egg': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-50">🍽️</span>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
            <span className="mr-1">{getTypeIcon(item.type)}</span>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold shadow-md">
            ₹{item.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-600">4.5 (120+)</span>
          </div>
          <span className="text-sm text-gray-500">30-40 min</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(item)}
          className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
