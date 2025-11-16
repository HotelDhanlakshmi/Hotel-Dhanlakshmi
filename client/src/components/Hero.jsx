import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Import default banner image
import defaultBanner from "../assets/banner.png";

const Hero = () => {
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideIntervalRef = useRef(null);

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
      // Use environment variable for production, localhost for development
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/banners`);

      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // Sort banners by order
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
    }, 5000); // Change slide every 5 seconds
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startAutoSlide(); // Reset timer when manually changing slide
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

  // --- No Banners Fallback - Show default image ---
  if (bannerData.length === 0) {
    return (
      <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-800">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${defaultBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center p-8">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">
                Welcome to Hotel Dhanlakshmi
              </h1>
              <p className="text-xl text-yellow-300 mb-8">
                Fresh and delicious meals
              </p>
              <Link
                to="/menu"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
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
    <div className="relative w-full h-[70vh] md:h-[90vh] bg-red-800 overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {bannerData.map((slide, index) => (
          <div
            key={slide._id || slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link to={slide.link || "/menu"} className="block w-full h-full">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onError={(e) => {
                  // If image fails to load, show default banner
                  e.target.style.backgroundImage = `url(${defaultBanner})`;
                }}
                aria-label={slide.altText || `Banner ${slide._id || slide.id}`}
              >
                {/* Overlay text for each banner */}
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
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if multiple banners */}
      {bannerData.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/60 rounded-full text-white transition-all duration-300 flex items-center justify-center"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/30 hover:bg-black/60 rounded-full text-white transition-all duration-300 flex items-center justify-center"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
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

      {/* Slide Indicators - Only show if multiple banners */}
      {bannerData.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
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

      {/* "ORDER NOW" button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <Link
          to="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          ORDER NOW
        </Link>
      </div>
    </div>
  );
};

export default Hero;
