import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';
import Hero from '../components/Hero';
import BestSellersToday from '../components/BestSellersToday';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const { cart, dispatch, isAuthenticated } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all'); // For highlighting the active button

  // Fetch menu data
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

  // --- NEW: Helper to scroll to category ---
  const scrollToCategory = (categoryId) => {
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

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  // --- GROUP ITEMS BY CATEGORY ---
  // If there is a search query, we filter ALL items first.
  // If no search, we group them by category.
  const displayMode = searchQuery ? 'search' : 'categories';

  const getFilteredItems = () => {
    if (!searchQuery) return allMenuItems;
    return allMenuItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Hero />
      <BestSellersToday />

      {/* Sticky Container */}
      <div className="sticky top-16 z-30 bg-white shadow-md border-b-2 border-gray-100">
        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-300 bg-white rounded-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 shadow-md"
              />
              <svg className="absolute left-3 top-2.5 sm:top-3.5 w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter (Now acts as Scroll Anchor) */}
        {/* Hide this if user is searching */}
        {!searchQuery && (
          <CategoryFilter
            categories={categories}
            selectedCategory={activeCategory}
            onCategoryChange={scrollToCategory} // Pass our scroll function
          />
        )}
      </div>


      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious menu items...</p>
          </div>
        ) : displayMode === 'search' ? (
          // --- SEARCH RESULTS MODE ---
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Results</h2>
            {getFilteredItems().length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFilteredItems().map(item => (
                  <MenuCard key={item.id} item={item} onAddToCart={handleAddToCart} isAuthenticated={isAuthenticated} />
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
          // --- CATEGORY SECTIONS MODE ---
          <div className="space-y-12">
            {categories.map(category => {
              // Find items for this category
              const categoryItems = allMenuItems.filter(item => item.category === category.id);
              
              // Only render category if it has items
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id} id={`category-${category.id}`} className="scroll-mt-48">
                  {/* Category Title */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-yellow-500 pl-4">
                    {category.name}
                  </h2>
                  
                  {/* Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryItems.map(item => (
                      <MenuCard 
                        key={item.id} 
                        item={item} 
                        onAddToCart={handleAddToCart} 
                        isAuthenticated={isAuthenticated} 
                      />
                    ))}
                  </div>
                  
                  {/* Divider */}
                  <hr className="mt-12 border-gray-100" />
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
            className="w-full bg-red-700 hover:bg-red-800 text-black font-bold py-4 px-6 rounded-full shadow-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105"
          >
            <span>🛒</span>
            <span>View Cart ({totalCartItems} {totalCartItems > 1 ? 'items' : 'item'})</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;