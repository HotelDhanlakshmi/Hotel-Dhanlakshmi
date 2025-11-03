import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';

const Menu = () => {
  const { dispatch, isAuthenticated } = useApp();
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
        const response = await fetch('http://localhost:5000/api/menu');
        if (response.ok) {
          const menuData = await response.json();
          setCategories(menuData.categories || []);
          setAllMenuItems(menuData.items || []);
          setFilteredItems(menuData.items || []);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    let items = selectedCategory === 'all' 
      ? allMenuItems 
      : allMenuItems.filter(item => item.category === selectedCategory);

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(items);
  }, [selectedCategory, searchQuery, allMenuItems]);

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header Section */}
      <div className="maharashtrian-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="marathi-heading text-3xl md:text-4xl mb-4">
            🍽️ आमचा मेनू 🍽️
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover the authentic flavors of <span className="marathi-text font-semibold">महाराष्ट्र</span> 
            with our carefully curated selection of traditional and modern dishes.
          </p>
          <div className="marathi-text text-lg mt-4 opacity-90">
            "जेवणाचा आस्वाद घ्या" - Enjoy the taste of food
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for delicious food... | जेवण शोधा..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-traditional marathi-text"
            />
            <svg className="absolute left-4 top-4.5 w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedCategory === 'all' ? (
              <span>
                <span className="marathi-heading text-orange-600">सर्व पदार्थ</span> • All Items
              </span>
            ) : (
              <span>
                <span className="marathi-heading text-orange-600">
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </span>
              </span>
            )}
          </h2>
          <p className="text-gray-600 marathi-text">
            {filteredItems.length} पदार्थ उपलब्ध • {filteredItems.length} items available
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <>
            {/* Featured Items Banner */}
            {selectedCategory === 'all' && (
              <div className="mb-8 maharashtrian-card p-6 rounded-xl shadow-traditional">
                <div className="text-center">
                  <div className="marathi-heading text-2xl text-orange-600 mb-2">
                    🌟 आजचे स्पेशल 🌟
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Today's Special</h3>
                  <p className="text-gray-600 marathi-text">
                    आमच्या शेफच्या खास शिफारशी • Chef's Special Recommendations
                  </p>
                </div>
              </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading delicious menu items...</p>
                </div>
              ) : (
                <>
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

                  {filteredItems.length === 0 && !loading && (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
                      <p className="text-gray-600">
                        {searchQuery 
                          ? `No items match "${searchQuery}". Try a different search term.`
                          : 'No items available in this category.'
                        }
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">🔍</div>
            <div className="marathi-heading text-2xl text-gray-600 mb-2">
              काहीही सापडले नाही
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-4">No items found</h3>
            <p className="text-gray-500 marathi-text mb-6">
              कृपया आपला शोध किंवा श्रेणी बदलून पहा
            </p>
            <p className="text-gray-500 mb-8">
              Try adjusting your search or category filter
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="maharashtrian-gradient text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-traditional"
            >
              🔄 Reset Filters • फिल्टर रीसेट करा
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="marathi-heading text-2xl text-orange-600 mb-4">
            🛒 आता ऑर्डर करा! 🛒
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Order?</h3>
          <p className="text-xl text-gray-600 mb-8 marathi-text">
            तुमच्या आवडत्या जेवणाची ऑर्डर द्या आणि घरबसल्या स्वादिष्ट जेवणाचा आनंद घ्या!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg">
              <span className="font-semibold">✅ Cash on Delivery Available</span>
              <div className="marathi-text text-sm">घरपोच पेमेंट उपलब्ध</div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg">
              <span className="font-semibold">🚚 Free Home Delivery</span>
              <div className="marathi-text text-sm">मोफत होम डिलिव्हरी</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
