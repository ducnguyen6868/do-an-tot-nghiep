import { Icon } from "@iconify/react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import '../../styles/SidebarProfile.css';

export default function SidebarProfile({ activeTab }) {
    const { getInfoUser } = useContext(UserContext);
    const [logoutModal, setLogoutModal] = useState(false);

    const [logout, setLogout] = useState(false);
    const navigate = useNavigate();

    //Confirm logout
    const confirmLogout = async () => {
        setLogout(true);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        await getInfoUser();
        setTimeout(() => navigate("/"), 500);
    }
    return (
        <>
            {/* Sidebar */}
            <aside className="sidebar-profile">
                <nav className="nav-menu-profile">
                    <Link to='../profile' className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}  >
                        <span className="nav-icon"><Icon icon="noto:identification-card" width="30" height="30" /></span>
                        <span className="nav-label">Personal Info</span>
                        <span className="nav-arrow">→</span>
                    </Link>
                    <Link to="#" className={`nav-button ${activeTab === 'points' ? 'active' : ''}`}  >
                        <span className="nav-icon"><Icon icon="noto:coin" width="30" height="30" /></span>
                        <span className="nav-label">Points History</span>
                        <span className="nav-arrow">→</span>
                    </Link>
                    <Link to='#' className={`nav-button ${activeTab === 'vouchers' ? 'active' : ''}`}  >
                        <span className="nav-icon"><Icon icon="noto:wrapped-gift" width="30" height="30" /></span>
                        <span className="nav-label">My Vouchers</span>
                        <span className="nav-arrow">→</span>
                    </Link>
                    <Link to="#" className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`}  >
                        <span className="nav-icon"><Icon icon="noto:package" width="30" height="30" /></span>
                        <span className="nav-label">Order History</span>
                        <span className="nav-arrow">→</span>
                    </Link>
                    <Link to="/profile/address" className={`nav-button ${activeTab === 'address' ? 'active' : ''}`}  >
                        <span className="nav-icon"><Icon icon="noto:round-pushpin" width="30" height="30" /></span>
                        <span className="nav-label">Addresses</span>
                        <span className="nav-arrow">→</span>
                    </Link>
                    <Link tp='#' className={`nav-button ${activeTab === 'chats' ? 'active' : ''}`}  >
                        <span className="nav-icon"><Icon icon="noto:speech-balloon" width="30" height="30" /></span>
                        <span className="nav-label">Support message</span>
                        <span className="nav-arrow">→</span>
                    </Link>
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
                    <div className="modal-content " onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal">
                            <div className="goobye-icon">
                                <Icon icon="noto:waving-hand" width="50" height="50" />
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
            {logout && (
                <div className="modal-overlay" >
                    <div className="logout-modal">
                        <div className="logout-icon loggingout-icon">
                            <Icon icon="noto:rocket" width="80" height="80" />
                        </div>
                        <h3 className="logout-title loggingout-title">Logging out...</h3>
                    </div>
                </div>
            )
            }
        </>
    )

}