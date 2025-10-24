import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import order404 from '../assets/order404.png';
import TrackingOrder from "../components/comon/TrackingOrder";
import profileApi from '../api/profileApi';
import orderApi from "../api/orderApi";
import '../styles/OrderPage.css';

export default function OrderPage() {
    const [checked, setChecked] = useState(false);
    const [logged, setLogged] = useState(false);

    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");


    const filteredOrders = orders?.filter(
        (o) =>
            (filter === "all" || o.status === filter) &&
            o.code.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const checking = async () => {
            try {
                await profileApi.profile();
                setLogged(true);
            } catch (err) {
                setLogged(false);
            } finally {
                setChecked(true);
            }
        }
        checking();
    }, []);
    useEffect(() => {
        if (!checked) return;
        if (logged) {
            const getOrders = async () => {
                try {
                    const response = await orderApi.view();
                    setOrders(response.orders);
                } catch (err) {
                    toast.error(err.response?.data?.message || err.message);
                }
            }
            getOrders();
        } else {
            let order = localStorage.getItem('order');

            if (order) {
                try {
                    order = JSON.parse(order);
                    if (Array.isArray(order)) {
                        order = order.reverse();
                        setOrders(order);
                    } else {
                        setOrders([]);
                    }
                } catch (err) {
                    console.error("Error parsing order from localStorage:", err);
                    setOrders([]);
                }
            } else {
                setOrders([]);
            }
        }
    }, [logged, checked]);
    return (
        <>
            {(orders?.length === 0) ? (
                <div className='empty-container'>
                    <img className='empty-image' alt="Order Empty" title="Order Empty" src={order404} />
                    <Link to='/' className='shopping-btn'>Shopping now</Link>
                </div>
            ) : (
                <>
                    <div className="order-header">
                        <h1 className="order-title">Tracking Order</h1>

                        <div className="order-filters">
                            <input
                                type="text"
                                placeholder="Search order code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">All</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipping">Shipping</option>
                                <option value="Delivered Successfully">Delivered</option>
                                <option value="Cancel">Canceled</option>
                            </select>
                        </div>
                    </div>
                    <div className="order-list">
                        {filteredOrders?.length > 0 ?
                            (filteredOrders.map((order, index) => (
                                < TrackingOrder key={index} order={order} />
                            ))
                            ) : (
                                <p className="no-orders">No order found</p>
                            )}
                    </div>
                </>
            )}
        </>
    )
}