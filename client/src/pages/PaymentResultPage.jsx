import { useEffect, useState } from 'react';
import '../styles/PaymentResultPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import productApi from '../api/productApi';
import orderApi from '../api/orderApi';
import LoadingAnimations from '../components/comon/LoadingAnimations';
import ListProduct from '../components/comon/ListProduct';
import { formatCurrency } from '../utils/formatCurrency';

export default function PaymentResultPage() {
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    const [checking, setChecking] = useState(1000);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const checkingPayment = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
                const response = await orderApi.transitionStatus(orderId);
                setChecking(response.resultCode);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message)
            } finally {
                setLoading(false);
            }

        }
        checkingPayment();
    }, [orderId]);

    useEffect(() => {
        const viewOrder = async () => {
            try {
                const response = await orderApi.viewOrder(orderId);
                setOrder(response.order);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        }
        viewOrder();

    }, [orderId, checking]);
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

    const handleNavigate = () => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/user/order');

        } else {
            navigate('/order');
        }
    }
    const currentProducts = products.slice(0, 4);

    return (
        <div className="payment-page">
            {loading ? (
                <LoadingAnimations option="bars" />
            ) : (
                <>
                    <div className='payment-box'>
                        <div className='order-infor'>
                            <h2>Payment Summary</h2>
                            <ul>
                                <li><strong>Order Total:</strong> {formatCurrency(order?.final_amount, 'en-US', 'USD') || 0}</li>
                                <li><strong>Payment :</strong> {order?.paymentMethod} - {order?.payment}</li>
                                <li><strong>Transaction ID:</strong> {order?.code}</li>
                                <li><strong>Status:</strong> {order?.status}</li>
                            </ul>
                        </div>

                        {/* Footer actions */}
                        <div className="payment-footer">
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                Continue Shopping
                            </button>
                            <button className="btn btn-secondary" onClick={() => handleNavigate()}>
                                View Order History
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Main Container */}
            <div className="payment-container">
                <h2>Maybe you also like</h2>
                <ListProduct products={currentProducts} />
            </div>
        </div>
    );
}
