import { useState, useEffect } from 'react';
import '../css/Home.css';
// Mock product data
const mockProducts = [
  {
    _id: '1',
    name: 'Classic Elegance Automatic',
    description: 'Swiss precision meets timeless design',
    price: 2499,
    originalPrice: 3299,
    stock: 15,
    images: ['https://placehold.co/400x400/1a1a2e/ffd700?text=Watch+1'],
    category_id: 'luxury',
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '10 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Leather',
    dial_type: 'Analog',
    thickness: 12,
    power_reserve: '42 hours',
    features: 'Date display, Exhibition case back',
    ratings: 4.8,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  },
  {
    _id: '2',
    name: 'Sport Chronograph Pro',
    description: 'Built for performance and style',
    price: 3299,
    originalPrice: 4499,
    stock: 8,
    images: ['https://placehold.co/400x400/1a1a2e/60a5fa?text=Watch+2'],
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '20 ATM',
    movement_type: 'Quartz',
    glass_material: 'Sapphire',
    strap_material: 'Stainless Steel',
    dial_type: 'Analog',
    thickness: 14,
    power_reserve: 'Battery powered',
    features: 'Chronograph, Tachymeter',
    ratings: 4.9,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 2 * 60 * 60 * 1000)
  },
  {
    _id: '3',
    name: 'Diamond Elegance Lady',
    description: 'Sophisticated luxury for women',
    price: 5999,
    stock: 12,
    images: ['https://placehold.co/400x400/1a1a2e/ff6b9d?text=Watch+3'],
    brand: 'Timepiece',
    target_audience: 'Female',
    water_resistance: '5 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Leather',
    dial_type: 'Analog',
    thickness: 9,
    power_reserve: '38 hours',
    features: 'Diamond accents, Mother of pearl dial',
    ratings: 5.0
  },
  {
    _id: '4',
    name: 'Minimalist Essence',
    description: 'Clean design, maximum impact',
    price: 1899,
    stock: 25,
    images: ['https://placehold.co/400x400/1a1a2e/34d399?text=Watch+4'],
    brand: 'Timepiece',
    target_audience: 'Unisex',
    water_resistance: '3 ATM',
    movement_type: 'Quartz',
    glass_material: 'Mineral',
    strap_material: 'Leather',
    dial_type: 'Analog',
    thickness: 8,
    power_reserve: 'Battery powered',
    features: 'Minimalist design, Date display',
    ratings: 4.6
  },
  {
    _id: '5',
    name: 'Pilot Navigator GMT',
    description: 'Aviation-inspired timepiece',
    price: 4299,
    stock: 6,
    images: ['https://placehold.co/400x400/1a1a2e/fbbf24?text=Watch+5'],
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '10 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Nylon',
    dial_type: 'Analog',
    thickness: 13,
    power_reserve: '48 hours',
    features: 'GMT function, Luminous hands',
    ratings: 4.7
  },
  {
    _id: '6',
    name: 'Ocean Diver Pro 300',
    description: 'Professional diving watch',
    price: 3799,
    stock: 10,
    images: ['https://placehold.co/400x400/1a1a2e/06b6d4?text=Watch+6'],
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '30 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Rubber',
    dial_type: 'Analog',
    thickness: 15,
    power_reserve: '40 hours',
    features: 'Diving bezel, Helium escape valve',
    ratings: 4.9
  },{
     _id: '7',
    name: 'Classic Elegance Automatic',
    description: 'Swiss precision meets timeless design',
    price: 5499,
    originalPrice: 3299,
    stock: 15,
    images: ['https://placehold.co/400x400/1a1a2e/ffd700?text=Watch+1'],
    category_id: 'luxury',
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '10 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Leather',
    dial_type: 'Analog',
    thickness: 12,
    power_reserve: '42 hours',
    features: 'Date display, Exhibition case back',
    ratings: 4.8,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  },{
     _id: '8',
    name: 'Classic Elegance Automatic',
    description: 'Swiss precision meets timeless design',
    price: 2999,
    originalPrice: 3299,
    stock: 15,
    images: ['https://placehold.co/400x400/1a1a2e/ffd700?text=Watch+1'],
    category_id: 'luxury',
    brand: 'Timepiece',
    target_audience: 'Male',
    water_resistance: '10 ATM',
    movement_type: 'Automatic',
    glass_material: 'Sapphire',
    strap_material: 'Leather',
    dial_type: 'Analog',
    thickness: 12,
    power_reserve: '42 hours',
    features: 'Date display, Exhibition case back',
    ratings: 4.9,
    isFlashSale: true,
    flashSaleEnd: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  }
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [selectedFilters, setSelectedFilters] = useState({
    brand: 'all',
    audience: 'all',
    priceRange: 'all'
  });

  const itemsPerPage = 5;
  
  // Flash sale products
  const flashSaleProducts = mockProducts.filter(p => p.isFlashSale);
  
  // Regular products with filters
  const filteredProducts = mockProducts.filter(p => !p.isFlashSale);
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      if (flashSaleProducts.length > 0) {
        const endTime = flashSaleProducts[0].flashSaleEnd;
        const now = new Date();
        const diff = endTime - now;
        
        if (diff > 0) {
          setTimeLeft({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          });
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [flashSaleProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="product-page">
      {/* Flash Sale Section */}
      {flashSaleProducts.length > 0 && (
        <section className="flash-sale-section">
          <div className="container">
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
            <div style={{display:'flex' , justifyContent:'center' , paddingBottom:'10px'}}><hr style={{width:'80%'}}/></div>
            <div className="flash-sale-grid">
              {flashSaleProducts.map(product => (
                <div key={product._id} className="flash-sale-card">
                  <div className="sale-badge">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</div>
                  <div className="product-image">
                    <img src={product.images[0]} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">
                      <span className="stars">⭐ {product.ratings}</span>
                      <span className="stock-info">Stock: {product.stock}</span>
                    </div>
                    <div className="product-specs">
                      <span className="spec-badge">{product.movement_type}</span>
                      <span className="spec-badge">{product.water_resistance}</span>
                    </div>
                    <div className="product-pricing">
                      <div className="price-info">
                        <span className="current-price">${product.price}</span>
                        <span className="original-price">${product.originalPrice}</span>
                      </div>
                      <button className="add-to-cart-btn flash">
                        🛒 Buy Now
                      </button>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${(product.stock / 20) * 100}%`}}></div>
                    </div>
                    <div className="sold-info">Hurry! Only {product.stock} left</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product List Section */}
      <section className="product-list-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">All Watches</h2>
            <div className="filter-controls">
              <select className="filter-select">
                <option>All Brands</option>
                <option>Timepiece</option>
                <option>Luxury</option>
              </select>
              <select className="filter-select">
                <option>All Audiences</option>
                <option>Male</option>
                <option>Female</option>
                <option>Unisex</option>
              </select>
              <select className="filter-select">
                <option>All Prices</option>
                <option>Under $2000</option>
                <option>$2000 - $4000</option>
                <option>Above $4000</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {currentProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.images[0]} alt={product.name} />
                  <div className="product-overlay">
                    <button className="quick-view-btn">👁️ Quick View</button>
                    <button className="wishlist-btn">❤️</button>
                  </div>
                </div>
                <div className="product-details">
                  <div className="product-brand">{product.brand}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-rating">
                    <span className="stars">⭐ {product.ratings}</span>
                    <span className="reviews">(248 reviews)</span>
                  </div>
                  <div className="product-specs-list">
                    <div className="spec-item">
                      <span className="spec-icon">⚙️</span>
                      <span>{product.movement_type}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">💧</span>
                      <span>{product.water_resistance}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">💎</span>
                      <span>{product.glass_material}</span>
                    </div>
                  </div>
                  <div className="product-footer">
                    <div className="price">${product.price}</div>
                    <button className="add-to-cart-btn">
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
        </div>
      </section>

    </div>
  );
}