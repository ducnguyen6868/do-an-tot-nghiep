import { useState } from 'react';
import '../css/ProductDetailPage.css';
// Mock product data
const productData = {
  _id: '1',
  name: 'Classic Elegance Automatic',
  description: 'Experience the epitome of Swiss craftsmanship with our Classic Elegance Automatic watch. Featuring a precision automatic movement, sapphire crystal glass, and premium leather strap, this timepiece combines timeless design with modern engineering excellence.',
  price: 2499,
  originalPrice: 3299,
  stock: 15,
  images: [
    'https://placehold.co/600x600/1a1a2e/ffd700?text=Watch+Front',
    'https://placehold.co/600x600/1a1a2e/ffd700?text=Watch+Side',
    'https://placehold.co/600x600/1a1a2e/ffd700?text=Watch+Back',
    'https://placehold.co/600x600/1a1a2e/ffd700?text=Watch+Detail'
  ],
  brand: 'Timepiece',
  target_audience: 'Male',
  water_resistance: '10 ATM (100m)',
  movement_type: 'Swiss Automatic',
  glass_material: 'Sapphire Crystal',
  strap_material: 'Genuine Leather',
  dial_type: 'Analog',
  thickness: 12,
  power_reserve: '42 hours',
  features: 'Date display, Exhibition case back, Luminous hands, Anti-reflective coating',
  ratings: 4.8,
  totalReviews: 248
};

