import { Link } from 'react-router-dom';

const UnderProgress = ({ pageName = "Page" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Construction Icon */}
        <div className="mb-8 relative">
          <div className="text-8xl animate-bounce mb-4">🚧</div>
          <div className="absolute -top-2 -right-2 text-4xl animate-spin">⚙️</div>
          <div className="absolute -bottom-2 -left-2 text-3xl animate-pulse">🔨</div>
        </div>

        {/* Marathi Heading */}
        <div className="marathi-heading text-3xl md:text-4xl mb-4 gradient-text">
          कार्य सुरू आहे!
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          {pageName} Under Development
        </h1>

        {/* Marathi Description */}
        <div className="marathi-text text-xl mb-4 text-orange-600">
          आम्ही तुमच्यासाठी काम करत आहोत...
        </div>

        <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          We're working hard to bring you an amazing experience. 
          This page will be available soon with exciting features!
        </p>

        {/* Progress Animation */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-4 w-full max-w-md mx-auto overflow-hidden">
            <div className="maharashtrian-gradient h-full rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 marathi-text">७५% पूर्ण • 75% Complete</p>
        </div>

        {/* Features Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="maharashtrian-card p-6 rounded-lg shadow-traditional">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">Mobile Friendly</h3>
            <p className="text-sm text-gray-600 marathi-text">मोबाईल अनुकूल</p>
          </div>
          
          <div className="maharashtrian-card p-6 rounded-lg shadow-traditional">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Fast & Secure</h3>
            <p className="text-sm text-gray-600 marathi-text">जलद आणि सुरक्षित</p>
          </div>
          
          <div className="maharashtrian-card p-6 rounded-lg shadow-traditional">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-800 mb-2">Beautiful Design</h3>
            <p className="text-sm text-gray-600 marathi-text">सुंदर डिझाइन</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="maharashtrian-gradient hover:shadow-glow text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-traditional"
          >
            🏠 Back to Home
          </Link>
          
          <Link
            to="/menu"
            className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-traditional"
          >
            🍽️ View Menu
          </Link>
        </div>

        {/* Marathi Quote */}
        <div className="mt-12 p-6 bg-white bg-opacity-70 rounded-lg shadow-traditional">
          <div className="marathi-text text-lg text-gray-700 italic">
            "धैर्य ठेवा, चांगले काम होत आहे!"
          </div>
          <div className="text-sm text-gray-500 mt-2">
            "Be patient, good work is in progress!"
          </div>
        </div>

        {/* Estimated Time */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
            <span>⏰</span>
            <span className="font-medium">Expected Launch: Soon</span>
            <span className="marathi-text">• लवकरच उपलब्ध</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderProgress;
