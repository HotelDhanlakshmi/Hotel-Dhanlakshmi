import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl marathi-heading gradient-text mb-4">
            आमच्याबद्दल
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            About Hotel Dhanlakshmi
          </h1>
        </div>

        {/* --- Main Content Card --- */}
        <div className="max-w-4xl mx-auto bg-white/90 rounded-xl shadow-traditional p-8 md:p-12">
          
          {/* Section 1: Our Story */}
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">
            आमची कहाणी (Our Story)
          </h3>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Welcome to Hotel Dhanlakshmi, a place where food and family come together. We are not just a hotel; we are a <strong>कुटुंब (kutumb - family)</strong> dedicated to serving you. Our journey began with a simple passion: to share the rich, authentic flavors of Maharashtra with everyone.
          </p>

          {/* Section 2: Our Philosophy */}
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">
            आमचे वचन (Our Promise)
          </h3>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Our core philosophy is rooted in the timeless Maharashtrian belief: <strong>"अतिथी देवो भव" (Atithi Devo Bhava)</strong> — 'The Guest is God'. For us, this is not just a saying; it is our promise. Your happiness and complete satisfaction are our greatest reward.
          </p>
          
          {/* Section 3: Our Mission */}
          <h3 className="text-2xl font-semibold text-orange-600 mb-4">
            आमचे ध्येय (Our Mission)
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our mission is simple: to deliver delicious, high-quality food to every guest. We are dedicated to making every meal a memorable celebration, ensuring you leave with a satisfied heart. Thank you for choosing us. We look forward to serving you!
          </p>

        </div>

        {/* --- Call to Action --- */}
        <div className="text-center mt-12">
          <Link
            to="/menu"
            className="maharashtrian-gradient hover:shadow-glow text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block"
          >
            Explore Our Menu (आमचा मेनू पहा)
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;