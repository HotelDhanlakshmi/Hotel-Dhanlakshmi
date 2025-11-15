import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
          setBannerData(data.data);
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
      // --- HEIGHT INCREASED ---
      <div className="relative w-full h-[70vh] md:h-[90vh] bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      // --- HEIGHT INCREASED ---
      <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-100 flex items-center justify-center text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  // --- No Banners Fallback ---
  if (bannerData.length === 0) {
    return (
      // --- HEIGHT INCREASED ---
       <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-800 traditional-pattern flex items-center justify-center text-center p-8">
         <div className="absolute inset-0 bg-red-800 opacity-90"></div> 
         <div className="relative z-10">
           <h1 className="text-5xl font-bold text-white mb-4">Welcome to Hotel Dhanlakshmi</h1>
           <p className="text-xl text-yellow-300">Fresh and delicious meals, coming soon!</p>
         </div>
       </div>
    );
  }

  // --- Main Slider ---
  return (
    // --- HEIGHT INCREASED ---
    <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-800">
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        className="h-full w-full"
      >
        {bannerData.map((slide) => (
          <SwiperSlide key={slide._id}>
            <Link to={slide.link} className="block w-full h-full">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat" // Using bg-contain as discussed
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
                aria-label={`Banner ${slide._id}`}
              >
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* "ORDER NOW" button floats on top */}
      
    </div>
  );
};

export default Hero;