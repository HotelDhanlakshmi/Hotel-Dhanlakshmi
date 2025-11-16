import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const allCategories = [{ id: 'all', name: 'All Items' }, ...categories];

  return (
    // --- MODIFICATION: Reduced vertical padding from py-6 to py-4 ---
    <div className="bg-white shadow-traditional border-y-2 maharashtrian-border sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* --- MODIFICATION: Reduced margin-bottom from mb-4 to mb-3 --- */}
        <div className="text-center mb-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            Choose Category
          </h3>
        </div>

        <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2">
          {allCategories.map((category) => {
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                
                // --- MODIFICATION: Changed padding from p-3 to px-4 py-2 ---
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-200 shadow-traditional overflow-hidden ${
                  selectedCategory === category.id
                    ? 'bg-white text-orange-600 shadow-glow scale-105'
                    : 'maharashtrian-gradient text-white hover:shadow-glow hover:scale-105'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium whitespace-nowrap">{category.name}</div>
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