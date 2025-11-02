const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const allCategories = [{ id: 'all', name: 'All Items', icon: '🍽️', marathi: 'सर्व पदार्थ' }, ...categories];

  // Add Marathi names to categories
  const categoriesWithMarathi = allCategories.map(cat => ({
    ...cat,
    marathi: cat.marathi || getMarathiName(cat.name)
  }));

  function getMarathiName(name) {
    const marathiNames = {
      'All Items': 'सर्व पदार्थ',
      'Pizza/Burger': 'पिझ्झा/बर्गर',
      'Chicken': 'चिकन',
      'Mutton': 'मटण',
      'Fish': 'मासे',
      'Rice/Roti': 'भात/रोटी',
      'Paratha': 'पराठा',
      'Starters': 'स्टार्टर्स',
      'Biryani': 'बिर्याणी',
      'Chinese-Veg': 'चायनीज-व्हेज',
      'Chinese Non-Veg': 'चायनीज नॉन-व्हेज',
      'Veg-Main Course': 'व्हेज मुख्य पदार्थ',
      'Tandoori/Kabab': 'तंदूरी/कबाब',
      'Sp.Thali': 'स्पेशल थाळी',
      'Beverages': 'पेये',
      'Soups': 'सूप'
    };
    return marathiNames[name] || name;
  }

  return (
    <div className="bg-white shadow-traditional border-y-2 maharashtrian-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-4">
          <h3 className="marathi-heading text-xl text-orange-600 mb-1">श्रेणी निवडा</h3>
          <p className="text-sm text-gray-600">Choose Category</p>
        </div>
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2">
          {categoriesWithMarathi.map((category) => (
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
                <div className="marathi-text text-xs opacity-80 whitespace-nowrap">{category.marathi}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
