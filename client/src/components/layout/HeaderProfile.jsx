import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import CheckInModal from '../comon/CheckInModal';
import profileApi from '../../api/profileApi';
import pointApi from '../../api/pointApi';
import avatarDefault from '../../assets/avatar-default.png';
import '../../styles/HeaderProfile.css';


export default function HeaderProfile() {
    const [user, setUser] = useState({});
    const [showCheckInModal, setShowCheckInModal] = useState(false);

    const getUser = async () => {
        try {
            const response = await profileApi.profile();
            setUser(response.user);
        } catch (err) {
            toast.err(err.response?.data?.message || err.message);
        }
    }
    useEffect(() => {
        getUser();
    }, []);

    const handleCheckIn = async () => {
        if (!user.checkIn) {
            setShowCheckInModal(true);
            try {
                await pointApi.patch(user._id);
                getUser();
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        }
    };
    const point = user.point;
    return (
        <>
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-bg"></div>
                <div className="container">
                    <div className="profile-card">
                        <div className="profile-left">
                            <div className="avatar-section">
                                <div className="avatar">
                                    <img onError={(e)=>e.target.src=avatarDefault} className="avatar-profile" src={`http://localhost:5000/` + user.avatar} alt="avatar" title="avatar" />
                                    <div className="avatar-rotate"></div>
                                </div>
                                <div className="level-badge">Gold Member</div>
                            </div>
                            <div className="user-details">
                                <h1 className="user-name">{user.name}</h1>
                                <p className="user-email">{user.email}</p>
                                <div className="user-meta">
                                    <span className="meta-item">
                                        <Icon icon="noto:spiral-calendar" width="30" height="30" />
                                        Member since {new Date(user.createdAt).getMonth()}/{new Date(user.createdAt).getFullYear()}
                                    </span>
                                    <span className="meta-item">
                                        <Icon icon="noto:fire" width="30" height="30" />
                                        {point?.streak} day streak
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="profile-right">
                            <div className="points-display">
                                <div className="points-info">
                                    <div className="points-box">
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                            <Icon icon="noto:treasure-chest" width="55" height="55" />
                                            <span className="points-number">
                                                {user.point?.quantity}
                                            </span>
                                        </span>
                                        <span className="points-text">Points</span>

                                    </div>
                                </div>
                            </div>
                            <button
                                className={`checkin-button ${user.checkIn ? 'checked' : ''}`}
                                onClick={handleCheckIn}
                                disabled={user.checkIn}
                            >
                                {user.checkIn ? '✓ Checked In Today' : `📅 Daily Check-in (+${user.point?.table[user.point.streak]} pts)`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Check-in Modal */}
            {showCheckInModal && (
                <div className="modal-overlay" onClick={() => setShowCheckInModal(false)}>
                    <div className="checkin-modal" onClick={(e) => e.stopPropagation()}>
                        <CheckInModal point={point} onClose={() => setShowCheckInModal(false)} />
                    </div>
                </div>
            )}
        </>
    )
}