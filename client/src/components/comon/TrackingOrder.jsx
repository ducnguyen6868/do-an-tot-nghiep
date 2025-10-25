import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReturnSurveyModal from '../comon/ReturnSurveyModal';
import { Link } from "react-router-dom";
import { UserContext } from '../../contexts/UserContext';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import "../../styles/TrackingOrder.css";

export default function TrackingOrder({ order }) {
    const { locale, currency } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const orderId = order._id;
    const getColor = (status) => {
        switch (status) {
            case "Order Placed":
                return '#4de606ff'
            case "Processing":
                return "#facc15";
            case "Shipping":
                return "#3b82f6";
            case "Delivered Successfully":
                return "#22c55e";
            case "Canceled":
                return "#ef4444";
            default:
                return "#9ca3af";
        }
    };

    return (
        <>
            <AnimatePresence>
                <motion.div
                    className={`order-card-pro ${order.status?.at(-1)?.present.replace(/\s/g, "-")}`}
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    layout
                >
                    <div className="order-card-header">
                        <div className='order-code'>
                            <h2 className="order-code-text">#{order.code}</h2>
                            <span className={`badge ${order.payment}`}>
                                {order.payment === "paid"
                                    ? "PAID"
                                    : "UNPAID"}
                            </span>
                            <span
                                className='progress-text' style={{ backgroundColor: getColor(order.status?.at(-1)?.present) }}
                            >
                                {order.status.at(-1)?.present}
                            </span>
                        </div>
                        <p className="order-date">
                            Ordered on: <strong>{formatDate(order.createdAt)}</strong>
                        </p>

                    </div>

                    <div className="order-main-content">
                        <div className="product-order-section">
                            <h3>Products ({order?.products?.length})</h3>
                            <div className="product-list-scroll">
                                {order.products?.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="product-item"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <img
                                            src={`http://localhost:5000${item.image}`}
                                            alt={item.name}
                                            className="product-img"
                                        />
                                        <div className="product-info-order">
                                            <Link to={`/product?code=${item.code}`} className="product-name">{item.name}</Link>
                                            <p className="product-detail-text">Color: {item.color}</p>
                                            <p className="product-detail-text">Qty: {item.quantity}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="order-details-summary">
                                <h3>Shipping Details</h3>
                                <div className="details-flex">
                                    <p>
                                        <strong>👤 Recipient:</strong> {order.name} ( {order.phone} ) - {order.address}
                                    </p>

                                    <p className="payment-method-line">
                                        <strong>💳 Payment:</strong> {order.paymentMethod}
                                    </p>
                                </div>
                            </div>
                            <div className="order-summary-box">
                                <h3>Order Summary</h3>
                                <div className="order-total">
                                    <p>
                                        Subtotal:{" "}
                                        <span>{formatCurrency(order.total_amount, locale, currency)}</span>
                                    </p>
                                    {order.discount_amount > 0 && (
                                        <p className="discount-line">
                                            Discount:{" "}
                                            <span>{formatCurrency(order.discount_amount, locale, currency)}</span>
                                        </p>
                                    )}
                                    <p className="shipping-line">
                                        Shipping Fee:{" "}
                                        <span className='free'>FREE</span>
                                    </p>

                                    <p className="final-line">
                                        Total:{" "}
                                        <span className="final">
                                            <span>{formatCurrency(order.final_amount, locale, currency)}</span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className='order-card-footer'>
                        {order.status?.at(-1)?.present === 'Delivered Successfully' ? (
                            <>
                                <Link to='#' className='action-btn review' style={{backgroundColor:'#1576e3ff'}}>Review</Link>
                                <div>
                                    <Link to='#' className='action-btn refund' style={{backgroundColor: '#eb0c0cff'}}>Return / Refund request</Link>
                                    <Link to='#' style={{ marginLeft: '.8rem',backgroundColor: '#10ee4fff' }} className='action-btn buy-again'>Buy again</Link>
                                </div>
                            </>
                        ) : order.status?.at(-1)?.present === 'Canceled' ? (
                            <>
                                <div style={{ flex: 1 }}><Link  className='action-btn' to={`/product?code=${order.products[0].code}`} style={{ backgroundColor: 'var(--brand-color)', float: 'right' , textDecoration:'none' }}>Buy again</Link></div>
                            </>
                        ) : (
                            <div style={{ flex: 1 }}><button style={{ backgroundColor: 'red', float: 'right' }} onClick={() => setOpen(true)}>Cancel</button></div>
                        )}
                    </div>

                </motion.div>

            </AnimatePresence>

            {
                open &&
                <ReturnSurveyModal
                    onClose={() => setOpen(false)}
                    orderId={orderId}
                />
            }
        </>
    );
};

