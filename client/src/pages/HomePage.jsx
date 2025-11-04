import { useState, useEffect, useRef } from 'react';
import { Heart, User, ChevronLeft, ChevronRight } from 'lucide-react';
import TrendingProduct from '../components/layout/TrendingProduct';
import FeaturedCollection from '../components/layout/FeaturedCollection';
import VibeFinder from '../components/layout/VibeFinder';
import FlashSaleProduct from '../components/layout/FlashSaleProduct';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [flashSaleTime, setFlashSaleTime] = useState(3600); // 1 hour in seconds for simulated sale
  const observerRef = useRef(null);

  // --- Data Definitions ---

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&h=800&fit=crop',
      title: 'Discover Your Perfect Timepiece',
      subtitle: 'Luxury watches that define your style'
    },
    {
      image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1600&h=800&fit=crop',
      title: 'Timeless Elegance',
      subtitle: 'Crafted for those who appreciate excellence'
    },
    {
      image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&h=800&fit=crop',
      title: 'Classic Collection',
      subtitle: 'Where tradition meets innovation'
    }
  ];

  const flashSaleProducts = [
    { id: 101, name: 'Chronos Special', originalPrice: '$1,500', salePrice: '$999', image: 'https://images.unsplash.com/photo-1549413247-497d33d59649?w=300&h=300&fit=crop' },
    { id: 102, name: 'Golden Comet', originalPrice: '$2,800', salePrice: '$1,999', image: 'https://images.unsplash.com/photo-1579587428456-c73796570c97?w=300&h=300&fit=crop' },
    { id: 103, name: 'Steel Navigator', originalPrice: '$850', salePrice: '$550', image: 'https://images.unsplash.com/photo-1574676140685-6b453e9a7e80?w=300&h=300&fit=crop' },
  ];

  const communityPosts = [
    { id: 1, author: 'Julius_P', image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop', text: 'I couldn\'t be more pleased with my purchase. From the packaging to the actual timepiece, everything screamed quality.' },
    { id: 2, author: 'Sarah.w', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop', text: 'Received my order within days and was very impressed. The watch is absolutely stunning and very well made. 5 stars!' },
    { id: 3, author: 'Leon.d', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=300&fit=crop', text: 'I ordered two for my wife and myself. These are our new favorite watches. We will definitely be back to order more!' }
  ];

  // --- Effects and Handlers ---

  // Hero Slide Auto-Advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Flash Sale Timer Logic
  useEffect(() => {
    const saleDuration = 3600; // 1 hour (3600 seconds)
    // Set a fixed end time 1 hour from component mount
    const endTime = Date.now() + saleDuration * 1000;

    const updateTimer = () => {
      const remaining = Math.max(0, endTime - Date.now());
      setFlashSaleTime(Math.floor(remaining / 1000));
    };

    updateTimer(); // Initial call
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };


  // Intersection Observer for Scroll Animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-white ">

      {/* Hero Section with Slider */}
      <section className="relative h-96 overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 hero-slide"
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              zIndex: index === currentSlide ? 1 : 0
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              // Fallback placeholder image
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1600x800/222222/cccccc?text=Luxury+Watch'; }}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </div>
        ))}

        <div className="relative h-full flex items-center justify-center z-10">
          <div className="text-center max-w-3xl px-4">
            <h1
              key={currentSlide}
              className="text-4xl md:text-5xl font-bold mb-4 text-white animate-fadeInUp"
            >
              {heroSlides[currentSlide].title}
            </h1>
            <p
              key={`subtitle-${currentSlide}`}
              className="text-lg text-white mb-6 animate-fadeInUp"
              style={{ animationDelay: '0.2s' }}
            >
              {heroSlides[currentSlide].subtitle}
            </p>
            <div
              className="flex justify-center space-x-3 animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              <button onClick={() => {
                document.getElementById('trending-container')?.scrollIntoView({ behavior: 'smooth' });
              }} className="px-6 py-2.5 bg-white text-text-primary text-sm rounded-full hover:bg-bg-secondary transition-all transform hover:scale-105 shadow-lg">
                Shop Now
              </button>
              <button className="px-6 py-2.5 border-2 border-white text-white text-sm rounded-full hover:bg-white hover:text-text-primary transition-all transform hover:scale-105 shadow-lg">
                Try In-Store Finder
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all z-20 shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all z-20 shadow-md"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'}`}
            />
          ))}
        </div>
      </section>

      <FeaturedCollection />

      <TrendingProduct />

      <FlashSaleProduct />

      <VibeFinder />
      {/* Exclusive Offers */}
      <section className="py-6 bg-bg-secondary transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4">
          <div
            id="offers-header"
            data-animate
            className={`text-center mb-10 ${isVisible['offers-header'] ? 'animate-fadeInUp visible' : ''}`}
          >
            <h2 className="text-3xl font-bold mb-2 text-text-primary">Exclusive Offers</h2>
            <p className="text-text-secondary text-sm">Don't miss out on these limited-time opportunities to elevate your collection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              id="offer-1"
              data-animate
              className={`relative rounded-xl overflow-hidden h-52 group shadow-xl ${isVisible['offer-1'] ? 'animate-scaleIn visible' : ''}`}
            >
              <img
                src="https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&h=400&fit=crop"
                alt="Summer Collection"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/4f46e5/ffffff?text=20%+OFF+Summer'; }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col items-start justify-center text-white p-6">
                <h3 className="text-2xl font-bold mb-1 transform group-hover:scale-105 transition-transform duration-300">20% OFF Summer Collection</h3>
                <p className="text-sm mb-4">Save big! Limited time only.</p>
                <button className="px-6 py-2 bg-white text-text-primary text-xs rounded-full font-semibold hover:bg-bg-tertiary transition-all transform hover:scale-105 shadow-md">
                  EXPLORE
                </button>
              </div>
            </div>

            <div
              id="offer-2"
              data-animate
              className={`relative rounded-xl overflow-hidden h-52 group shadow-xl ${isVisible['offer-2'] ? 'animate-scaleIn visible' : ''}`}
            >
              <img
                src="https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&h=400&fit=crop"
                alt="First Look"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/1e293b/ffffff?text=New+Arrivals'; }}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col items-start justify-center text-white p-6">
                <h3 className="text-2xl font-bold mb-1 transform group-hover:scale-105 transition-transform duration-300">New Arrivals: First Look</h3>
                <p className="text-sm mb-4">Be the first to discover the latest additions.</p>
                <button className="px-6 py-2 bg-white text-text-primary text-xs rounded-full font-semibold hover:bg-bg-tertiary transition-all transform hover:scale-105 shadow-md">
                  EXPLORE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="bg-bg-primary py-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4">
          <div
            id="community-header"
            data-animate
            className={`text-center mb-10 ${isVisible['community-header'] ? 'animate-fadeInUp visible' : ''}`}
          >
            <h2 className="text-3xl font-bold mb-2 text-text-primary">TIMEPIECE Community</h2>
            <p className="text-text-secondary text-sm">Share your story and connect with fellow enthusiasts. Use #MyTimepiece!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {communityPosts.map((post, idx) => (
              <div
                key={post.id}
                id={`post-${post.id}`}
                data-animate
                className={`bg-bg-secondary rounded-xl overflow-hidden border border-border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${isVisible[`post-${post.id}`] ? 'animate-fadeInUp visible' : ''}`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="overflow-hidden bg-bg-tertiary">
                  <img
                    src={post.image}
                    alt={post.author}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/94a3b8/ffffff?text=Community+Post'; }}
                    className="w-full aspect-[4/3] object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-bg-tertiary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-text-muted" />
                    </div>
                    <span className="font-semibold text-sm text-text-primary">{post.author}</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">{post.text}</p>
                  <button className="text-text-muted hover:text-error transition-colors transform hover:scale-110">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            id="community-button"
            data-animate
            className={`text-center ${isVisible['community-button'] ? 'animate-fadeInUp visible' : ''}`}
          >
            <button
              className="px-8 py-2.5 border text-sm rounded-full transition-all transform hover:scale-105 font-semibold"
              style={{
                borderColor: 'var(--brand-color)',
                color: 'var(--brand-color)',
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--brand-color)'; e.target.style.color = 'white'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--brand-color)'; }}
            >
              View More Community Posts
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
