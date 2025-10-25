import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronRight, XCircle, } from "lucide-react";
import { formatDate } from '../../utils/formatDate';
import {toast} from 'react-toastify';
import orderApi from '../../api/orderApi';
import "../../styles/OrderStatusTracker.css";

export default function OrderStatusTracker({ order , onClose, onChange }) {
    const [orderStatus, setOrderStatus] = useState('');
    const statusPresent = order?.status?.at(-1).present;
    useEffect(() => {
        setOrderStatus(statusPresent);
    }, [statusPresent]);
    let statuses = [
        {
            id: "Order Placed",
            label: "Order Placed",
            icon: CheckCircle,
            description: "Customer order successfully.",
        },
        {
            id: "Processing",
            label: "Processing",
            icon: Package,
            description: "Preparing customer items.",
        },
        {
            id: "Shipping",
            label: "Shipping",
            icon: Truck,
            description: "On the way to customer",
        },
        {
            id: "Delivered Successfully",
            label: "Delivered",
            icon: MapPin,
            description: "Order completed",
        },
        {
            id: "canceled",
            label: "Canceled",
            icon: XCircle,
            description: "Order has been canceled",
        },
    ];

    statuses = statuses.map((item, index) => (
        {
            ...item, time: order?.status[index]?.time || ''
        }
    ));

    const statusIndex = statuses.findIndex((s) => s.id === orderStatus);
    const isCanceled = orderStatus === "Canceled";

    const handleSubmitStatus=async ()=>{
        const orderId = order._id;
        const status = statuses[statusIndex+1].id;
        try{
            const response = await orderApi.changeStatus(orderId,status);
            toast.success(response.message);
            onChange?.();
        }catch(err){
            toast.error(err.response?.data?.message||err.message);
        }finally{
            onClose?.();
        }
    }
    return (
        <>
            {/* Main */}
            <div className="tracker-content">
                {isCanceled ? (
                    <div className="canceled-box">
                        <div className="cancel-icon-wrap">
                            <div className="cancel-icon-bg">
                                <XCircle size={64} color="#f50404ff" />
                            </div>
                            <div className="cancel-ping"></div>
                        </div>
                        <h3>Order Canceled</h3>
                        <p>This order has been canceled</p>
                    </div>
                ) : (
                    <div className='tracker-status'>
                        {statuses.slice(0, 4).map((status, index) => {
                            const Icon = status.icon;
                            const isActive = index === statusIndex;
                            const isCompleted = index < statusIndex;
                            const isUpcoming = index > statusIndex;

                            return (
                                <div key={status.id} className="status-step">
                                    <div
                                        className={`status-row ${isActive ? "status-active" : ""
                                            }`}
                                    >
                                        <div className="status-icon-wrap">
                                            <div className={`status-info ${isUpcoming ? 'hidden' : ''}`}>

                                                <p className='status-desc'>
                                                    {status.description}
                                                </p>
                                                <div className="status-time">
                                                    <div
                                                        className={`dot-order ${isCompleted
                                                            ? "dot-green"
                                                            : isActive
                                                                ? "dot-cyan"
                                                                : ""
                                                            }`}
                                                    ></div>
                                                    <p className="time-text">{formatDate(status.time)}</p>
                                                </div>
                                            </div>
                                            <div
                                                className={`status-icon ${isCompleted
                                                    ? "completed"
                                                    : isActive
                                                        ? "active"
                                                        : "upcoming"
                                                    }`}
                                            >
                                                <Icon
                                                    size={32}
                                                    className={`${isUpcoming ? "icon-gray" : "icon-white"
                                                        }`}
                                                />
                                                {isActive && <div className="icon-pulse"></div>}
                                                {index < 3 && (
                                                    <div
                                                        className={`status-line ${index < statusIndex ? "line-active" : ""
                                                            }`}
                                                    ></div>
                                                )}
                                                {isCompleted && (
                                                    <div className="icon-check">
                                                        <CheckCircle size={18} color="#10b981" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="status-header">
                                                <h3
                                                    className={`${isUpcoming ? "text-gray" : "text-dark"
                                                        }`}
                                                >
                                                    {status.label}
                                                </h3>
                                                {isActive && (
                                                    <span className="status-badge">
                                                        <Clock size={14} /> In Progress
                                                    </span>
                                                )}
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Buttons */}
                <div className="controls">
                    {!isCanceled && (
                        <button
                            onClick={() => handleSubmitStatus()}
                            className='control-btn'
                        >
                            {statuses[statusIndex + 1].label}

                            <ChevronRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

