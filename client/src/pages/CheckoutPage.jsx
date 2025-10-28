import { useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { formatCurrency } from '../utils/formatCurrency';
import orderApi from '../api/orderApi';
import profileApi from '../api/profileApi';
import pointApi from '../api/pointApi';
import InfoPayment from '../components/comon/InfoPayment';
import '../styles/CheckoutPage.css';

export default function CheckoutPage() {

    const { setInfoUser } = useContext(UserContext);

    const location = useLocation();
    const queyParams = new URLSearchParams(location.search);
    const fromCart = queyParams.get('cart') || null;
    const productData = location.state?.productData;

    const [point, setPoint] = useState();
    const [usePoint, setUsePoint] = useState(false);
    const [availablePoint, setAvailablePoint] = useState(0);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const getPoint = async () => {
            try {
                const response = await profileApi.profile();
                setPoint(response.point);
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
            }
        }
        getPoint();
    }, []);
    const subtotal = productData?.reduce((total, product) => total + product.price * product.quantity, 0);
    const shipping = 0;
    const total = (parseFloat(subtotal) + parseFloat(shipping) - discount)?.toFixed(2);

    useEffect(() => {
        if (point?.quantity < subtotal * 0.1) {
            setAvailablePoint(point?.quantity);
        } else {
            setAvailablePoint(subtotal * 0.1);
        }
    }, [point?.quantity, subtotal]);

    useEffect(() => {
        if (point?.quantity < subtotal * 0.1) {
            setAvailablePoint(point?.quantity);
        } else {
            setAvailablePoint(subtotal * 0.1);
        }
        if (usePoint) {
            if (point?.quantity < subtotal * 0.1) {
                setDiscount(point?.quantity);
            } else {
                setDiscount(subtotal * 0.1);
            }
        } else {
            setDiscount(0);
        }
    }, [usePoint, point, subtotal]);

    const handleSubmit = async (infoPayment) => {

        const orderData = {
            infoPayment,
            productData,
            total_amount: subtotal,
            discount_amount: discount,
            final_amount: total

        };
        try {
            const final_amount = total;
            const response = await orderApi.payment(final_amount);
            const res = await orderApi.createOrder(orderData, response.orderId, fromCart);
            if (!infoPayment.userId) {
                const code = res.order?.code;
                let order = localStorage.getItem('order');
                order = order ? JSON.parse(order) : [];
                order.push(code);
                localStorage.setItem('order', JSON.stringify(order));
                if (fromCart) {
                    setInfoUser(prev => ({ ...prev, cart: 0 }));
                    localStorage.removeItem('cart');
                }
            } else {
                setInfoUser(prev => ({ ...prev, cart: res.cart }));
            }
            if (discount > 0) {
                await pointApi.put(infoPayment.userId, response.orderId, discount);
            }
            window.location.href = response.payUrl;
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
            toast.error(err.res?.data?.message || err.message);
        }
    };
    return (
        <>
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
                        {point && point.quantity > 0 && (
                            <>
                                <div className='summary-row'>
                                    <span>{point.quantity} points ( {availablePoint} available )</span>
                                    {usePoint ? (
                                        <span className='forgot-btn' onClick={() => setUsePoint(!usePoint)} >Not use</span>
                                    ) : (
                                        <span className='forgot-btn' onClick={() => setUsePoint(!usePoint)} >Use</span>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>$ {subtotal?.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free">FREE</span>
                        </div>
                        {usePoint && (
                            <div className="summary-row">
                                <span>Discount</span>
                                <span>- $ {discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total} ~ {formatCurrency(total, 'vi-VN', 'VND')}</span>
                        </div>
                    </div>
                    <InfoPayment onSubmit={handleSubmit} total={total} />
                </div>
            </div>
        </>
    );
}
