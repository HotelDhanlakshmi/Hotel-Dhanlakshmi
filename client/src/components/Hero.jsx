const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">Hotel Dhanlakshmi</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience the authentic taste of India with our carefully crafted dishes. 
            From spicy biryanis to delicious pizzas, we serve happiness on every plate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-2">
              <span className="text-2xl">🚚</span>
              <span className="font-semibold">Free Delivery</span>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-2">
              <span className="text-2xl">⏰</span>
              <span className="font-semibold">30 Min Delivery</span>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <span className="font-semibold">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative food icons */}
      <div className="absolute top-10 left-10 text-4xl opacity-30 animate-bounce">🍕</div>
      <div className="absolute top-20 right-20 text-3xl opacity-30 animate-pulse">🍛</div>
      <div className="absolute bottom-10 left-20 text-3xl opacity-30 animate-bounce delay-1000">🍗</div>
      <div className="absolute bottom-20 right-10 text-4xl opacity-30 animate-pulse delay-500">🥘</div>
    </div>
  );
};

export default Hero;
