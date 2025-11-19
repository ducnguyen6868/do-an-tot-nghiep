import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart, Star, TrendingUp, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import collectionApi from '../../api/collectionApi';

// Main Collection Section Component - Optimized for all devices
export default function CollectionSection() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const navigate = useNavigate();

    // Auto-play slider - Only runs if auto-playing and multiple collections
    useEffect(() => {
        if (!isAutoPlaying || collections.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % collections.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, collections]);

    // Navigation functions - Stop auto-play on manual interaction
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % collections.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    // Data fetching
    useEffect(() => {
        const getCollections = async () => {
            try {
                const response = await collectionApi.getCollections();
                setCollections(response.collections);
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        getCollections();
    }, []);

    const handleCollection = (slug) => {
        navigate(`/collection/${slug}`);
    };

    // Loading state - Responsive spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    // Empty state - Responsive padding and text
    if (collections.length === 0) {
        return (
            <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50 w-full text-center text-gray-500">
                <p className="text-sm sm:text-base md:text-lg">Không có bộ sưu tập nào được tìm thấy.</p>
            </section>
        );
    }

    return (
        <section className="relative py-4 px-4 bg-gray-50 w-full">
            {/* Slides Container - Fully responsive height and max-width */}
            <div className="relative mx-auto h-[120px] sm:h-[160px] md:h-[180px] lg:h-[220px] xl:h-[300px] 
            overflow-hidden rounded-md shadow-xl"
            >
                {collections.map((collection, index) => (
                    <div
                        key={collection._id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentIndex
                                ? 'opacity-100 translate-x-0 z-0'
                                : index < currentIndex
                                    ? 'opacity-0 -translate-x-full z-0'
                                    : 'opacity-0 translate-x-full z-0'
                            }`}
                    >
                        <div className="bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 rounded-md sm:rounded-lg md:rounded-lg lg:rounded-xl xl:rounded-xl text-white relative overflow-hidden w-full h-full">
                            {/* Background Image - Responsive object positioning */}
                            <img
                                src={`http://localhost:5000${collection.banner}`}
                                alt={collection.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/800x400/00bcd4/ffffff?text=FEATURED+COLLECTION";
                                }}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover opacity-30"
                            />
                            {/* Content Overlay - Fully responsive padding, text, and layout */}
                            <div className="absolute inset-0 py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center w-full overflow-hidden">

                                {/* Tag: FEATURED COLLECTION - Responsive icon and text */}
                                <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-400" />
                                    <span className="text-teal-400 font-semibold text-xs sm:text-xs">FEATURED COLLECTION</span>
                                </div>

                                {/* Title - Scales from small to large */}
                                <h2 className="text-lg sm:text-xs md:text-base lg:text-xl xl:text-2xl font-bold leading-tight sm:leading-snug sm:mb-1">
                                    {collection.name}
                                </h2>

                                {/* Description - Responsive text and max-width */}
                                <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl line-clamp-2 sm:line-clamp-3">
                                    {collection.description}
                                </p>

                                {/* Stats/Badges - Responsive layout and spacing */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 md:space-x-4 mb-3 sm:mb-4">
                                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                                        <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="font-semibold">Premium Quality</span>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-teal-400" />
                                        <span className="font-semibold">{collection.products?.length || 0} Products</span>
                                    </div>
                                </div>

                                {/* Shop Button - Fully responsive */}
                                <div className="w-full sm:w-auto">
                                    <button
                                        className="bg-teal-600 text-white px-6 py-2 sm:px-8 sm:py-2.5 md:px-10 md:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-teal-700 transition-all flex items-center justify-center space-x-1 sm:space-x-2 w-full sm:w-auto"
                                        onClick={() => handleCollection(collection.slug)}
                                    >
                                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>Shop Now</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Dot Indicators - Responsive dots and tooltips */}
                {collections.length > 1 && (
                    <div className="absolute bottom-0 z-20  w-full flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-3 pb-2 sm:pb-1 md:pb-2">
                        {collections.map((collection, index) => (
                            <button
                                key={collection._id}
                                onClick={() => goToSlide(index)}
                                className="group relative"
                                aria-label={`Go to ${collection.name}`}
                            >
                                <div
                                    className={`transition-all duration-300 rounded-full ${index === currentIndex
                                            ? 'w-5 sm:w-6 md:w-7 lg:w-8 h-1.5 sm:h-2 bg-teal-600'
                                            : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 hover:bg-teal-400'
                                        }`}
                                />
                                {/* Tooltip - Hidden on mobile to prevent overlap */}
                                <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 sm:mb-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-900 text-white text-xs sm:text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                                    {collection.name}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation Arrows - Responsive positioning and sizing */}
            {collections.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all z-0 group"
                        aria-label="Previous collection"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all z-0 group"
                        aria-label="Next collection"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                    </button>
                </>
            )}


        </section>
    );
};
