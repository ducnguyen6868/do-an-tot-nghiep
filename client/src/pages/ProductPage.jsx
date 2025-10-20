import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ProductPage.css';
import { toast } from "react-toastify";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import productApi from '../api/productApi';
import userApi from '../api/userApi';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function ProductPage() {

  const {setInfoUser} = useContext(UserContext);
  const navigate = useNavigate();
  

  const location = useLocation();
  const queyParams = new URLSearchParams(location.search);
  const code = queyParams.get("code");

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState();


  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.detail(code);
        setProduct(response.product);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [code]);

  const handleQuantityChange = (action) => {
    const selectedDetail = product.detail?.[selectedDetailIndex];
    const maxQuantity = selectedDetail?.quantity;

    if (action === 'increase' && quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 ? '½' : '');
  };


  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading product...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!product || !product.name) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Product not found</h2>
        </div>
        <Footer />
      </>
    );
  }

  const selectedDetail = product.detail?.[selectedDetailIndex] || {};

  const productData = [
    {
      id: product._id,
      name: product.name,
      code: product.code,
      image: product.images[0],
      price: selectedDetail.price,
      color: selectedDetail.color,
      quantity: quantity,
      detailId: selectedDetail._id
    }
  ]
  const handleOrder = () => {
    navigate('../product/checkout', { state: { productData } });
  }
 const handleCart =async(product)=>{
    try{
      const id= product._id;
      const code= product.code;
      const name = product.name;
      const image = product.images[selectedDetailIndex];
      const description = product.description;
      const quantity=1;
      const color=selectedDetail.color;
      const price = selectedDetail.price;
      const detailId= selectedDetail._id;
      const data={
        id,code ,name, image, description, quantity,color,price,detailId
      }
      const response = await userApi.addCart(data);
      toast.success(response.message);
      setInfoUser(prev=>({...prev , cart:response.cart}));
    }catch(err){
      toast.error(err.response?.data?.message||err.message)
    }
  };
  return (
    <>
      <Header />
      <div className="product-detail-page">
        <div className="container">
          <div className="product-section">
            {/* Image Gallery */}
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={`http://localhost:5000` + product.images[selectedImage]}
                  alt={product.name}
                />
              </div>
              <div className="thumbnail-gallery">
                {product.images?.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={`http://localhost:5000` + img} alt={`View ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-detail">
              <div className="product-badge">✨ Limited Edition</div>
              <h1 className="product-title">{product.name}</h1>

              <div className="rating-section">
                <span className="stars">{renderStars(product.ratings)}</span>
                <span className="rating-text">{product.ratings}</span>
                <span className="reviews-count">({product.reviews?.length || 0} Reviews)</span>
              </div>

              <div className="price-section-detail">
                <span className="current-price-detail">{formatCurrency(selectedDetail.price, 'en-US', 'USD')}</span>
                {selectedDetail.originalPrice > selectedDetail.price && (
                  <>
                    <span className="original-price">{formatCurrency(selectedDetail.originalPrice, 'en-US', 'USD')}</span>
                    <span className="discount-badge-detail">
                      Save {formatCurrency(selectedDetail.originalPrice - selectedDetail.price, 'en-US', 'USD')}
                    </span>
                  </>
                )}
              </div>

              <p className="product-description">{product.description}</p>

              {/* Specifications */}
              <div className="specifications">
                <h3>Specifications</h3>
                <div className="spec-grid">
                  <div className="spec-item1">
                    <span className="spec-label">Brand:</span>
                    <span className="spec-value">{product.brand?.name || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Audience:</span>
                    <span className="spec-value">{product.target_audience || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Movement:</span>
                    <span className="spec-value">{product.movement_type || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Dial type:</span>
                    <span className="spec-value">{product.dial_type || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Thickness:</span>
                    <span className="spec-value">{product.thickness || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Water Resistance:</span>
                    <span className="spec-value">{product.water_resistance || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Glass Material:</span>
                    <span className="spec-value">{product.glass_material || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Strap Material:</span>
                    <span className="spec-value">{product.strap_material || 'N/A'}</span>
                  </div>
                  <div className="spec-item1">
                    <span className="spec-label">Power Reserve:</span>
                    <span className="spec-value">{product.power_reserve || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Color Selection - from Detail array */}
              {product.detail?.length > 0 && (
                <div className="option-group">
                  <label>Color & Variant:</label>
                  <div className="color-options">
                    {product.detail.map((item, index) => (
                      <div
                        key={index}
                        className={`color-option ${selectedDetailIndex === index ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDetailIndex(index);
                          setQuantity(1); // Reset quantity when changing variant
                        }}
                        style={{
                          backgroundColor: item.color?.toLowerCase() || '#ccc',
                          border: selectedDetailIndex === index ? '3px solid #000' : '2px solid #ddd'
                        }}
                        title={`${item.color} - $${item.price}`}
                      >
                        <span style={{
                          fontSize: '10px',
                          color: item.color?.toLowerCase() === 'black' || item.color?.toLowerCase() === 'blue' ? '#fff' : '#000'
                        }}>
                          ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '14px', marginTop: '5px' }}>
                    Selected: {selectedDetail.color} - ${selectedDetail.price}
                    (Stock: {selectedDetail.quantity || 0})
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange('decrease')}>-</button>
                  <input type="text" value={quantity} readOnly />
                  <button onClick={() => handleQuantityChange('increase')}>+</button>
                </div>
                <span className="stock-info">
                  In Stock: {selectedDetail.quantity || product.stock} units
                </span>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn-add-cart" onClick={() => handleCart(product)}>🛒 Add to Cart</button>
                <button className="btn-buy-now" onClick={() => handleOrder()}>
                  ⚡ Buy Now
                </button>
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
              <button
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
              <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviews?.length || 0})
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'description' && (
                <div className="tab-panel">
                  <h3>Product Details</h3>
                  <p>{product.description}</p>
                  <p>The Classic Elegance Automatic represents the pinnacle of Swiss watchmaking tradition. Each timepiece is meticulously assembled by master craftsmen, ensuring every component meets our exacting standards.</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="tab-panel">
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {product.features?.split(',').map((feature, index) => (
                      <li key={index}>✓ {feature.trim()}</li>
                    )) || <li>No features available</li>}
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-panel reviews-panel">
                  <div className="reviews-summary">
                    <div className="summary-left">
                      <div className="average-rating">{product.ratings}</div>
                      <div className="stars-large">{renderStars(product.ratings)}</div>
                      <div className="total-reviews">{product.reviews?.length || 0} Reviews</div>
                    </div>
                    <div className="summary-right">
                      <div className="rating-bar">
                        <span>5 ⭐</span>
                        <div className="bar"><div className="fill" style={{ width: '75%' }}></div></div>
                        <span>186</span>
                      </div>
                      <div className="rating-bar">
                        <span>4 ⭐</span>
                        <div className="bar"><div className="fill" style={{ width: '15%' }}></div></div>
                        <span>37</span>
                      </div>
                      <div className="rating-bar">
                        <span>3 ⭐</span>
                        <div className="bar"><div className="fill" style={{ width: '7%' }}></div></div>
                        <span>17</span>
                      </div>
                      <div className="rating-bar">
                        <span>2 ⭐</span>
                        <div className="bar"><div className="fill" style={{ width: '2%' }}></div></div>
                        <span>5</span>
                      </div>
                      <div className="rating-bar">
                        <span>1 ⭐</span>
                        <div className="bar"><div className="fill" style={{ width: '1%' }}></div></div>
                        <span>3</span>
                      </div>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {product.reviews?.map(review => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">J</div>
                            <div>
                              <div className="reviewer-name">
                                Jonh Wick
                                <span className="verified-badge">✓ Verified Purchase</span>
                              </div>
                              <div className="review-date">08/08/1988</div>
                            </div>
                          </div>
                          <div className="review-rating">{renderStars(review.rating)}</div>
                        </div>
                        <h4 className="review-title">No subject</h4>
                        <p className="review-comment">{review.comment}</p>
                        <div className="review-footer">
                          <button className="helpful-btn">👍 Helpful 999+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}