import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const allCategories = [{ id: 'all', name: 'All Items' }, ...categories];

  return (
    <div className="bg-white shadow-traditional border-y-2 maharashtrian-border w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="text-center mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
            Choose Category
          </h3>
        </div>

        <div className="flex overflow-x-auto space-x-2 sm:space-x-3 md:space-x-4 scrollbar-hide pb-2 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8">
          {allCategories.map((category) => {
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-200 shadow-traditional overflow-hidden whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-white text-orange-600 shadow-glow scale-105'
                    : 'maharashtrian-gradient text-white hover:shadow-glow hover:scale-105'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium">{category.name}</div>
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