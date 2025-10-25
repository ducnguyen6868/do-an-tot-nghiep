import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import websiteLogo from '../../assets/website-logo.png';
import '../../styles/admin/Admin.css';
export default function Admin() {
    const [activeMenu, setActiveMenu] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const currentActiveMenu = location.state?.activeMenu || 'overview';
    useEffect(() => {
        setActiveMenu(currentActiveMenu);
    }, [currentActiveMenu]);

    const menuItems = [
        { id: 'overview', icon: '📊', label: 'Overview', badge: null },
        { id: 'products', icon: '📦', label: 'Products', badge: 342 },
        { id: 'orders', icon: '🛍️', label: 'Orders', badge: 15 },
        { id: 'customers', icon: '👥', label: 'Customers', badge: null },
        { id: 'analytics', icon: '📈', label: 'Analytics', badge: null },
        { id: 'reviews', icon: '⭐', label: 'Reviews', badge: 8 },
        { id: 'promotions', icon: '🎁', label: 'Promotions', badge: null },
        { id: 'inventory', icon: '📋', label: 'Inventory', badge: 3 },
        { id: 'support', icon: '💬', label: 'Customer Support', badge: 12 },
        { id: 'reports', icon: '📄', label: 'Reports', badge: null },
        { id: 'settings', icon: '⚙️', label: 'Settings', badge: null }
    ];
    const navigate = useNavigate();
    const handleNavigate = (activeMenu) => {
        setActiveMenu(activeMenu);
        navigate(`/admin/${activeMenu}`, { state: { activeMenu } });
    }
    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className='sidebar-header'>
                    <div className="logo-icon">
                        <img src={websiteLogo} style={{ width: '50px', height: 'auto' }} alt='Website Logo' title='Website Logo' />
                    </div>
                    {isSidebarOpen && (
                        <div className="logo-text" >
                            <div className="logo-title" style={{ fontSize: '1.2rem' }}>TIMEPIECE</div>
                            <div className="logo-subtitle" style={{ fontSize: '0.6rem' }}>Luxury Watches</div>
                        </div>
                    )}

                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item1 ${activeMenu === item.id ? 'active' : ''}`}
                            onClick={() => handleNavigate(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {isSidebarOpen && (
                                <>
                                    <span className="nav-label-dashboard">{item.label}</span>
                                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                                </>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-profile">
                        <div className="admin-avatar">👨‍💼</div>
                        {isSidebarOpen && (
                            <div className="admin-info">
                                <div className="admin-name">Admin User</div>
                                <div className="admin-role">Administrator</div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <header className="top-bar">
                    <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        ☰
                    </button>
                    <div className="search-bar-dashboard">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search orders, products, customers..."
                            className="search-input1"
                        />
                    </div>
                    <div className="top-bar-actions">
                        <button className="action-btn">🔔 <span className="notification-badge">5</span></button>
                        <button className="action-btn">✉️ <span className="notification-badge">12</span></button>
                        <button className="action-btn">⚙️</button>
                    </div>
                </header>

                <Outlet />
            </main>

        </div>
    )
}