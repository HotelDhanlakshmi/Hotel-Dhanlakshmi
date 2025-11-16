import { useState } from 'react';

// --- Helper function to hold all translations ---
const getMarathiName = (englishName) => {
  const translations = {
    // Pizza/Burger
    'Veg Cheese Pizza': 'व्हेज चीज पिझ्झा',
    'Cheese Burst Pizza': 'चीज पिझ्झा',
    'Margarita Pizza': 'मार्गारिटा पिझ्झा',
    'Paneer Tikka Pizza': 'पनीर टिक्का पिझ्झा',
    'Mushroom Pizza': 'मशरूम पिझ्झा',
    'Cheese Pizza Puff': 'चीज पिझ्झा पफ',
    'Schezwan Pizza': 'शेजवान पिझ्झा',
    'Classic Onion': 'क्लासिक ओनियन',

    // Chicken
    'Egg Curry': 'अंडा करी',
    'Egg Masala': 'अंडा मसाला',
    'Chicken Curry': 'चिकन करी',
    'Chicken Roast': 'चिकन रोस्ट',
    'Chicken Fry': 'चिकन फ्राय',
    'Chicken Tawa': 'चिकन तवा',
    'Chicken 2 Piaz': 'चिकन २ प्याझ',
    'Chicken Kharda': 'चिकन खर्डा',
    'Chicken Tikka Masala': 'चिकन टिक्का मसाला',
    'Chicken Dahiwala': 'चिकन दहीवाला',
    'Butter Chicken Curry': 'बटर चिकन करी',
    'Chicken Handi Half': 'चिकन हंडी (हाफ)',
    'Chicken Malvani Full': 'चिकन मालवणी (फुल)',
    'Chicken Malvani Half': 'चिकन मालवणी (हाफ)',
    'Chicken Handi Full': 'चिकन हंडी (फुल)',

    // Mutton
    'Mutton Fry': 'मटण फ्राय',
    'Mutton Roast': 'मटण रोस्ट',
    'Mutton Kadhai': 'मटण कढाई',
    'Mutton Mughlai': 'मटण मुघलई',
    'Mutton Curry': 'मटण करी',
    'Mutton Dahiwala': 'मटण दहीवाला',
    'Mutton Bhuna': 'मटण भुना',
    'Mutton Do Pyaaz': 'मटण दो प्याझ',
    'Mutton Keema': 'मटण कीमा',
    'Mutton Malvani Half': 'मटण मालवणी (हाफ)',
    'Mutton Tikka Masala': 'मटण टिक्का मसाला',
    'Mutton Handi Half': 'मटण हंडी (हाफ)',

    // Fish
    'Fish Tawa Fry': 'फिश तवा फ्राय',
    'Fish Roast': 'फिश रोस्ट',
    'Fish Curry': 'फिश करी',
    'Fish Malvani Half': 'फिश मालवणी (हाफ)',
    'Fish Handi Half': 'फिश हंडी (हाफ)',
    'Fish Handi Full': 'फिश हंडी (फुल)',

    // Biryani
    'Egg Dum Biryani': 'अंडा दम बिर्याणी',
    'Veg Dum Biryani': 'व्हेज दम बिर्याणी',
    'Chicken Dum Biryani': 'चिकन दम बिर्याणी',
    'Chicken Hyderabadi Biryani': 'चिकन हैदराबादी बिर्याणी',
    'Chicken Arabian Biryani': 'चिकन अरेबियन बिर्याणी',
    'Chicken Tikka Biryani': 'चिकन टिक्का बिर्याणी',
    'Chicken Biryani 1kg': 'चिकन बिर्याणी (१ किलो)',
    'Chicken Biryani 500gm': 'चिकन बिर्याणी (५०० ग्रॅम)',
    'Mutton Dum Biryani': 'मटण दम बिर्याणी',
    'Mutton Tikka Biryani': 'मटण टिक्का बिर्याणी',
    'Mutton Hyderabadi Biryani': 'मटण हैदराबादी बिर्याणी',
    'Mutton Arabic Biryani': 'मटण अरबी बिर्याणी',
    'Mutton Biryani 500gm': 'मटण बिर्याणी (५०० ग्रॅम)',
    'Mutton Biryani 1kg': 'मटण बिर्याणी (१ किलो)',
  };

  return translations[englishName] || null; // Return the translation or null if not found
};
// --- End of helper function ---


const MenuCard = ({ item, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);

  // --- This variable now gets the translation ---
  const marathiName = getMarathiName(item.name);

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
      </div>

      {/* Content */}
      <div className="p-4">
        
        {/* --- MODIFIED NAME SECTION --- */}
        <div className="mb-4" style={{ minHeight: '3.5rem' }}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {item.name}
          </h3>
          {/* This now uses the 'marathiName' variable we created */}
          
        </div>
        {/* --- END OF MODIFICATION --- */}
        

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(item)}
          className="w-full maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-traditional"
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