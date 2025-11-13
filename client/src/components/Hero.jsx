const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-orange-900 via-red-800 to-yellow-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 traditional-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      
      {/* Main Content - Reduced Padding */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center">
          {/* Compact Marathi Welcome */}
          <div className="marathi-heading text-lg md:text-xl mb-3 text-yellow-200 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block shadow-glow">
            🙏 नमस्कार! स्वागत आहे 🙏
          </div>
          
          {/* Main Heading - Reduced Size */}
          <div className="mb-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-2xl">
              <span className="marathi-heading text-yellow-300 drop-shadow-lg">हॉटेल धनलक्ष्मी</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-orange-200 drop-shadow-lg">
              Hotel Dhanlakshmi
            </h2>
          </div>
          
          {/* Tagline - Reduced Size */}
          <div className="marathi-text text-base md:text-lg mb-4 text-yellow-100 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block shadow-traditional">
             पारंपारिक महाराष्ट्रीयन स्वाद • Authentic Maharashtrian Flavors
          </div>
          
          {/* Description - Reduced */}
          <p className="text-sm md:text-base mb-6 max-w-3xl mx-auto text-orange-100 leading-relaxed">
            Experience the authentic taste of <span className="marathi-text font-bold text-yellow-300">महाराष्ट्र</span> with our carefully crafted dishes. 
            From spicy <span className="marathi-text font-semibold text-yellow-300">बिर्याणी</span> to delicious <span className="marathi-text font-semibold text-yellow-300">वडा पाव</span>, we serve happiness on every plate.
          </p>
          
          {/* Compact Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 max-w-3xl mx-auto">
            <div className="bg-white/95 text-gray-800 backdrop-blur-sm rounded-lg p-3 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl mb-1">🚚</div>
              <div className="font-bold text-sm text-orange-600">Free Delivery</div>
              <div className="marathi-text text-xs text-gray-600">मोफत डिलिव्हरी</div>
            </div>
            
            <div className="bg-white/95 text-gray-800 backdrop-blur-sm rounded-lg p-3 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl mb-1">💰</div>
              <div className="font-bold text-sm text-orange-600">Cash on Delivery</div>
              <div className="marathi-text text-xs text-gray-600">घरपोच पेमेंट</div>
            </div>
            
            <div className="bg-white/95 text-gray-800 backdrop-blur-sm rounded-lg p-3 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl mb-1">💳</div>
              <div className="font-bold text-sm text-orange-600">Online Payment</div>
              <div className="marathi-text text-xs text-gray-600">ऑनलाईन पेमेंट</div>
            </div>
          </div>
          
          {/* Call to Action - Compact */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
            <a 
              href="#menu-section" 
              className="maharashtrian-gradient hover:shadow-glow text-white font-bold py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              🍽️ Order Now • आता ऑर्डर करा
            </a>
            <a 
              href="/menu" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full text-base transition-all duration-300 transform hover:scale-105 border-2 border-white/30 inline-block"
            >
              📋 View Menu • मेनू पहा
            </a>
          </div>
          
          {/* Traditional Marathi Quote - Compact */}
          <div className="marathi-text text-sm text-yellow-200 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 inline-block shadow-traditional">
            "अन्नं हे पूर्ण ब्रह्म" - Food is Divine ✨
          </div>
        </div>
      </div>
      
      {/* Decorative Elements - Reduced */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-float">🥘</div>
      <div className="absolute top-16 right-16 text-3xl opacity-20 animate-bounce delay-1000">🍛</div>
      <div className="absolute bottom-16 left-16 text-3xl opacity-20 animate-pulse delay-500">🌶️</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-float delay-2000">🫓</div>
      
      {/* Central Om Symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl opacity-5 animate-pulse-saffron pointer-events-none">
        🕉️
      </div>
    </div>
  );
};

export default Hero;