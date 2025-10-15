import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { toast } from 'react-toastify';
import LoadingAnimations from '../components/comon/LoadingAnimations';
import productApi from '../api/productApi';
import brandApi from '../api/brandApi';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageFlash, setCurrentPageFlash] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedFilters, setSelectedFilters] = useState({
    brand: 'all',
    audience: 'all',
    priceRange: 'all'
  });

  // Flash sale products - only active ones
  const flashSaleProducts = products.filter(p => {
    if (!p.flashSale) return false;
    const endTime = new Date(p.flashSaleEnd);
    return endTime > new Date();
  });

  // Regular products with filters applied
  const getFilteredProducts = () => {
    let filtered = products.filter(p => {
      // Exclude active flash sale products
      if (p.flashSale) {
        const endTime = new Date(p.flashSaleEnd);
        if (endTime > new Date()) return false;
      }
      return true;
    });

    // Apply brand filter
    if (selectedFilters.brand !== 'all') {
      filtered = filtered.filter(p => p.brand?.name === selectedFilters.brand);
    }

    // Apply audience filter
    if (selectedFilters.audience !== 'all') {
      filtered = filtered.filter(p => p.target_audience === selectedFilters.audience);
    }

    // Apply price range filter
    if (selectedFilters.priceRange !== 'all') {
      filtered = filtered.filter(p => {
        const price = p.detail?.[0]?.price || 0;
        switch (selectedFilters.priceRange) {
          case 'under200':
            return price < 200;
          case '200to500':
            return price >= 200 && price < 500;
          case 'above500':
            return price >= 500;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Pagination
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);


  const itemsPerPageFlash = 4;
  const totalPagesFlash = Math.ceil(flashSaleProducts.length / itemsPerPageFlash);
  const startIndexFlash = (currentPageFlash - 1) * itemsPerPageFlash;
  const flashProducts = flashSaleProducts.slice(startIndexFlash, startIndexFlash + itemsPerPageFlash);

  // Get products from API
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await productApi.product();

        const updated = response.products.map((product) => {
          const soldCount = product.detail?.reduce((sum, d) => sum + (d.sold || 0), 0) || 0;
          const quantityCount = product.detail?.reduce((sum, d) => sum + (d.quantity || 0), 0) || 0;
          const stockCount = quantityCount - soldCount;
          const reviewCount = product.reviews.length;
          return {
            ...product,
            sold: soldCount,
            stock: stockCount, reviewCount: reviewCount
          };
        });
        setProducts(updated);
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
      }
    };

    getProducts();
  }, []);

  //Get Brand 
  useEffect(() => {
    const getBrands = async () => {
      try {
        const response = await brandApi.brand();
        setBrands(response.brand);
      } catch (err) {
        toast.error(err.response?.data?.message || err.response);
      } finally {
        setLoading(false);
      }
    }
    getBrands();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      if (flashSaleProducts.length > 0) {
        const endTime = new Date(flashSaleProducts[0].flashSaleEnd);
        const now = new Date();
        const diff = endTime - now;

        if (diff > 0) {
          setTimeLeft({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSaleProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePageChangeFlash = (page) => {
    setCurrentPageFlash(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <>
      <Header />
      <div className="product-page">
        {/* Flash Sale Section */}
        {totalPagesFlash > 0 && (
          <section className="flash-sale-section">
            <div className="flash-sale-container">
              <div className="flash-sale-header">
                <div className="flash-sale-title">
                  <span className="lightning-icon">⚡</span>
                  <h2>FLASH SALE</h2>
                  <span className="fire-icon">🔥</span>
                </div>
                <div className="countdown-timer">
                  <span className="timer-label">Ends in:</span>
                  <div className="timer-boxes">
                    <div className="timer-box">
                      <div className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="timer-label">Hours</div>
                    </div>
                    <span className="timer-separator">:</span>
                    <div className="timer-box">
                      <div className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="timer-label">Mins</div>
                    </div>
                    <span className="timer-separator">:</span>
                    <div className="timer-box">
                      <div className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="timer-label">Secs</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
                <hr style={{ width: '80%' }} />
              </div>
              {loading && (
                <div style={{ padding: '2rem', borderRadius: '2rem', backgroundColor: 'var(--bg-primary)' }}>

                  <LoadingAnimations option="skeleton" />
                </div>
              )}

              <div className="flash-sale-grid">
                {!loading && flashProducts.map((product) => (
                  <div key={product._id} className="flash-sale-card">
                    <div className="sale-badge">
                      -{Math.round((1 - product.detail[0].price / product.detail[0].originalPrice) * 100)}%
                    </div>
                    <div className="product-image">
                      <img src="http://localhost:5000/uploads/image-replace.jpg" loading="lazy" alt={product.name} />
                    </div>
                    <div className="product-info">
                      <div className="product-brand">{product.brand.name}</div>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-rating">
                        <span className="stars">⭐⭐⭐⭐⭐ {product.ratings}</span>
                        <span className="stock-info">Sold: {product.sold}</span>
                      </div>
                      <div className="product-pricing">
                        <div className="price-info">
                          <span className="current-price">${product.detail[0].price}</span>
                          <span className="original-price">${product.detail[0].originalPrice}</span>
                        </div>
                        <button className="add-to-cart-btn flash">
                          🛒 Buy Now
                        </button>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min((product.stock / (product.stock + product.sold)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="sold-info">Hurry! Only {product.stock} left</div>
                    </div>
                  </div>


                ))}
              </div>
                {/* Pagination */}
                {totalPagesFlash > 0 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChangeFlash(currentPageFlash - 1)}
                      disabled={currentPageFlash === 1}
                    >
                      ← Previous
                    </button>

                    <div className="page-numbers">
                      {[...Array(totalPagesFlash)].map((_, index) => (
                        <button
                          key={index + 1}
                          className={`page-number ${currentPageFlash === index + 1 ? 'active' : ''}`}
                          onClick={() => handlePageChangeFlash(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChangeFlash(currentPageFlash + 1)}
                      disabled={currentPageFlash === totalPagesFlash}
                    >
                      Next →
                    </button>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* Product List Section */}
        <section className="product-list-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">All Watches</h2>
              <div className="filter-controls">
                <select
                  className="filter-select"
                  value={selectedFilters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="all">All Brands</option>
                  {brands.map(brand =>
                    <option key={brand._id} value={brand.name}>{brand.name}</option>
                  )}
                </select>
                <select
                  className="filter-select"
                  value={selectedFilters.audience}
                  onChange={(e) => handleFilterChange('audience', e.target.value)}
                >
                  <option value="all">All Audiences</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
                <select
                  className="filter-select"
                  value={selectedFilters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="under200">Under $200</option>
                  <option value="200to500">$200 - $500</option>
                  <option value="above500">Above $500</option>
                </select>
              </div>
            </div>

            {loading && <LoadingAnimations option="skeleton" />}
            <div className="product-grid">
              {!loading && currentProducts.map(product => (
                <div key={product._id} className="product-card" >
                  <div className="product-image">
                    <img src="http://localhost:5000/uploads/image-replace.jpg" loading="lazy" alt={product.name} />
                    <div className="product-overlay">
                      <Link to={`/product?code=${product.code}`} className="quick-view-btn">👁️ Quick View</Link>
                      <button className="wishlist-btn">❤️</button>
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="product-brand">{product.brand?.name || 'N/A'}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-rating">
                      <span className="stars">⭐⭐⭐⭐⭐ {product.ratings}</span>
                      <span className="reviews">({product.reviewCount} reviews)</span>
                    </div>
                    <div className="product-specs-list">
                      <div className="spec-item">
                        <span className="spec-icon">⚙️</span>
                        <span>{product.movement_type || 'N/A'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">💧</span>
                        <span>{product.water_resistance || 'N/A'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">💎</span>
                        <span>{product.glass_material || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="product-footer">
                      <div className="price">
                        ${product.detail?.[0]?.price || 'N/A'}
                      </div>
                      <button className="add-to-cart-btn">
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className="page-numbers">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}