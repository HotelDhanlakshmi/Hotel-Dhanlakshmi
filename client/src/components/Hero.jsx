const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-yellow-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 traditional-pattern opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* Marathi Welcome with better visibility */}
          <div className="marathi-heading text-2xl md:text-3xl mb-6 text-yellow-200 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 inline-block shadow-glow">
            🙏 नमस्कार! स्वागत आहे 🙏
          </div>
          
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
              <span className="marathi-heading text-yellow-300 drop-shadow-lg">हॉटेल धनलक्ष्मी</span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold text-orange-200 drop-shadow-lg">
              Hotel Dhanlakshmi
            </h2>
          </div>
          
          {/* Tagline */}
          <div className="marathi-text text-xl md:text-2xl mb-8 text-yellow-100 bg-black/20 backdrop-blur-sm rounded-lg px-6 py-3 inline-block shadow-traditional">
             महाराष्ट्रीयन स्वाद • Authentic Maharashtrian Flavors
          </div>
          
          {/* Description */}
          <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto text-orange-100 leading-relaxed">
            Experience the authentic taste of <span className="marathi-text font-bold text-yellow-300">महाराष्ट्र</span> with our carefully crafted dishes. 
            From spicy <span className="marathi-text font-semibold text-yellow-300">बिर्याणी</span> to delicious <span className="marathi-text font-semibold text-yellow-300">वडा पाव</span>, we serve happiness on every plate.
          </p>
          
          {/* === MODIFIED FEATURE CARDS === */}
          {/* Reverted to 3-column grid to include Free Delivery, CoD, and Online Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            
            {/* Added Free Delivery Card Back */}
            <div className="bg-white/95 text-gray-800 backdrop-blur-sm rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">🚚</div>
              <div className="font-bold text-lg text-orange-600">Free Delivery</div>
              <div className="marathi-text text-sm text-gray-600 mt-1">मोफत डिलिव्हरी</div>
              <div className="text-xs text-gray-500 mt-2">No delivery charges</div>
            </div>
            
            {/* Kept Cash on Delivery */}
            <div className="bg-white/95 text-gray-800 backdrop-blur-sm rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">💰</div>
              <div className="font-bold text-lg text-orange-600">Cash on Delivery</div>
              <div className="marathi-text text-sm text-gray-600 mt-1">घरपोच पेमेंट</div>
              <div className="text-xs text-gray-500 mt-2">Pay when you receive</div>
            </div>
            
            {/* Kept Online Payment Card */}
            <div className="bg-white/95 text-gray-800 backdrop-blur-sm rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-3">💳</div>
              <div className="font-bold text-lg text-orange-600">Online Payment</div>
              <div className="marathi-text text-sm text-gray-600 mt-1">ऑनलाईन पेमेंट</div>
              <div className="text-xs text-gray-500 mt-2">Secure & Easy</div>
            </div>

          </div>
          {/* === END OF MODIFICATIONS === */}
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a 
              href="#menu-section" 
              className="maharashtrian-gradient hover:shadow-glow text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              🍽️ Order Now • आता ऑर्डर करा
            </a>
            <a 
              href="/menu" 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/30 inline-block"
            >
              📋 View Menu • मेनू पहा
            </a>
          </div>
          
          {/* Traditional Marathi Quote */}
          <div className="marathi-text text-xl text-yellow-200 bg-black/30 backdrop-blur-sm rounded-lg px-6 py-3 inline-block shadow-traditional">
            "अन्नं ब्रह्म" - Food is Divine ✨
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🥘</div>
      <div className="absolute top-32 right-16 text-5xl opacity-20 animate-bounce delay-1000">🍛</div>
      <div className="absolute bottom-32 left-16 text-5xl opacity-20 animate-pulse delay-500">🌶️</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float delay-2000">🫓</div>
      
      {/* Central Om Symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5 animate-pulse-saffron pointer-events-none">
        🕉️
      </div>
      
      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-orange-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-red-400 rounded-full opacity-50 animate-bounce delay-2000"></div>
    </div>
  );
};

export default Hero;