import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import '../styles/CheckoutPage.css';
import momoImg from '../assets/momo.png';
import zaloImg from '../assets/zalopay.png';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import recipientApi from '../api/recipientApi';
import orderApi from '../api/orderApi';
import { formatCurrency } from '../utils/formatCurrency';
import { isValidPhoneNumber } from "../utils/isValidPhoneNumber";
import Recipient from '../components/comon/Recipient';

export default function CheckoutPage() {

    const { infoUser, setInfoUser } = useContext(UserContext);

    const location = useLocation();
    const queyParams = new URLSearchParams(location.search);
    const fromCart = queyParams.get('cart') || null;
    const productData = location.state?.productData;
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [logged, setLogged] = useState(false);
    const [formData, setFormData] = useState({ payment: '', type: 'Home' });
    const [errors, setErrors] = useState({});

    const [recipient, setRecipient] = useState({
        name: '',
        phone: '',
        address: '',
        type: "Home"
    });
    const [addresses, setAddresses] = useState([]);
    const [addressList, setAddressList] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            setLogged(false);
        } else {
            setLogged(true);
            setFormData((prev) => ({
                ...prev,
                email: infoUser.email
            }));
        }

    }, [infoUser.email]);
    const getRecipients = async () => {
        try {
            const response = await recipientApi.recipient();
            setAddresses(response.recipients);
            response.recipients.forEach((r) => {
                if (r.isDefault) {
                    setRecipient({
                        name: r.name,
                        phone: r.phone,
                        address: r.address,
                        type: r.type,
                        id: r._id
                    });
                }
            });
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };
    useEffect(() => {
        if (logged) {
            getRecipients();
        }
    }, [logged]);

    const handleShipping = () => {
        setStep(step + 1);
        if (logged) {
            setFormData({
                ...formData,
                name: recipient.name,
                phone: recipient.phone,
                address: recipient.address,
                type: recipient.type,
                recipientId: recipient.id
            });
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipient({ ...recipient, [name]: value });
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            name: ''
        });
    };

    const handleChangeRecipient = (address) => {
        setRecipient({
            name: address.name,
            phone: address.phone,
            address: address.address,
            type: address.type,
            id: address._id
        });
        setAddressList(false);
    };

    const subtotal = productData?.reduce((total, product) => total + product.price * product.quantity, 0);
    const shipping = 0;
    const tax = (subtotal * 0.1)?.toFixed(2);
    const total = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax))?.toFixed(2);

    const handleSubmitOrder = async () => {
        if (!logged) {

            if (!formData.name?.trim()) {
                setErrors((prev) => ({ ...prev, name: "Please enter full name." }));
                setStep(1);
                return;
            }

            if (!formData.phone) {
                setErrors((prev) => ({ ...prev, phone: "Please enter your phone number." }));
                setStep(1);
                return;
            }

            if (!isValidPhoneNumber(formData.phone)) {
                setErrors((prev) => ({ ...prev, phone: "Invalid phone number format." }));
                setStep(1);
                return;
            }
            if (!formData.type) {
                toast.error("Please select the type of your address.");
                setStep(1);
                return;
            }
        }
        if (!formData.payment) {
            toast.error('Please select a payment method!');
            setStep(2);
            return;
        }

        const orderData = {
            formData,
            productData,
            total_amount: total,
            discount_amount: 0,
            final_amount: total

        };
        try {
            setLoading(true);
            const final_amount = total;
            const response = await orderApi.payment(final_amount);
            const res = await orderApi.createOrder(orderData, response.orderId, fromCart);
            setInfoUser(prev => ({ ...prev, cart: res.cart }));
            window.location.href = response.payUrl;
        } catch (err) {
            toast.error(err.res?.data?.message || err.message);
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Header />
            <div className="checkout-container">
                <div className="checkout-main">
                    {/* --- ORDER SUMMARY --- */}
                    <div className="order-summary">
                        <div className="summary-title">Order Summary</div>
                        {productData?.map((product, index) => (
                            <div key={index} className="product-order-card">
                                <div className="product-order-img">
                                    <img src={`http://localhost:5000` + product.image} alt={product.name} title={product.name} />
                                </div>
                                <div className="product-order-details">
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-meta">
                                        Color :{product.color}
                                    </div>
                                    <div className="product-meta">Qty: {product.quantity}</div>
                                    <div className="product-price">${product.price?.toFixed(2)}</div>
                                </div>
                            </div>
                        )
                        )}
                        <div className="free-shipping">
                            <Icon icon="noto:delivery-truck" width="14" height="14" />
                            Free Shipping Worldwide
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free">FREE</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>${tax}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total} ~ {formatCurrency(total * 25000, 'vi-VN', 'VND')}</span>
                        </div>
                    </div>

                    {/* --- FORM --- */}
                    <div className="checkout-form">
                        <div className="step-indicator">
                            {['Shipping', 'Payment', 'Review'].map((label, i) => (
                                <div
                                    key={label}
                                    className={`step ${step === i + 1 ? 'active' : ''}`}
                                    onClick={() => setStep(i + 1)}
                                >
                                    <div className="step-number">{i + 1}</div>
                                    <div>{label}</div>
                                </div>
                            ))}
                        </div>

                        {step === 1 && (
                            <div className="form-order-section">
                                <div className="section-title">Shipping Address</div>
                                {logged ? (
                                    <div className="addresses-container">
                                        {
                                            addresses.length === 0 ? (
                                                <>
                                                    <Recipient onChange={() => getRecipients()} />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="address-item">
                                                        <div className="address-content">
                                                            <div className="address-name">
                                                                {recipient.name}
                                                                <span className="address-type-badge">{recipient.type}</span>
                                                            </div>
                                                            <div className="address-phone">{recipient.phone}</div>
                                                            <div className="address-text">{recipient.address}</div>
                                                        </div>
                                                        <button className="change-recipient" onClick={() => setAddressList(true)}>
                                                            change
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        }

                                    </div>
                                ) : (
                                    <div className="recipient-form">
                                        <div className="recipient-form">
                                            <div className="form-group">
                                                <label htmlFor="name">Full Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={recipient.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                {errors.name && (
                                                    <div className="form-error">
                                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                                        <span>{errors.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="phone">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={recipient.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                {errors.phone && (
                                                    <div className="form-error">
                                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                                        <span>{errors.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="address">Address</label>
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    rows="3"
                                                    value={recipient.address}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                {errors.address && (
                                                    <div className="form-error">
                                                        <Icon icon="mdi:alert-circle" width="16" height="16" />
                                                        <span>{errors.address}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <label>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Home"
                                                    checked={recipient.type === "Home"}
                                                    onChange={handleInputChange}
                                                />
                                                Home
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value="Office"
                                                    checked={recipient.type === "Office"}
                                                    onChange={handleInputChange}
                                                />
                                                Office
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="form-order-section">
                                <div className="section-title">Payment Method</div>
                                <div className="payment-method">
                                    <label className="momo">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="MOMO"
                                            checked={formData.payment === 'MOMO'}
                                            onChange={handleInputChange}
                                        />
                                        <img src={momoImg} alt="MOMO" />
                                        <span className="payment-text">Pay with MOMO</span>
                                    </label>
                                    <label className="zalopay">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="ZaloPay"
                                            checked={formData.payment === 'ZaloPay'}
                                            onChange={handleInputChange}
                                        />
                                        <img src={zaloImg} alt="zalopay" />
                                        <span className="payment-text">Pay with ZaloPay</span>
                                    </label>
                                    <label className="cod">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            checked={formData.payment === 'COD'}
                                            onChange={handleInputChange}
                                        />
                                        <Icon icon="mdi:cash" width="30" height="30" />
                                        <span className="payment-text">Cash On Delivery</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="form-order-section">
                                <div className="section-title">Order Review</div>
                                <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    <p><strong>Ship to:</strong> {formData.name} - {formData.phone}</p>
                                    <p>{formData.address}</p>
                                    <p><strong>Payment:</strong> {formData.payment}</p>
                                    <p><strong>Total:</strong> ${total}</p>
                                </div>
                            </div>
                        )}

                        <div className="buttons">
                            {step > 1 && (
                                <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                                    Back
                                </button>
                            )}
                            {step < 3 && (
                                <button className="btn btn-primary" onClick={() => handleShipping()}>
                                    Continue to {step === 1 ? 'Payment' : 'Review'}
                                </button>
                            )}
                            {step === 3 && (
                                <button className="btn btn-primary" onClick={handleSubmitOrder} disabled={loading}>
                                    {loading ? 'Processing...' : 'Complete Order'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- MODAL --- */}
                {addressList && (
                    <div className="modal-overlay" onClick={() => setAddressList(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="addresses-container">
                                {addresses.map((address) => (
                                    <div
                                        key={address._id}
                                        className="address-item"
                                        onClick={() => handleChangeRecipient(address)}
                                    >
                                        <div className="address-header">
                                            <div className="address-type-badge">{address.type}</div>
                                            {address.isDefault && <div className="default-tag">Default</div>}
                                        </div>
                                        <div className="address-content">
                                            <div className="address-name">{address.name}</div>
                                            <div className="address-phone">{address.phone}</div>
                                            <div className="address-text">{address.address}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
