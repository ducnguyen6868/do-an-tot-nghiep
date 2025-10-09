import { Icon } from "@iconify/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import '../../styles/SidebarProfile.css';

export default function SidebarProfile() {
    const { getInfoUser } = useContext(UserContext);

    const [activeTab, setActiveTab] = useState();
    const [logoutModal, setLogoutModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    //Confirm logout
    const confirmLogout = async () => {
        setIsLoading(true);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        await getInfoUser();
        setTimeout(() =>navigate("/") , 500);
    }
    return (
        <>
            {/* Sidebar */}
            <aside className="sidebar-profile">
                <nav className="nav-menu-profile">
                    {[
                        { id: 'profile', icon: <Icon icon="noto:identification-card" width="30" height="30" />, label: 'Personal Info' },
                        { id: 'points', icon: <Icon icon="noto:coin" width="30" height="30" />, label: 'Points History' },
                        { id: 'vouchers', icon: <Icon icon="noto:wrapped-gift" width="30" height="30" />, label: 'My Vouchers' },
                        { id: 'orders', icon: <Icon icon="noto:package" width="30" height="30" />, label: 'Order History' },
                        { id: 'addresses', icon: <Icon icon="noto:round-pushpin" width="30" height="30" />, label: 'Addresses' },
                        { id: 'support', icon: <Icon icon="noto:speech-balloon" width="30" height="30" />, label: 'Support message' }
                    ].map(item => (
                        <button
                            key={item.id}
                            className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            <span className="nav-arrow">→</span>
                        </button>
                    ))}
                    <button className="nav-button logout" onClick={() => setLogoutModal(true)}>
                        <span className="nav-icon">
                            <Icon icon="noto:door" width="30" height="30" />
                        </span>
                        <span className="nav-label">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Logout Confirmation Modal */}
            {logoutModal && (
                <div className="modal-overlay" onClick={() => setLogoutModal(false)}>
                    <div className="modal-content logout-modal-content " onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal">
                            <div className="logout-icon">
                                <div className="logout-icon-circle">
                                    <Icon icon="noto:waving-hand" width="50" height="50" />
                                </div>
                            </div>
                            <h3 className="logout-title">Logout Confirmation</h3>
                            <p className="logout-message">Are you sure you want to logout? You will need to login again to access your account.</p>
                            <div className="logout-stats">
                                <div className="logout-stat-item">
                                    <span className="stat-icon">
                                        <Icon icon="noto:treasure-chest" width="30" height="30" />
                                    </span>
                                    <div className="stat-info">
                                        <div className="stat-value">9,000</div>
                                        <div className="stat-label">Points Balance</div>
                                    </div>
                                </div>
                                <div className="logout-stat-item">
                                    <span className="stat-icon">
                                        <Icon icon="noto:fire" width="30" height="30" />
                                    </span>
                                    <div className="stat-info">
                                        <div className="stat-value">7 Days</div>
                                        <div className="stat-label">Check-in Streak</div>
                                    </div>
                                </div>
                            </div>
                            <div className="logout-actions">
                                <button className="logout-cancel-btn" onClick={() => setLogoutModal(false)}>
                                    Cancel
                                </button>
                                <button className="logout-confirm-btn" onClick={confirmLogout}>
                                    <span>Yes, Logout</span>
                                    <span className="logout-arrow">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* {Loadding effect} */}
            {isLoading && (
                <div className="modal-overlay" >
                    <div className="modal-content logout-modal-content loggingout-modal-content" >
                        <div className="logout-modal">
                            <div className="logout-icon">
                                <div className="logout-icon-circle loggingout-icon">
                                    <Icon icon="noto:rocket" width="80" height="80" />
                                </div>
                            </div>
                            <h3 className="logout-title loggingout-title">Logging out...</h3>

                        </div>
                    </div>
                </div>
            )
            }
        </>
    )

}