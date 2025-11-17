import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { cart } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if admin is logged in
  const isAdminLoggedIn = !!localStorage.getItem('admin_session');

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Don't show navbar for admin users
  if (isAdminLoggedIn) {
    return null;
  }

  return (
    // --- MODIFICATION: Dark background, sticky, and z-index ---
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {/* --- MODIFICATION: Updated logo gradient --- */}
            <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center shadow-lg p-1">
              <img 
                src="https://img.freepik.com/premium-vector/logo-steak-restaurant-with-fork-knife_1240970-33805.jpg?semt=ais_hybrid&w=740&q=80" 
                alt="Hotel Dhanlakshmi Logo" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gray-800 rounded-full items-center justify-center text-yellow-500 font-bold text-xl hidden">
                🍽️
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {/* --- MODIFICATION: Gold text color --- */}
                <span className="marathi-heading text-yellow-500">हॉटेल धनलक्ष्मी</span>
              </h1>
              {/* --- MODIFICATION: Light gray text color --- */}
              <p className="text-xs text-gray-400 marathi-text">पारंपारिक महाराष्ट्रीयन स्वाद</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* --- MODIFICATION: Light text, gold hover --- */}
            <Link to="/" className="text-gray-300 hover:text-yellow-500 font-medium transition-colors">
              Home
            </Link>
            <Link to="/menu" className="text-gray-300 hover:text-yellow-500 font-medium transition-colors">
              Menu
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-yellow-500 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-yellow-500 font-medium transition-colors">
              Contact
            </Link>
            <Link to="/orders" className="text-gray-300 hover:text-yellow-500 font-medium transition-colors">
              My Orders
            </Link>
            <Link to="/admin/login" className="text-gray-300 hover:text-yellow-500 font-medium transition-colors">
              Admin
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-yellow-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* --- MODIFICATION: Gold button --- */}
            <Link to="/track-order" className="hidden sm:block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors shadow-md">
              Track Order
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-yellow-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* --- MODIFICATION: Dark mobile menu --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-300 hover:text-yellow-500 font-medium py-2 transition-colors">
                Home
              </Link>
              <Link to="/menu" className="text-gray-300 hover:text-yellow-500 font-medium py-2 transition-colors">
                Menu
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-yellow-500 font-medium py-2 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-yellow-500 font-medium py-2 transition-colors">
                Contact
              </Link>
              <Link to="/orders" className="text-gray-300 hover:text-yellow-500 font-medium py-2 transition-colors">
                My Orders
              </Link>
              <Link to="/admin/login" className="text-gray-300 hover:text-yellow-500 font-medium py-2 transition-colors">
                Admin
              </Link>
              <Link to="/track-order" className="text-gray-300 hover:text-yellow-500 font-medium py-2 transition-colors">
                Track Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;