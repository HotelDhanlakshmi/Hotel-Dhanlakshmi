import { useState } from 'react';

const MenuCard = ({ item, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

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

  return (
    // --- MODIFICATION: Added 'hover:-translate-y-1' for a lift effect ---
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-500 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 bg-gray-900">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            // --- MODIFICATION: Removed 'group-hover:scale-110' ---
            className="w-full h-full object-cover transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
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

        {/* Price Badge (Gold) */}
        <div className="absolute top-3 right-3">
          <span className="bg-yellow-500 text-black px-3 py-2 rounded-full text-sm font-bold shadow-md">
            ₹{item.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        
        {/* Name centered */}
        <div className="mb-3 text-center" style={{ minHeight: '3.5rem' }}>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {item.name}
          </h3>
        </div>
        
        {/* Add to Cart Button (Gold/Amber) */}
        <button
          onClick={() => onAddToCart(item)}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
        >
          <span className="flex items-center justify-center space-x-0">
            <span>Add to Cart</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default MenuCard;