import { useState , useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Icon } from '@iconify/react';
import '../../styles/HeaderProfile.css';

// Mock user data
const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    avatar: null,
    memberSince: '2024-01-15',
    totalPoints: 2450,
    level: 'Gold',
    checkInStreak: 3,
    checkInDays: [true, true, true, false, false, false, false] // 7 days tracking
};


export default function HeaderProfile() {
    const {infoUser} = useContext(UserContext);

    const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
    const [showCheckInModal, setShowCheckInModal] = useState(false);

    const checkInRewards = [200, 200, 200, 200, 200, 200, 500];
    const nextDayReward = checkInRewards[userData.checkInStreak] || 200;

    
    const handleCheckIn = () => {
        if (!hasCheckedInToday) {
            setShowCheckInModal(true);
            setHasCheckedInToday(true);
        }
    };
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
                                    <img className="avatar-profile" src={`http://localhost:5000/` + infoUser.avatar} alt="avatar" title="avatar" />
                                    <div className="avatar-ring"></div>
                                </div>
                                <div className="level-badge">{userData.level} Member</div>
                            </div>
                            <div className="user-details">
                                <h1 className="user-name">{infoUser.name}</h1>
                                <p className="user-email">{infoUser.email}</p>
                                <div className="user-meta">
                                    <span className="meta-item">
                                        <Icon icon="noto:spiral-calendar" width="30" height="30" />
                                        Member since {new Date(userData.memberSince).getFullYear()}
                                    </span>
                                    <span className="meta-item">
                                        <Icon icon="noto:fire" width="30" height="30" />
                                        {userData.checkInStreak} day streak
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
                                                {userData.totalPoints.toLocaleString()}
                                            </span>
                                        </span>
                                        <span className="points-text">Rewards Points</span>

                                    </div>
                                </div>
                            </div>
                            <button
                                className={`checkin-button ${hasCheckedInToday ? 'checked' : ''}`}
                                onClick={handleCheckIn}
                                disabled={hasCheckedInToday}
                            >
                                {hasCheckedInToday ? '✓ Checked In Today' : `📅 Daily Check-in (+${nextDayReward} pts)`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Check-in Modal */}
            {showCheckInModal && (
                <div className="modal-overlay" onClick={() => setShowCheckInModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowCheckInModal(false)}>✕</button>
                        <div className="checkin-modal">
                            <h3 className="checkin-success-title">
                                <span style={{ marginRight: "8px" }}>Check-in Successful!</span>
                                <Icon icon="noto:party-popper" width="50" height="50" />
                            </h3>
                            <div className="checkin-points-earned">+{nextDayReward} Points</div>
                            <div className="checkin-calendar">
                                {checkInRewards.map((points, index) => (
                                    <div key={index} className={`checkin-day ${index < userData.checkInStreak ? 'completed' : index === userData.checkInStreak ? 'today' : ''}`}>
                                        <div className="day-number">Day {index + 1}</div>
                                        <div className="day-icon">{index < userData.checkInStreak ? '✓' : index === userData.checkInStreak ? '⭐' : '○'}</div>
                                        <div className="day-points">{points} pts</div>
                                    </div>
                                ))}
                            </div>
                            <div className="checkin-streak-info">
                                <span className="streak-text">Current Streak: {userData.checkInStreak} days</span>
                                <span className="streak-next">Next: {checkInRewards[userData.checkInStreak + 1] || 'Complete!'} pts</span>
                            </div>
                            <button className="modal-btn" onClick={() => setShowCheckInModal(false)}>Got it!</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}