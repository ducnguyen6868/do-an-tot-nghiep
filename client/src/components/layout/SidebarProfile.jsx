import { Icon } from "@iconify/react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import '../../styles/SidebarProfile.css';

export default function SidebarProfile({ activeTab }) {
    const { setInfoUser } = useContext(UserContext);
    const [logoutModal, setLogoutModal] = useState(false);

    const [logout, setLogout] = useState(false);
    const navigate = useNavigate();

    const asideData = [
        { link: '/user/profile', icon: 'noto:identification-card', content: 'Personal Info', arrow: '→', activeTab: 'profile' },
        { link: '/user/point', icon: 'noto:coin', content: 'Points History', arrow: '→', activeTab: 'points' },
        { link: '#', icon: 'noto:wrapped-gift', content: 'My Vouchers', arrow: '→', activeTab: 'voucher' },
        { link: '/user/order', icon: 'noto:package', content: 'Order History', arrow: '→', activeTab: 'order' },
        { link: '/user/address', icon: 'noto:round-pushpin', content: 'Addresses', arrow: '→', activeTab: 'address' },
        { link: '#', icon: 'noto:speech-balloon', content: 'Support message', arrow: '→', activeTab: 'chat' },];


    const handleActiveTab = (item) => {
        navigate(`${item.link}`, { state: { activeTab: item.activeTab } })
    }
    //Confirm logout
    const confirmLogout = async () => {
        setLogout(true);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        let wishlist = localStorage.getItem('wishlist');
        wishlist = wishlist ? JSON.parse(wishlist) : [];
        await setInfoUser({
            name: '', email: '', avatar: '',
            cart: cart.length, wishlist: wishlist.length
        });
        setTimeout(() => navigate("/"), 500);
    }
    return (
        <>
            {/* Sidebar */}
            <aside className="sidebar-profile">
                <nav className="nav-menu-profile">
                    {asideData.map((item, index) => (
                        <button onClick={() => handleActiveTab(item)}
                            key={index}
                            className={`nav-button ${item.activeTab === activeTab ? 'active' : ''}`}
                        >
                            <span className="nav-icon">
                                <Icon icon={item.icon} width="30" height="30" />
                            </span>
                            <span className="nav-label">{item.content}</span>
                            <span className="nav-arrow">{item.arrow}</span>
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