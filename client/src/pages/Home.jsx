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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/menu`);
        if (response.ok) {
          const menuData = await response.json();
          setCategories(menuData.categories || []);
          setAllMenuItems(menuData.items || []);
          setFilteredItems((menuData.items || []).slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filter logic
  useEffect(() => {
    let items = selectedCategory === 'all' 
      ? allMenuItems 
      : allMenuItems.filter(item => item.category === selectedCategory);

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // On Home page, limit non-"all" categories to 8 items
    if (selectedCategory === 'all') {
      setFilteredItems(items); 
    } else {
      setFilteredItems(items.slice(0, 8));
    }
  }, [selectedCategory, searchQuery, allMenuItems]);

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Best Sellers Today */}
      <BestSellersToday />

      {/* --- This is now ONE sticky container for Search + Categories --- */}
      <div className="sticky top-16 z-30 bg-white shadow-md border-b-2 border-orange-200">
        
        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="max-w-2xl mx-auto"> 
            <div className="relative">
              <input
                type="text"
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-orange-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base shadow-lg shadow-orange-500/20"
              />
              <svg className="absolute left-3 top-2.5 sm:top-3.5 w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter (is now inside the sticky container) */}
        {/* IMPORTANT: Make sure you REMOVED 'sticky' from the CategoryFilter.jsx file */}
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      {/* --- END OF STICKY CONTAINER --- */}


      {/* Menu Items Section */}
      <div id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory === 'all' ? 'All Items' : 
             categories.find(cat => cat.id === selectedCategory)?.name || 'Menu Items'}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredItems.length} items available
            {selectedCategory === 'all' && filteredItems.length > 8 && (
              <span className="ml-2 text-green-600 font-medium">• Showing all products</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious menu items...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id || item._id}
                item={item}
                onAddToCart={handleAddToCart}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {/* Sticky "View Cart" Button */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4">
          <Link
            to="/cart"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-full shadow-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105"
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