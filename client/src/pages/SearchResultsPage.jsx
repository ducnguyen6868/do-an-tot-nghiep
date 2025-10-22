import { useState, useEffect } from 'react';
import '../styles/SearchResultsPage.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import productApi from '../api/productApi';
import brandApi from '../api/brandApi';
import ListProduct from '../components/comon/ListProduct';
import LoadingAnimations from '../components/comon/LoadingAnimations';
import { motion, AnimatePresence } from "framer-motion";


export default function SearchResultsPage() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword");

  const [results, setResults] = useState([]);
  const [brands, setBrands] = useState([]);

  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [isOpen, setIsOpen] = useState(false);


  // Filters
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    brand: 'all',
    audience: 'all',
    movement: 'all',
    minRating: 0
  });

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const applyFiltersAndSort = () => {
      let filtered = [...results];

      // Apply price filter
      if (filters.priceMin) {
        filtered = filtered.filter(item => item.detail[0]?.price >= parseFloat(filters.priceMin));
      }
      if (filters.priceMax) {
        filtered = filtered.filter(item => item.detail[0]?.price <= parseFloat(filters.priceMax));
      }

      // Apply brand filter
      if (filters.brand !== 'all') {
        filtered = filtered.filter(item => item.brand.name === filters.brand);
      }

      // Apply audience filter
      if (filters.audience !== 'all') {
        filtered = filtered.filter(item => item.target_audience === filters.audience);
      }

      // Apply movement filter
      if (filters.movement !== 'all') {
        filtered = filtered.filter(item => item.movement_type === filters.movement);
      }

      // Apply rating filter
      if (filters.minRating > 0) {
        filtered = filtered.filter(item => item.ratings >= filters.minRating);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.detail[0]?.price - b.detail[0]?.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.detail[0]?.price - a.detail[0]?.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.ratings - a.ratings);
          break;
        case 'newest':
          filtered.sort((a, b) => a.createdAt < b.createdAt);
          break;
        default:
          // relevance - keep as is
          break;
      }

      setFilteredResults(filtered);
    };

    setTimeout(() => {
      applyFiltersAndSort();
      setLoading(false);
    }, 500);
  }, [sortBy, filters, results]);

  useEffect(() => {
    setFilteredResults([]);
    const getProducts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await productApi.search(keyword);
        const update = response.product.map((pro) => {
          const sold = pro.detail?.reduce((t, d) => t + d.sold, 0);
          const total = pro.detail?.reduce((t, d) => t + d.quantity, 0);
          const stock = total - sold;
          const reviewCount = pro.reviews.length;
          return { ...pro, sold, stock, reviewCount }
        });
        setResults(update);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, [keyword]);

  useEffect(() => {
    const getBrands = async () => {
      try {
        const response = await brandApi.brand();
        setBrands(response.brand);

      } catch (err) {
        toast.err(err.response?.data?.message | err.message);
      }
    }
    getBrands();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      brand: 'all',
      audience: 'all',
      movement: 'all',
      minRating: 0
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  return (
    <>
      <Header />
      <div className="search-results-page">
        <div className="results-layout">
          <div className="filters-container">
            {/* Bong bóng nhỏ */}
            {!isOpen && (
              <motion.div
                className="filter-bubble"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
              >
                🔍 Filter
              </motion.div>
            )}

            {/* Sidebar với hiệu ứng macOS */}
            <AnimatePresence>
              {isOpen && (
                <motion.aside
                  className="filters-sidebar"
                  initial={{ scale: 0.3, opacity: 0, borderRadius: "50%", y: 60 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    borderRadius: "20px",
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 120,
                      damping: 15,
                    },
                  }}
                  exit={{
                    scale: 0.3,
                    opacity: 0,
                    borderRadius: "50%",
                    y: 60,
                    transition: {
                      duration: 0.4,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <div className="filters-header">
                    <h3>Filters</h3>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                      ✕
                    </button>
                  </div>

                  {/* Price Range */}
                  <div className="filter-group">
                    <h4>Price Range</h4>
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="filter-group filters-group">
                    <div className='brand-filter'>
                      <h4>Brand</h4>
                      <select
                        value={filters.brand}
                        onChange={(e) => handleFilterChange("brand", e.target.value)}
                      >
                        <option value="All brand">All brand</option>
                        {brands.map((brand) => (
                          <option key={brand._id} value={brand.name}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Movement Type */}
                    <div className='movement-filter'>
                      <h4>Movement Type</h4>
                      <select
                        value={filters.movement}
                        onChange={(e) => handleFilterChange('movement', e.target.value)}
                      >
                        <option value="all">All Types</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Quartz">Quartz</option>
                        <option value="Mechanical">Mechanical</option>
                      </select>
                    </div>
                  </div>


                  {/* Target Audience */}
                  <div className="filter-group">
                    <div className='audience-filter'>
                      <h4>For</h4>
                      <div className="radio-group">
                        <label>
                          <input
                            type="radio"
                            name="audience"
                            value="all"
                            checked={filters.audience === 'all'}
                            onChange={(e) => handleFilterChange('audience', e.target.value)}
                          />
                          All
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="audience"
                            value="Male"
                            checked={filters.audience === 'Male'}
                            onChange={(e) => handleFilterChange('audience', e.target.value)}
                          />
                          Men
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="audience"
                            value="Female"
                            checked={filters.audience === 'Female'}
                            onChange={(e) => handleFilterChange('audience', e.target.value)}
                          />
                          Women
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="audience"
                            value="Unisex"
                            checked={filters.audience === 'Unisex'}
                            onChange={(e) => handleFilterChange('audience', e.target.value)}
                          />
                          Unisex
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div className="filter-group">
                    <h4>Minimum Rating</h4>
                    <div className="rating-filter">
                      {[4, 3, 2, 1].map(rating => (
                        <label key={rating} className="rating-option">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.minRating === rating}
                            onChange={() => handleFilterChange('minRating', rating)}
                          />
                          <span>{renderStars(rating)} and up</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="clear-btn" onClick={clearFilters}>
                    Clear All
                  </button>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>

          {/* Main Content */}
          <main className="results-content">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <h2>Search Results for "{keyword}"</h2>
                <p>{filteredResults.length} products found</p>
              </div>

              <div className="results-controls">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <LoadingAnimations option="skeleton" />
            )}

            {/* No Results */}
            {!loading && filteredResults.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && filteredResults.length > 0 && (
              <ListProduct products={filteredResults} search={true} />
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
