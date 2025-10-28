import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import profileApi from "../api/profileApi";
import { Star } from "lucide-react";
import '../styles/PointPage.css';

export default function PointPage() {
    const [point, setPoint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPoint = async () => {
            try {
                setLoading(true);
                const response = await profileApi.profile();
                setPoint(response.point);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        }
        getPoint();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) return <div className="loading">Loading points...</div>;
    if (!point) return <div className="error">No point data found.</div>;

    return (
        <div className="point-page-container">
            <div className="point-header">
                <h3 className="history-title">
                    <Icon icon="mdi:history" width="36" height="36" />
                    <span style={{ color: 'var(--brand-color)' }}>Point History</span>
                </h3>
                <div className="total-points">
                    <Icon icon='noto:coin' width="20" height="20" />
                    <span>{point.quantity ?? 0} pts</span>
                </div>
            </div>

            <div className="point-history">
                {point.history?.length > 0 ? (
                    point.history
                        .slice()
                        .reverse()
                        .map((item, index) => (
                            <div key={index} className="history-item">
                                <div className="history-left">
                                    <div className="icon-box">
                                        <Star fill="#00bcd4" stroke="none" size={18} />
                                    </div>
                                    <div className="history-text">
                                        <span className="history-action">{item.action}</span>
                                        <span className="history-time">
                                            {formatDate(item.time)} • {formatTime(item.time)}
                                        </span>
                                    </div>
                                </div>
                                {item.point > 0 ? (
                                    <div className="history-point">+ {item.point.toFixed(2)}</div>
                                ) : (
                                    <div className="history-point minus-points" style={{color:'#ff3030ff'}}>- {item.point.toFixed(2)*(-1)}</div>
                                )}
                            </div>
                        ))
                ) : (
                    <p className="no-history">No check-in history yet.</p>
                )}
            </div>
        </div>
    );
};

