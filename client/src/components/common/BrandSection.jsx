import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import brandApi from '../../api/brandApi';

export default function BrandListSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  // Fetch brands
  useEffect(() => {
    const getBrands = async () => {
      try {
        const response = await brandApi.getBrands();
        setBrands(response.brands || []);
      } catch (err) {
        console.log(err?.response?.data?.message || err.message);
      }
    };
    getBrands();
  }, []);

  // Auto highlight
  useEffect(() => {
    if (brands.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % brands.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [brands]);

  const handleBrand = useCallback(
    (slug) => navigate(`/brand/${slug}`),
    [navigate]
  );

  return (
    <section className="py-6 sm:py-8 md:py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

        {/* Header */}
        <h2 className="
          text-xl sm:text-2xl md:text-3xl 
          font-semibold text-gray-800 
          mb-4 sm:mb-5 md:mb-6 
          border-b-2 border-gray-800 
          w-max pb-1
        ">
          Brands
        </h2>

        {/* Grid - always minimum 5 columns */}
        <div
          className="
            grid gap-3 sm:gap-4 md:gap-5
            grid-cols-5     /* always minimum 5 items per row */
            sm:grid-cols-6
            md:grid-cols-7
            lg:grid-cols-8
            xl:grid-cols-10
            2xl:grid-cols-12
          "
        >
          {brands.map((brand, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={brand._id}
                onClick={() => handleBrand(brand.slug)}
                className={`
                  cursor-pointer group relative 
                  overflow-hidden rounded-xl 
                  transition-all duration-300 
                  ${isActive 
                    ? 'ring-4 ring-brand shadow-xl scale-[1.05]' 
                    : 'hover:scale-[1.04]'}
                `}
              >
                {/* Image */}
                <div className="aspect-square w-full">
                  <img
                    src={`http://localhost:5000/${brand.thumbnail}`}
                    alt={brand.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://placehold.co/300x300/e2e8f0/64748b?text=Watch';
                    }}
                    className="
                      w-full h-full object-cover rounded-xl
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Hover gradient */}
                <div className="
                  absolute inset-0 bg-gradient-to-t 
                  from-black/60 to-transparent 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity
                " />

                {/* Brand name */}
                <div className={`
                  absolute bottom-0 left-0 right-0 
                  text-center font-semibold 
                  bg-white/95 backdrop-blur-sm
                  py-1 sm:py-1.5 md:py-2

                  /* NAME SIZE SMALLER */
                  text-[8px] sm:text-[10px] md:text-xs lg:text-sm

                  transition-transform duration-300
                  ${isActive 
                    ? 'translate-y-0' 
                    : 'translate-y-full group-hover:translate-y-0'}
                `}>
                  {brand.name}
                </div>

                {/* Active pulse */}
                {isActive && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-brand rounded-full animate-pulse ring-2 ring-white" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
