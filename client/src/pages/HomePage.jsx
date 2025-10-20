import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import { Icon } from '@iconify/react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { toast } from 'react-toastify';
import LoadingAnimations from '../components/comon/LoadingAnimations';
import Brand from '../components/comon/Brand';
import productApi from '../api/productApi';
import brandApi from '../api/brandApi';
import { formatCurrency } from '../utils/formatCurrency';
import ListProduct from '../components/comon/ListProduct';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPageFlash, setCurrentPageFlash] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
          case 'under100':
            return price < 100;
          case '100to200':
            return price >= 100 && price < 200;
          case 'above200':
            return price >= 200;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

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
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Get Brand 
  useEffect(() => {
    const getBrands = async () => {
      try {
        const response = await brandApi.brand();
        setBrands(response.brand);
      } catch (err) {
        toast.error(err.response?.data?.message || err.response);
      }
    }
    getBrands();
  }, []);
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

  useEffect(() => {

    setFilteredProducts(getFilteredProducts());
  }, [selectedFilters, products]);

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
                  <Icon icon="noto:high-voltage" width="45" height="45" />
                  <span>FLASH SALE
                  </span>
                </div>
                <div className="countdown-timer">
                  <div className="timer-box">
                    <div className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                  </div>
                  <span className="timer-separator">:</span>
                  <div className="timer-box">
                    <div className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  </div>
                  <span className="timer-separator">:</span>
                  <div className="timer-box">
                    <div className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
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
                      - {Math.round((1 - product.detail[0].price / product.detail[0].originalPrice) * 100)}%
                    </div>
                    <div className="product-image">
                      <img src={`http://localhost:5000` + product.images[0]} loading="lazy" alt={product.name} />
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
                          <span className="current-price">{formatCurrency(product.detail[0].price, 'en-US', 'USD')}</span>
                          <span className="original-price">
                            {formatCurrency(product.detail[0].originalPrice, 'en-US', 'USD')}
                          </span>
                        </div>
                        <Link to={`/product?code=${product.code}`} className="add-to-cart-btn flash">
                          🛒 Buy Now
                        </Link>
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
        {<Brand />}
        {/* Product List Section */}
        <section className="product-list-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-watch">All Watches</h2>
              <div className="filter-controls">
                <select name='brand'
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
                  name='audience'
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
                  name='price'
                  className="filter-select"
                  value={selectedFilters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="under100">Under $100</option>
                  <option value="100to200">$100 - $200</option>
                  <option value="above200">Above $200</option>
                </select>
              </div>
            </div>

            {loading && <LoadingAnimations option="skeleton" />}
            {!loading &&
              (<ListProduct products={filteredProducts} />)
            }
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}