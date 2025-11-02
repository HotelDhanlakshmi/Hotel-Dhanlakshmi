const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const allCategories = [{ id: 'all', name: 'All Items', icon: '🍽️' }, ...categories];

  return (
    <div className="bg-white shadow-sm border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
