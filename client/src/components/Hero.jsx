import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Hero = () => {
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/banners'); 
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // Sort banners by order if order field exists
          const sortedBanners = data.data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          setBannerData(sortedBanners);
        } else {
          throw new Error('Invalid data format from server');
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="relative w-full h-[70vh] md:h-[90vh] bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-100 flex items-center justify-center text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  // --- No Banners Fallback ---
  if (bannerData.length === 0) {
    return (
      <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-800 traditional-pattern flex items-center justify-center text-center p-8">
        <div className="absolute inset-0 bg-red-800 opacity-90"></div> 
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to Hotel Dhanlakshmi</h1>
          <p className="text-xl text-yellow-300">Fresh and delicious meals, coming soon!</p>
          <Link 
            to="/menu" 
            className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            ORDER NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-800">
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000, // 5 seconds autoplay
          disableOnInteraction: false, // Continue autoplay after user interaction
          pauseOnMouseEnter: true, // Pause when user hovers
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return `<span class="${className} !w-3 !h-3 !bg-white !opacity-60 hover:!opacity-100 transition-opacity"></span>`;
          },
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        speed={800} // Smooth transition speed
        effect="fade" // You can also use "slide" or "fade"
        fadeEffect={{ crossFade: true }} // Crossfade effect
        className="h-full w-full relative group"
      >
        {bannerData.map((slide) => (
          <SwiperSlide key={slide._id || slide.id}>
            <Link to={slide.link || '/menu'} className="block w-full h-full">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                style={{ 
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                aria-label={slide.altText || `Banner ${slide._id || slide.id}`}
              >
                {/* Optional: Add overlay text for each banner */}
                {(slide.title || slide.subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6 md:p-8">
                    <div className="max-w-4xl mx-auto">
                      {slide.title && (
                        <h2 className="text-2xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                          {slide.title}
                        </h2>
                      )}
                      {slide.subtitle && (
                        <p className="text-lg md:text-xl text-yellow-200 drop-shadow-lg">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !w-12 !h-12 !bg-black/30 hover:!bg-black/50 !rounded-full !text-white !transition-all duration-300 group-hover:opacity-100 opacity-0 md:opacity-30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        
        <div className="swiper-button-next !w-12 !h-12 !bg-black/30 hover:!bg-black/50 !rounded-full !text-white !transition-all duration-300 group-hover:opacity-100 opacity-0 md:opacity-30">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Autoplay Progress Bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-24 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full autoplay-progress"></div>
        </div>
      </Swiper>

      {/* "ORDER NOW" button floats on top */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <Link 
          to="/menu" 
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          ORDER NOW
        </Link>
      </div>

      {/* Add custom styles for autoplay progress */}
      <style jsx>{`
        .autoplay-progress {
          animation: progress 5s linear infinite;
        }
        
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .swiper-button-disabled {
          opacity: 0.3 !important;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Hero;