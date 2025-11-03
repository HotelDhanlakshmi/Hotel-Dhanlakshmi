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
    <div className="maharashtrian-card rounded-xl shadow-traditional hover:shadow-glow transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 maharashtrian-gradient">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center traditional-pattern">
            <span className="text-6xl opacity-70">🍽️</span>
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-md ${getTypeColor(item.type)}`}>
            <span className="mr-1">{getTypeIcon(item.type)}</span>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white text-orange-600 px-3 py-2 rounded-full text-sm font-bold shadow-traditional animate-pulse-saffron">
            ₹{item.price}
          </span>
        </div>

        {/* Removed Special Badge */}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-2">
          {item.name}
        </h3>
        
        {/* Removed Rating and Time */}
        {/*
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-600">4.5</span>
            <span className="text-xs text-gray-500 marathi-text">(१२०+ रेटिंग)</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">30-40 min</div>
            <div className="text-xs text-gray-400 marathi-text">३०-४० मिनिटे</div>
          </div>
        </div>
        */}

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(item)}
          className="w-full maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-traditional"
        >
          <span className="flex items-center justify-center space-x-0"> {/* Removed space-x-2 and cart symbol */}
            <span>Add to Cart</span>
          </span>
          {/* Removed Marathi text for add to cart */}
          {/*
          <div className="text-xs opacity-90 marathi-text mt-1">
            कार्टमध्ये जोडा
          </div>
          */}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;