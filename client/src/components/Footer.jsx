import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: About */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="marathi-heading text-yellow-500">हॉटेल धनलक्ष्मी</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Serving authentic Maharashtrian flavors since 1990. We believe in "Atithi Devo Bhava" - The Guest is God.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-yellow-500 transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-yellow-500 transition-colors">Menu</Link></li>
              <li><Link to="/about" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-500 transition-colors">Contact</Link></li>
              <li><Link to="/track-order" className="hover:text-yellow-500 transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="flex-shrink-0 mr-2 mt-1">📍</span>
                <span>Nagar Manmad Road, SH 10, Rahuri Factory, Maharashtra 413706</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 mr-2 mt-1">📞</span>
                <a href="tel:+917276133639" className="hover:text-yellow-500 transition-colors">
                  +91 7276133639
                </a>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 mr-2 mt-1">✉️</span>
                <a href="mailto:hoteldhanlakshmi2025@gmail.com" className="hover:text-yellow-500 transition-colors">
                  hoteldhanlakshmi2025@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Hotel Dhanlakshmi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;