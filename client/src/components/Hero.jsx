import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Import default banner image
import defaultBanner from "../assets/banner.png";

const Hero = () => {
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const slideIntervalRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto slide functionality
  useEffect(() => {
    if (bannerData.length > 1) {
      startAutoSlide();
    }
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [bannerData.length, currentSlide]);

  const fetchBanners = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/banners`);

      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const sortedBanners = data.data.sort(
          (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
        );
        setBannerData(sortedBanners);
      } else {
        throw new Error("Invalid data format from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoSlide = () => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }
    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    }, 5000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startAutoSlide();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    startAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerData.length) % bannerData.length
    );
    startAutoSlide();
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="banner-container relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh] bg-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="banner-container relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh] bg-red-100 flex items-center justify-center text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  // --- No Banners Fallback ---
  if (bannerData.length === 0) {
    return (
      <div className={`banner-container relative w-full overflow-hidden ${isMobile ? '' : 'h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh]'}`}>
        <div
          className="banner-image w-full bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${defaultBanner})`,
            backgroundSize: isMobile ? '100% auto' : 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            maxWidth: "100%",
            width: "100%",
            ...(isMobile ? {
              paddingBottom: '66.67%', // 2/3 aspect ratio for 1536x1024
              height: 0,
            } : {
              height: "100%",
            }),
          }}
        >
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center p-4 sm:p-8">
            <div className="text-white max-w-full px-2">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 break-words">
                Welcome to Hotel Dhanlakshmi
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-yellow-300 mb-6 sm:mb-8 break-words">
                Fresh and delicious meals
              </p>
              <Link
                to="/menu"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-lg text-sm sm:text-lg transition-colors inline-block"
              >
                ORDER NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`banner-container relative w-full overflow-hidden ${isMobile ? '' : 'h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh]'}`}>
      {/* Slides Container */}
      <div className={`relative w-full ${isMobile ? '' : 'h-full'}`}>
        {bannerData.map((slide, index) => (
          <div
            key={slide._id || slide.id}
            className={`${isMobile ? 'relative' : 'absolute inset-0'} transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : isMobile ? "hidden" : "opacity-0"
            }`}
            style={{ maxWidth: '100%', width: '100%' }}
          >
            <Link to={slide.link || "/menu"} className="block w-full">
              <div
                className="banner-image w-full bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundSize: isMobile ? '100% auto' : 'cover',
                  backgroundPosition: 'center top',
                  backgroundRepeat: 'no-repeat',
                  maxWidth: '100%',
                  width: '100%',
                  ...(isMobile ? {
                    paddingBottom: '66.67%', // 2/3 aspect ratio for 1536x1024 (1024/1536 = 0.6667)
                    height: 0,
                  } : {
                    height: '100%',
                  }),
                }}
                onError={(e) => {
                  e.target.style.backgroundImage = `url(${defaultBanner})`;
                  e.target.style.backgroundSize = "cover";
                }}
                aria-label={slide.altText || `Banner ${slide._id || slide.id}`}
              >
                {/* Overlay text for each banner */}
                {(slide.title || slide.subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 sm:p-6 md:p-8">
                    <div className="max-w-4xl mx-auto px-2 sm:px-4">
                      {slide.title && (
                        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 text-white drop-shadow-lg break-words">
                          {slide.title}
                        </h2>
                      )}
                      {slide.subtitle && (
                        <p className="text-sm sm:text-lg md:text-xl text-yellow-200 drop-shadow-lg break-words">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {bannerData.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/60 rounded-full text-white transition-all duration-300 flex items-center justify-center"
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/60 rounded-full text-white transition-all duration-300 flex items-center justify-center"
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {bannerData.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {bannerData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-orange-500 scale-125"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* "ORDER NOW" button - Overlay at bottom */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 px-2">
        <Link
          to="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-8 rounded-lg text-sm sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
        >
          ORDER NOW
        </Link>
      </div>
    </div>
  );
 };


export default Hero;