const Hero = () => {
  return (
    <div className="relative maharashtrian-gradient text-white traditional-pattern">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Marathi Welcome */}
          <div className="marathi-heading text-2xl md:text-3xl mb-4 text-yellow-300">
            🙏 नमस्कार! स्वागत आहे 🙏
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="marathi-heading text-yellow-300">हॉटेल धनलक्ष्मी</span>
            <br />
            <span className="text-3xl md:text-4xl">Hotel Dhanlakshmi</span>
          </h1>
          
          <div className="marathi-text text-lg md:text-xl mb-4 text-orange-200">
            प्रामाणिक महाराष्ट्रीयन स्वाद • Authentic Maharashtrian Flavors
          </div>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience the authentic taste of <span className="marathi-text font-semibold">महाराष्ट्र</span> with our carefully crafted dishes. 
            From spicy <span className="marathi-text">बिर्याणी</span> to delicious <span className="marathi-text">वडा पाव</span>, we serve happiness on every plate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-2 shadow-traditional">
              <span className="text-2xl">🚚</span>
              <div className="text-left">
                <div className="font-semibold">Free Delivery</div>
                <div className="marathi-text text-sm opacity-90">मोफत डिलिव्हरी</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-2 shadow-traditional">
              <span className="text-2xl">⏰</span>
              <div className="text-left">
                <div className="font-semibold">30 Min Delivery</div>
                <div className="marathi-text text-sm opacity-90">३० मिनिटात</div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-2 shadow-traditional">
              <span className="text-2xl">💰</span>
              <div className="text-left">
                <div className="font-semibold">Cash on Delivery</div>
                <div className="marathi-text text-sm opacity-90">घरपोच पेमेंट</div>
              </div>
            </div>
          </div>
          
          {/* Traditional Marathi Greeting */}
          <div className="mt-8 marathi-text text-lg opacity-90">
            "अन्नं ब्रह्म" - Food is Divine ✨
          </div>
        </div>
      </div>
      
      {/* Decorative food icons with Maharashtrian touch */}
      <div className="absolute top-10 left-10 text-4xl opacity-30 animate-bounce">🥘</div>
      <div className="absolute top-20 right-20 text-3xl opacity-30 animate-pulse">🍛</div>
      <div className="absolute bottom-10 left-20 text-3xl opacity-30 animate-bounce delay-1000">🌶️</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-pulse delay-500">🫓</div>
      
      {/* Traditional Pattern Overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10 animate-pulse-saffron">
        🕉️
      </div>
    </div>
  );
};

export default Hero;
