import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Menu = () => {
  const { cart, dispatch, isAuthenticated } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: State for active scrolling category ---
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu`);
        if (response.ok) {
          const menuData = await response.json();
          setCategories(menuData.categories || []);
          setAllMenuItems(menuData.items || []);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  // --- NEW: Scroll to Category Function ---
  const scrollToCategory = (categoryId) => {
    if (categoryId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveCategory('all');
      return;
    }

    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Offset for the sticky header (approx 180px)
      const headerOffset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Calculate total items in cart
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  // --- LOGIC: Filter items only if searching ---
  const getDisplayItems = () => {
    if (searchQuery) {
      return allMenuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return allMenuItems;
  };

  const isSearchMode = searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-green-50">
      
      {/* Sticky Header Container */}
      <div className="sticky top-16 z-30 bg-white shadow-md border-b-2 border-green-100">
        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border-2 border-green-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base shadow-lg shadow-green-500/10"
              />
              <svg className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Category Filter - Hide if searching */}
        {!isSearchMode && (
          <CategoryFilter 
            categories={categories}
            selectedCategory={activeCategory}
            onCategoryChange={scrollToCategory} // Pass our new scroll function
          />
        )}
      </div>


      {/* Menu Items Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious menu items...</p>
          </div>
        ) : isSearchMode ? (
          // --- SEARCH MODE: Simple Grid ---
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h2>
            {getDisplayItems().length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getDisplayItems().map((item) => (
                  <MenuCard key={item.id || item._id} item={item} onAddToCart={handleAddToCart} isAuthenticated={isAuthenticated} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-600">Try a different search term.</p>
              </div>
            )}
          </div>
        ) : (
          // --- NORMAL MODE: Grouped by Category ---
          <div className="space-y-12 pb-20">
            {categories.map(category => {
              // Filter items for this specific category
              const categoryItems = allMenuItems.filter(item => item.category === category.id);
              
              // Skip category if empty
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id} id={`category-${category.id}`} className="scroll-mt-48">
                  {/* Category Title */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-3">
                    {category.name}
                  </h2>
                  
                  {/* Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryItems.map((item) => (
                      <MenuCard 
                        key={item.id || item._id} 
                        item={item} 
                        onAddToCart={handleAddToCart} 
                        isAuthenticated={isAuthenticated} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky "View Cart" Button */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
          <Link
            to="/cart"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-6 rounded-full shadow-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105"
          >
            <span>🛒</span>
            <span>View Cart ({totalCartItems} {totalCartItems > 1 ? 'items' : 'item'})</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;