// Mock reviews data
const reviewsData = [
  {
    id: 1,
    userName: 'James Mitchell',
    rating: 5,
    date: '2025-09-15',
    title: 'Outstanding Quality!',
    comment: 'Absolutely stunning watch! The craftsmanship is impeccable and it feels substantial on the wrist. The automatic movement is smooth and accurate. Worth every penny!',
    helpful: 45,
    verified: true
  },
  {
    id: 2,
    userName: 'Sarah Johnson',
    rating: 5,
    date: '2025-09-10',
    title: 'Perfect Gift',
    comment: 'Bought this as a gift for my husband and he absolutely loves it. The packaging was luxurious and the watch exceeded our expectations. Highly recommend!',
    helpful: 32,
    verified: true
  },
  {
    id: 3,
    userName: 'Robert Chen',
    rating: 5,
    date: '2025-09-05',
    title: 'Daily Wear Perfection',
    comment: 'This is my third purchase from Timepiece and they never disappoint. The Classic Elegance is a perfect daily wear watch that transitions beautifully from office to evening events.',
    helpful: 28,
    verified: true
  },
  {
    id: 4,
    userName: 'Michael Brown',
    rating: 4,
    date: '2025-08-28',
    title: 'Great Watch, Minor Issue',
    comment: 'Love the watch overall. The design is beautiful and the automatic movement is fascinating to watch. Only issue is the leather strap feels a bit stiff initially, but I expect it to break in.',
    helpful: 15,
    verified: true
  },
  {
    id: 5,
    userName: 'David Wilson',
    rating: 5,
    date: '2025-08-20',
    title: 'Excellent Value',
    comment: 'For the price point, this watch offers incredible value. The sapphire crystal is scratch-resistant and the exhibition case back is a nice touch. Very satisfied with my purchase.',
    helpful: 22,
    verified: true
  }
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('gold');
  const [selectedStrap, setSelectedStrap] = useState('leather');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Purchase form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < productData.stock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required fields!');
      return;
    }
    
    // Process order
    alert(`Order placed successfully!\nProduct: ${productData.name}\nQuantity: ${quantity}\nTotal: $${(productData.price * quantity).toLocaleString()}\n\nThank you for your purchase!`);
    setShowPurchaseForm(false);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 ? '½' : '');
  };

  return (
    <div className="product-detail-page">
      {/* Product Section */}
      <div className="container">
        <div className="product-section">
          {/* Image Gallery */}
          <div className="image-gallery">
            <div className="main-image">
              <img src={productData.images[selectedImage]} alt={productData.name} />
            </div>
            <div className="thumbnail-gallery">
              {productData.images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-badge">✨ Limited Edition</div>
            <h1 className="product-title">{productData.name}</h1>
            
            <div className="rating-section">
              <span className="stars">{renderStars(productData.ratings)}</span>
              <span className="rating-text">{productData.ratings}</span>
              <span className="reviews-count">({productData.totalReviews} Reviews)</span>
            </div>

            <div className="price-section-detail">
              <span className="current-price">${productData.price.toLocaleString()}</span>
              <span className="original-price">${productData.originalPrice.toLocaleString()}</span>
              <span className="discount-badge-detail">Save ${productData.originalPrice - productData.price}</span>
            </div>

            <p className="product-description">{productData.description}</p>

            {/* Specifications */}
            <div className="specifications">
              <h3>Specifications</h3>
              <div className="spec-grid">
                <div className="spec-item1">
                  <span className="spec-label">Brand:</span>
                  <span className="spec-value">{productData.brand}</span>
                </div>
                <div className="spec-item1">
                  <span className="spec-label">Movement:</span>
                  <span className="spec-value">{productData.movement_type}</span>
                </div>
                <div className="spec-item1">
                  <span className="spec-label">Water Resistance:</span>
                  <span className="spec-value">{productData.water_resistance}</span>
                </div>
                <div className="spec-item1">
                  <span className="spec-label">Glass Material:</span>
                  <span className="spec-value">{productData.glass_material}</span>
                </div>
                <div className="spec-item1">
                  <span className="spec-label">Strap Material:</span>
                  <span className="spec-value">{productData.strap_material}</span>
                </div>
                <div className="spec-item1">
                  <span className="spec-label">Power Reserve:</span>
                  <span className="spec-value">{productData.power_reserve}</span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="option-group">
              <label>Color:</label>
              <div className="color-options">
                <div className={`color-option gold ${selectedColor === 'gold' ? 'selected' : ''}`} onClick={() => setSelectedColor('gold')}></div>
                <div className={`color-option silver ${selectedColor === 'silver' ? 'selected' : ''}`} onClick={() => setSelectedColor('silver')}></div>
                <div className={`color-option black ${selectedColor === 'black' ? 'selected' : ''}`} onClick={() => setSelectedColor('black')}></div>
                <div className={`color-option rose ${selectedColor === 'rose' ? 'selected' : ''}`} onClick={() => setSelectedColor('rose')}></div>
              </div>
            </div>

            {/* Strap Selection */}
            <div className="option-group">
              <label>Strap Type:</label>
              <div className="strap-options">
                <div className={`strap-option ${selectedStrap === 'leather' ? 'selected' : ''}`} onClick={() => setSelectedStrap('leather')}>Leather</div>
                <div className={`strap-option ${selectedStrap === 'steel' ? 'selected' : ''}`} onClick={() => setSelectedStrap('steel')}>Steel Bracelet</div>
                <div className={`strap-option ${selectedStrap === 'nato' ? 'selected' : ''}`} onClick={() => setSelectedStrap('nato')}>NATO</div>
              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange('decrease')}>-</button>
                <input type="text" value={quantity} readOnly />
                <button onClick={() => handleQuantityChange('increase')}>+</button>
              </div>
              <span className="stock-info">In Stock: {productData.stock} units</span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-add-cart">🛒 Add to Cart</button>
              <button className="btn-buy-now" onClick={() => setShowPurchaseForm(true)}>⚡ Buy Now</button>
              <button className="btn-wishlist">❤️</button>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-item">
                <span className="trust-icon">🚚</span>
                <span>Free Shipping</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <span>2 Year Warranty</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">💎</span>
                <span>100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="tabs-section">
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
              Description
            </button>
            <button className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>
              Features
            </button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              Reviews ({productData.totalReviews})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Product Details</h3>
                <p>{productData.description}</p>
                <p>The Classic Elegance Automatic represents the pinnacle of Swiss watchmaking tradition. Each timepiece is meticulously assembled by master craftsmen, ensuring every component meets our exacting standards.</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="tab-panel">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {productData.features.split(',').map((feature, index) => (
                    <li key={index}>✓ {feature.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel reviews-panel">
                <div className="reviews-summary">
                  <div className="summary-left">
                    <div className="average-rating">{productData.ratings}</div>
                    <div className="stars-large">{renderStars(productData.ratings)}</div>
                    <div className="total-reviews">{productData.totalReviews} Reviews</div>
                  </div>
                  <div className="summary-right">
                    <div className="rating-bar">
                      <span>5 ⭐</span>
                      <div className="bar"><div className="fill" style={{width: '75%'}}></div></div>
                      <span>186</span>
                    </div>
                    <div className="rating-bar">
                      <span>4 ⭐</span>
                      <div className="bar"><div className="fill" style={{width: '15%'}}></div></div>
                      <span>37</span>
                    </div>
                    <div className="rating-bar">
                      <span>3 ⭐</span>
                      <div className="bar"><div className="fill" style={{width: '7%'}}></div></div>
                      <span>17</span>
                    </div>
                    <div className="rating-bar">
                      <span>2 ⭐</span>
                      <div className="bar"><div className="fill" style={{width: '2%'}}></div></div>
                      <span>5</span>
                    </div>
                    <div className="rating-bar">
                      <span>1 ⭐</span>
                      <div className="bar"><div className="fill" style={{width: '1%'}}></div></div>
                      <span>3</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {reviewsData.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="avatar">{review.userName[0]}</div>
                          <div>
                            <div className="reviewer-name">
                              {review.userName}
                              {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
                            </div>
                            <div className="review-date">{review.date}</div>
                          </div>
                        </div>
                        <div className="review-rating">{renderStars(review.rating)}</div>
                      </div>
                      <h4 className="review-title">{review.title}</h4>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-footer">
                        <button className="helpful-btn">👍 Helpful ({review.helpful})</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <div className="modal-overlay" onClick={() => setShowPurchaseForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowPurchaseForm(false)}>✕</button>
            <h2 className="modal-title">Complete Your Purchase</h2>
            
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>{productData.name} × {quantity}</span>
                <span>${(productData.price * quantity).toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${(productData.price * quantity).toLocaleString()}</span>
              </div>
            </div>

            <div className="purchase-form">
              <div className="form-section">
                <h3>Shipping Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 8900" required />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="United States" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main Street, Apt 4B" required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="New York" required />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="10001" required />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className={`payment-option ${formData.paymentMethod === 'credit-card' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="credit-card" checked={formData.paymentMethod === 'credit-card'} onChange={handleInputChange} />
                    <span>💳 Credit Card</span>
                  </label>
                  <label className={`payment-option ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleInputChange} />
                    <span>📱 PayPal</span>
                  </label>
                  <label className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} />
                    <span>💵 Cash on Delivery</span>
                  </label>
                </div>

                {formData.paymentMethod === 'credit-card' && (
                  <div className="card-details">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/YY" />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="text" name="cardCVV" value={formData.cardCVV} onChange={handleInputChange} placeholder="123" maxLength="3" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="submit-order-btn" onClick={handleSubmitOrder}>
                Place Order - ${(productData.price * quantity).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}