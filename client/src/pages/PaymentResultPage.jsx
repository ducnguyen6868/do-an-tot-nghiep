import { useEffect, useState } from 'react';
import '../styles/PaymentResultPage.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';
import productApi from '../api/productApi';
import orderApi from '../api/orderApi';
import LoadingAnimations from '../components/comon/LoadingAnimations';

export default function PaymentResultPage() {
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');

    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const checkingPayment = async () => {
            setLoading(true);
            await new Promise(resolve =>setTimeout(resolve,1000));
            try {
                const response = await orderApi.transitionStatus(orderId);
                if (response.resultCode === 0) {
                    setChecking(true);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || err.message)
            } finally {
                setLoading(false);
            }

        }
        checkingPayment();
    }, [orderId]);
    useEffect(() => {
        const getProducts = async () => {
            try {

                const response = await productApi.product();
                setProducts(response.products);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message)
            }
        }
        getProducts();
    }, []);

    const currentProducts = products.slice(0, 4);

    const renderStars = (rating) => {
        return '⭐'.repeat(Math.floor(rating));
    }
    return (
        <div className="payment-page">
            {loading ? (
                <LoadingAnimations option="bars" />
            ) : checking ? (
                <>
                    <div class='payment-box'>
                        <div className='order-infor'>
                            {/* Payment summary */}
                            <div className="payment-summary">
                                <h2>Payment Summary</h2>
                                <ul>
                                    <li><strong>Order Total:</strong> 520.000₫</li>
                                    <li><strong>Payment Method:</strong> MoMo E-Wallet</li>
                                    <li><strong>Transaction ID:</strong> MOMO1234567890</li>
                                    <li><strong>Status:</strong> Completed</li>
                                </ul>
                            </div>

                            {/* Order details */}
                            <div className="order-details">
                                <h2>Order Details</h2>
                                <div className="item">
                                    <span className="item-name">Rolex Submariner</span>
                                    <span className="item-price">450.000₫</span>
                                </div>
                                <div className="item">
                                    <span className="item-name">Shipping Fee</span>
                                    <span className="item-price">70.000₫</span>
                                </div>
                                <div className="item total">
                                    <span>Total</span>
                                    <span>520.000₫</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="payment-footer">
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                Continue Shopping
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/orders')}>
                                View Order History
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="payment-failed">
                    <h2>❌ Payment Failed</h2>
                    <p>Unfortunately, your payment could not be processed.</p>
                    <p>Please check your connection or try another payment method.</p>
                    <button className="btn btn-retry" onClick={() => navigate('/checkout')}>
                        View order
                    </button>
                </div>
            )}

            {/* Main Container */}
            <div className="payment-container">
                <h2>Maybe you also like</h2>
                <div className='results-grid'>
                    {currentProducts.map(product => (
                        <div key={product._id} className="product-card-search">
                            <div className="product-image">
                                <img src="http://localhost:5000/uploads/image-replace.jpg" loading="lazy" alt={product.name} />
                                <div className="discount-badge ">
                                    -{Math.round((1 - product.detail[0]?.price / product.detail[0]?.originalPrice) * 100)}%
                                </div>
                                <div className="product-overlay">
                                    <Link to={`/product?code=${product.code}`} className="quick-view-btn">👁️ Quick View</Link>
                                    <button className="wishlist-btn">❤️</button>
                                </div>
                            </div>

                            <div className="product-info">
                                <div className="product-brand-detail">{product.brand.name}</div>
                                <h3 className="product-name-detail">{product.name}</h3>
                                <p className="product-description-search">{product.description}</p>

                                <div className="product-rating-search">
                                    <span className="stars">{renderStars(product.ratings)}{product.ratings}</span>
                                    <span className="reviews">({product.reviews?.length} Reviews)</span>
                                </div>

                                <div className="product-specs">
                                    <span className="spec-badge">{product.movement_type}</span>
                                    <span className="spec-badge">{product.water_resistance}</span>
                                    <span className="spec-badge">{product.target_audience}</span>
                                </div>

                                <div className="product-footer1">
                                    <div className="price-section">
                                        <span className="current-price price">{formatCurrency(product.detail[0]?.price, 'en-US', 'USD')}</span>
                                        {product.detail[0]?.originalPrice && (
                                            <span className="original-price">{formatCurrency(product.detail[0]?.originalPrice, 'en-US', 'USD')}</span>
                                        )}
                                    </div>
                                    <button className="add-cart-btn">🛒 Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
