import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    // --- MODIFICATION: Changed to white background ---
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-12">
          {/* --- MODIFICATION: Gold accent text --- */}
          <h2 className="text-3xl md:text-4xl font-semibold text-yellow-500 mb-4">
            Our Story
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About Hotel Dhanlakshmi
          </h1>
        </div>

        {/* --- MODIFICATION: Removed the dark card wrapper --- */}
        {/* All content is now on the white background */}
        <div className="space-y-12">
          
          {/* Section 1: Our Story */}
          <div>
            <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
              Our Story
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Hotel Dhanlakshmi, a place where food and family come together. We are not just a hotel; we are a <strong>family</strong> dedicated to serving you. Our journey began with a simple passion: to share the rich, authentic flavors of Maharashtra with everyone.
            </p>
          </div>

          {/* Section 2: Our Philosophy */}
          <div>
            <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
              Our Promise
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our core philosophy is rooted in the timeless belief: <b>'The Guest is God'</b>. For us, this is not just a saying; it is our promise. Your happiness and complete satisfaction are our greatest reward.
            </p>
          </div>
          
          {/* Section 3: Our Mission */}
          <div>
            <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
              Our Mission
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is simple: to deliver delicious, high-quality food to every guest. We are dedicated to making every meal a memorable celebration, ensuring you leave with a satisfied heart. Thank you for choosing us. We look forward to serving you!
            </p>
          </div>

        </div>

        {/* --- Call to Action --- */}
        <div className="text-center mt-12">
          {/* --- MODIFICATION: Gold button --- */}
          <Link
            to="/menu"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block"
          >
            Explore Our Menu
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;