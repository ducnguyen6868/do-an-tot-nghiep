import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/userApi';
import '../styles/CartPage.css';
import { formatCurrency } from '../utils/formatCurrency';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';
import cart404 from '../assets/cart404.png';

export default function CartPage() {
    const { setInfoUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [carts, setCarts] = useState([]);
    const [total, setTotal] = useState(0);
    const [indexCart, setIndexCart] = useState(-1);

    const [productData, setProductData] = useState([]);

    const getCarts = async () => {
        try {
            const response = await userApi.viewCart();
            setCarts(response.carts);
            const total = response.carts.reduce((t, c) => t + c.price_product * c.quantity_product, 0);
            setTotal(total);
            const handleProductData = await response.carts.map(cart => {
                const product = {
                    id: cart.productId,
                    name: cart.name_product,
                    code: cart.code_product,
                    image: cart.image_product,
                    price: cart.price_product,
                    color: cart.color_product,
                    quantity: cart.quantity_product,
                    detailId: cart.detailId
                }
                return product
            })
            setProductData(handleProductData);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    }
    useEffect(() => {
        getCarts();
    }, []);
    const handleQuantityChange = async (cartId, action, index) => {
        setIndexCart(index);
        const updatedCarts = carts.map(cart => {
            if (cart._id === cartId) {
                let newQuantity = cart.quantity_product;
                if (action === 'increase') newQuantity += 1;
                else if (action === 'decrease' && newQuantity > 1) newQuantity -= 1;
                return { ...cart, quantity_product: newQuantity };
            }
            return cart;
        });

        setCarts(updatedCarts);


        const total = updatedCarts.reduce((t, c) => t + c.price_product * c.quantity_product, 0);
        setTotal(total);
    };

    const handleSubmitQuantity = async (cartId, quantitty) => {
        try {
            const response = await userApi.changeQuantity(cartId, quantitty);
            toast.success(response.message);
            setIndexCart(-1);
            getCarts();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }
    const handleRemove = async (cartId) => {
        try {
            const response = await userApi.deleteCart(cartId);
            toast.success(response.message);
            getCarts();
            setInfoUser(prev => ({ ...prev, cart: response.cart }));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message)
        }
    }
    const handleShopping = ()=>{
        navigate('/product/checkout?cart=all',{state:{productData}});
    }
    return (
        <>
            <Header />
            <div className="cart-container">
                {(carts.length === 0) ? (
                    <>
                        <img style={{ width: '100%' }} src={cart404} />
                    </>
                ) : (
                    <>
                        <div className="cart-content">
                            <div className="cart-items">
                                {
                                    carts.map((cart, index) => (
                                        <div key={index} className="cart-item">
                                            <div className="item-image">
                                                <img src={`http://localhost:5000${cart.image_product}`} alt={cart.name_product} title={cart.name_product} />
                                            </div>
                                            <div className="item-details">
                                                <div className="item-header">
                                                    <Link to={`/product?code=${cart.code_product}`} className="item-name">{cart.name_product}</Link>
                                                    <div className="item-price">{formatCurrency(cart.price_product, 'en-US', 'USD')}</div>
                                                </div>
                                                <p className="item-description">{cart.description_product}</p>
                                                <div className='item-color'>Color:{cart.color_product}</div>
                                                <div className="item-controls">
                                                    <div className="quantity-control">
                                                        <button className="qty-btn" onClick={() => handleQuantityChange(cart._id, 'decrease', index)}>−</button>
                                                        <div className="quantity">{cart.quantity_product}</div>
                                                        <button className="qty-btn" onClick={() => handleQuantityChange(cart._id, 'increase', index)}>+</button>
                                                    </div>
                                                    <button className={`quantity-change ${indexCart === index ? 'show' : ' '}`} onClick={() => handleSubmitQuantity(cart._id, cart.quantity_product)}>Ok</button>
                                                    <button className="item-remove" onClick={() => handleRemove(cart._id)}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))

                                }
                            </div>
                        </div>
                        <div className="cart-summary">
                            <div className="summary-title">Order Summary</div>
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(total, 'en-US', 'USD')}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>{formatCurrency(total * 0.001, 'en-US', 'USD')}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax:</span>
                                <span>{formatCurrency(total * 0.1, 'en-US', 'USD')}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>{formatCurrency(total + total * 0.101, 'en-US', 'USD')}</span>
                            </div>
                            <button className="checkout-btn" onClick={()=>handleShopping()}>Proceed to Checkout</button>
                            <button className="continue-shopping">Continue Shopping</button>
                        </div>
                    </>
                )}
            </div >
            <Footer />
        </>
    )
}