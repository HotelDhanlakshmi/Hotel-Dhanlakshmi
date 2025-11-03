import React from 'react'; // Added React import, which is good practice

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  // Added "All Items" category (English only)
  const allCategories = [{ id: 'all', name: 'All Items', icon: '🍽️' }, ...categories];

  // Removed the getMarathiName function and marathiNames const
  // Removed the categoriesWithMarathi map

  return (
    <div className="bg-white shadow-traditional border-y-2 maharashtrian-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-4">
          {/* Removed Marathi heading, styled English as main heading */}
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            Choose Category
          </h3>
        </div>
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2">
          {/* Map directly over allCategories */}
          {allCategories.map((category) => (
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
                {/* Removed the Marathi text div */}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;