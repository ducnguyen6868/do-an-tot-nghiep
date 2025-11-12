import { useState, useEffect, useRef } from 'react';
import { Heart, User } from 'lucide-react';
import TrendingProduct from '../components/layout/TrendingProduct';
import FeaturedCollection from '../components/layout/FeaturedCollection';
import FlashSaleProduct from '../components/layout/FlashSaleProduct';


export default function HomePage() {
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  const communityPosts = [
    { id: 1, author: 'Julius_P', image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop', text: 'I couldn\'t be more pleased with my purchase. From the packaging to the actual timepiece, everything screamed quality.' },
    { id: 2, author: 'Sarah.w', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=300&fit=crop', text: 'Received my order within days and was very impressed. The watch is absolutely stunning and very well made. 5 stars!' },
    { id: 3, author: 'Leon.d', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=300&fit=crop', text: 'I ordered two for my wife and myself. These are our new favorite watches. We will definitely be back to order more!' },
    { id: 4, author: 'Leon.d', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=300&fit=crop', text: 'I ordered two for my wife and myself. These are our new favorite watches. We will definitely be back to order more!' }
  ];

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

  // --- Render ---

  return (
    <div className="min-h-screen bg-white ">
      <FeaturedCollection />

      <FlashSaleProduct />

      <div className='flex gap-4 px-8 py-4 flex-wrap items-start justify-center'>
        <TrendingProduct />

        {/* Exclusive Offers */}
        <section
          className="py-6 min-w-[480px] bg-bg-secondary
       transition-colors duration-500 col-span-2 
       bg-gradient-to-b from-teal-500 to-pink-400 rounded-lg">
          <div className="max-w-7xl mx-auto px-4 ">
            <div
              id="offers-header"
              data-animate
              className={`text-white text-center mb-4 ${isVisible['offers-header'] ? 'animate-fadeInUp visible' : ''}`}
            >
              <h2 className="text-3xl font-bold mb-2">Exclusive Offers</h2>
              <p className="text-sm">Don't miss out on these limited-time opportunities to elevate your collection.</p>
            </div>

            <div className="grid grid-cols-1 gap-4  ">
              <div
                id="offer-1"
                data-animate
                className={`relative rounded-xl overflow-hidden h-44 group shadow-xl ${isVisible['offer-1'] ? 'animate-scaleIn visible' : ''}`}
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
                className={`relative rounded-xl overflow-hidden h-40 group shadow-xl ${isVisible['offer-2'] ? 'animate-scaleIn visible' : ''}`}
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

      </div>


      {/* Community */}
      <section className="bg-bg-primary px-8 transition-colors duration-500">
        <div className="max-w-7xl mx-auto py-6 px-4 
        
         rounded-lg ">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        </div>
      </section>

    </div>
  );
}
