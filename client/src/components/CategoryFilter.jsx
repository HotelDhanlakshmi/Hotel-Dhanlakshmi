import React from 'react';

// --- Helper function to hold all category translations ---
const getMarathiName = (englishName) => {
  const translations = {
    'All Items': 'सर्व पदार्थ',
    'Pizza/Burger': 'पिझ्झा/बर्गर',
    'Chicken': 'चिकन',
    'Mutton': 'मटण',
    'Fish': 'मासे',
    'Rice/Roti': 'भात/रोटी',
    'Paratha': 'पराठा',
    'Starters': 'स्टार्टर्स',
    'Biryani': 'बिर्याणी',
    
    // --- ADDED THE REMAINING TRANSLATIONS ---
    'Chinese-Veg': 'चायनीज व्हेज',
    'Chinese Non-Veg': 'चायनीज नॉन-व्हेज',
    'Veg-Main Course': 'व्हेज मुख्य पदार्थ',
    'Tandoori/Kabab': 'तंदूरी/कबाब',
    'Sp.Thali': 'स्पेशल थाळी',
    'Beverages': 'पेये',
    'Soups': 'सूप'
    // --- END OF ADDITION ---
  };
  return translations[englishName] || null; // Return translation or null
};
// --- End of helper function ---

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  // Added "All Items" category (English only)
  const allCategories = [{ id: 'all', name: 'All Items', icon: '🍽️' }, ...categories];

  return (
    <div className="bg-white shadow-traditional border-y-2 maharashtrian-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Added Marathi heading back */}
        <div className="text-center mb-4">
          <h3 className="marathi-heading text-xl text-orange-600 mb-1">श्रेणी निवडा</h3>
          <p className="text-sm text-gray-600">Choose Category</p>
        </div>

        <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2">
          {/* Map directly over allCategories */}
          {allCategories.map((category) => {
            
            // --- MODIFICATION ---
            // Get the Marathi name using our helper function
            const marathiName = getMarathiName(category.name);
            // --- END OF MODIFICATION ---

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-200 shadow-traditional ${
                  selectedCategory === category.id
                    ? 'maharashtrian-gradient text-white shadow-glow transform scale-105 animate-pulse-saffron'
                    : 'maharashtrian-card text-gray-700 hover:shadow-glow hover:scale-105'
                }`}
              >
                <span className="text-3xl">{category.icon}</span>
                <div className="text-center">
                  <div className="text-sm font-medium whitespace-nowrap">{category.name}</div>
                  
                  {/* --- MODIFICATION --- */}
                  {/* This now uses the 'marathiName' variable */}
                  {marathiName && (
                    <div className="marathi-text text-xs opacity-80 whitespace-nowrap">
                      {marathiName}
                    </div>
                  )}
                  {/* --- END OF MODIFICATION --- */}

                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;