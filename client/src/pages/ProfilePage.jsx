import { useState } from 'react';
import '../styles/ProfilePage.css';
import { Icon } from '@iconify/react';
import PasswordChangeModal from '../components/comon/PasswordChangeModal';
import SidebarProfile from '../components/layout/SidebarProfile';
import HeaderProfile from '../components/layout/HeaderProfile';
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

// Mock points history
const pointsHistory = [
    { id: 1, type: 'purchase', description: 'Purchase Order #ORD-001', points: 250, date: '2025-10-02', status: 'earned' },
    { id: 2, type: 'checkin', description: 'Daily Check-in', points: 10, date: '2025-10-02', status: 'earned' },
    { id: 3, type: 'checkin', description: 'Daily Check-in', points: 10, date: '2025-10-01', status: 'earned' },
    { id: 4, type: 'purchase', description: 'Purchase Order #ORD-002', points: 330, date: '2025-09-28', status: 'earned' },
    { id: 5, type: 'redeem', description: 'Redeemed 10% discount voucher', points: -500, date: '2025-09-25', status: 'spent' },
    { id: 6, type: 'bonus', description: 'Birthday bonus points', points: 100, date: '2025-09-20', status: 'earned' }
];

// Mock vouchers
const vouchers = [
    { id: 1, code: 'SAVE10', title: '10% OFF', description: 'Get 10% off on all products', discount: '10%', minSpend: 1000, expiryDate: '2025-11-30', status: 'active' },
    { id: 2, code: 'FREESHIP', title: 'Free Shipping', description: 'Free shipping on orders over $50', discount: 'Free Ship', minSpend: 50, expiryDate: '2025-10-31', status: 'active' },
    { id: 3, code: 'LUXURY20', title: '20% OFF Luxury', description: 'Save 20% on luxury watches', discount: '20%', minSpend: 2000, expiryDate: '2025-12-15', status: 'active' },
    { id: 4, code: 'SUMMER25', title: '25% OFF Summer Sale', description: 'Huge summer discount', discount: '25%', minSpend: 1500, expiryDate: '2025-08-30', status: 'used' }
];

// Mock order history
const orderHistory = [
    { id: '#ORD-001', date: '2025-10-02', total: 2499, status: 'delivered', items: 1, product: 'Classic Elegance Watch', image: 'https://via.placeholder.com/80x80/1a1a2e/ffd700?text=Watch' },
    { id: '#ORD-002', date: '2025-09-28', total: 3299, status: 'shipping', items: 1, product: 'Sport Chronograph', image: 'https://via.placeholder.com/80x80/1a1a2e/60a5fa?text=Watch' },
    { id: '#ORD-003', date: '2025-09-15', total: 5999, status: 'delivered', items: 1, product: 'Diamond Lady Watch', image: 'https://via.placeholder.com/80x80/1a1a2e/ff6b9d?text=Watch' }
];


// Mock support messages
const supportMessages = [
    { id: 1, sender: 'customer', message: 'Hi, I would like to know more about the Classic Elegance Watch warranty?', time: '2025-10-02 10:30 AM', product: 'Classic Elegance Watch' },
    { id: 2, sender: 'seller', message: 'Hello! The Classic Elegance Watch comes with a 2-year international warranty covering manufacturing defects.', time: '2025-10-02 10:35 AM', product: 'Classic Elegance Watch' },
    { id: 3, sender: 'customer', message: 'Does it cover water damage?', time: '2025-10-02 10:40 AM', product: 'Classic Elegance Watch' },
    { id: 4, sender: 'seller', message: 'The watch is water-resistant up to 10 ATM (100m). Normal water exposure is covered, but swimming and diving are not recommended. Water damage from improper use is not covered by warranty.', time: '2025-10-02 10:42 AM', product: 'Classic Elegance Watch' },
    { id: 5, sender: 'customer', message: 'Thank you for the information!', time: '2025-10-02 10:45 AM', product: 'Classic Elegance Watch' },
    { id: 6, sender: 'seller', message: 'You are welcome! Feel free to ask if you have any other questions. 😊', time: '2025-10-02 10:46 AM', product: 'Classic Elegance Watch' }
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');

    const [messageInput, setMessageInput] = useState('');
    const [isPasswordChangeModal, setIsPasswordChangeModal] = useState(false);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            alert(`Message sent: ${messageInput}`);
            setMessageInput('');
        }
    };


    return (
        <div className="profile-page">
            <HeaderProfile />
            {/* Main Content */}
            <div className="main-section">
                <div className="container">
                    <div className="content-layout">
                        {/* Sidebar */}
                        <SidebarProfile activeTab='profile' />

                        {/* Content Area */}
                        <main className="content-area">
                            {/* Personal Info */}
                            {activeTab === 'profile' && (
                                <div className="tab-content">
                                    <h2 className="content-title">Personal Information</h2>
                                    <div className="info-grid">
                                        <div className="info-card">
                                            <div className="info-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 128 128" ><path fill="#0b2eb8ff" d="M115.1 120v4H12.9v-4c0-15.7 19.9-23.3 42-24.9V94c-9.3-2.8-17.6-9.8-21.7-21.3c-4.2-1.5-6.6-15.3-5.5-17.1C26.9 49.8 21.4 4.3 64 4c42.5.2 37.1 45.6 36.2 51.5c1.1 1.8-1.3 15.6-5.5 17.1c-4 11.5-12.3 18.6-21.6 21.4v1c22.2 1.8 42 10.2 42 25"></path></svg>
                                            </div>
                                            <div className="info-details">
                                                <div className="info-label">Full Name</div>
                                                <div className="info-value">{userData.name}</div>
                                            </div>
                                            <button className="edit-btn">Edit</button>
                                        </div>
                                        <div className="info-card">
                                            <div className="info-icon">
                                                <Icon icon="noto:incoming-envelope" width="30" height="30" />
                                            </div>
                                            <div className="info-details">
                                                <div className="info-label">Email Address</div>
                                                <div className="info-value">{userData.email}</div>
                                            </div>
                                            <button className="edit-btn">Edit</button>
                                        </div>
                                        <div className="info-card">
                                            <div className="info-icon">
                                                <Icon icon="noto:mobile-phone" width="30" height="30" />
                                            </div>
                                            <div className="info-details">
                                                <div className="info-label">Phone Number</div>
                                                <div className="info-value">{userData.phone}</div>
                                            </div>
                                            <button className="edit-btn">Edit</button>
                                        </div>
                                    </div>
                                    <div className="security-section">
                                        <h3 className="section-subtitle">
                                            <span style={{ marginRight: "10px" }}>Security Settings</span>
                                            <Icon icon="noto:gear" width="30" height="30" />
                                        </h3>
                                        <div className='security-box'>
                                            <button className="action-button primary" onClick={() => setIsPasswordChangeModal(true)}>
                                            <span style={{ marginRight: "10px" }}>Change Password</span>
                                            <Icon icon="noto:key" width="24" height="24" />
                                        </button>
                                        <button className="action-button secondary">
                                            <span style={{ marginRight: "10px" }}>Enable Two-Factor Authentication</span>
                                            <Icon icon="noto:shield" width="24" height="24" />
                                        </button>
                                        </div>
                                    </div>
                                </div>)}

                            {/* Points History */}
                            {activeTab === 'points' && (
                                <div className="tab-content">
                                    <div className="content-header">
                                        <h2 className="content-title">Points History</h2>
                                        <div className="summary-cards">
                                            <div className="summary-card earned">
                                                <span className="summary-label">Total Earned</span>
                                                <span className="summary-value">+{pointsHistory.filter(p => p.status === 'earned').reduce((sum, p) => sum + p.points, 0)}</span>
                                            </div>
                                            <div className="summary-card spent">
                                                <span className="summary-label">Total Spent</span>
                                                <span className="summary-value">{pointsHistory.filter(p => p.status === 'spent').reduce((sum, p) => sum + p.points, 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timeline">
                                        {pointsHistory.map(item => (
                                            <div key={item.id} className="timeline-item">
                                                <div className="timeline-dot"></div>
                                                <div className="timeline-card">
                                                    <div className="timeline-header">
                                                        <span className="timeline-icon">
                                                            {item.type === 'purchase' ? '🛍️' : item.type === 'checkin' ? '📅' : item.type === 'redeem' ? '🎁' : '🎉'}
                                                        </span>
                                                        <span className={`timeline-points ${item.status}`}>
                                                            {item.points > 0 ? '+' : ''}{item.points}
                                                        </span>
                                                    </div>
                                                    <div className="timeline-body">
                                                        <div className="timeline-title">{item.description}</div>
                                                        <div className="timeline-date">{new Date(item.date).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Vouchers */}
                            {activeTab === 'vouchers' && (
                                <div className="tab-content">
                                    <h2 className="content-title">My Vouchers</h2>
                                    <div className="vouchers-container">
                                        {vouchers.map(voucher => (
                                            <div key={voucher.id} className={`voucher-item ${voucher.status}`}>
                                                <div className="voucher-left">
                                                    <div className="voucher-discount-big">{voucher.discount}</div>
                                                    <div className="voucher-off">OFF</div>
                                                </div>
                                                <div className="voucher-middle">
                                                    <div className="voucher-title">{voucher.title}</div>
                                                    <div className="voucher-desc">{voucher.description}</div>
                                                    <div className="voucher-meta">
                                                        <span className="voucher-code">Code: <strong>{voucher.code}</strong></span>
                                                        <span className="voucher-min">Min: ${voucher.minSpend}</span>
                                                    </div>
                                                </div>
                                                <div className="voucher-right">
                                                    <div className="voucher-status-badge">{voucher.status}</div>
                                                    <div className="voucher-expiry">Exp: {new Date(voucher.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                                    {voucher.status === 'active' && (
                                                        <button className="use-btn">Use Now</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Orders */}
                            {activeTab === 'orders' && (
                                <div className="tab-content">
                                    <h2 className="content-title">Order History</h2>
                                    <div className="orders-container">
                                        {orderHistory.map(order => (
                                            <div key={order.id} className="order-item">
                                                <div className="order-image">
                                                    <img src={order.image} alt={order.product} />
                                                </div>
                                                <div className="order-details">
                                                    <div className="order-header">
                                                        <span className="order-id">{order.id}</span>
                                                        <span className={`order-badge ${order.status}`}>{order.status}</span>
                                                    </div>
                                                    <div className="order-product-name">{order.product}</div>
                                                    <div className="order-meta">
                                                        <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                                                        <span className="order-items">{order.items} item(s)</span>
                                                    </div>
                                                </div>
                                                <div className="order-right">
                                                    <div className="order-price">${order.total.toLocaleString()}</div>
                                                    <div className="order-actions">
                                                        <button className="order-btn">View Details</button>
                                                        {order.status === 'delivered' && (
                                                            <button className="order-btn secondary">Buy Again</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Support Messages */}
                            {activeTab === 'support' && (
                                <div className="tab-content">
                                    <h2 className="content-title">Support Messages</h2>
                                    <div className="chat-container">
                                        <div className="chat-header">
                                            <div className="chat-product-info">
                                                <span className="chat-product-icon">📦</span>
                                                <div>
                                                    <div className="chat-product-name">Classic Elegance Watch</div>
                                                    <div className="chat-status">
                                                        <span className="status-dot"></span>
                                                        Support team is online
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat-messages">
                                            {supportMessages.map(msg => (
                                                <div key={msg.id} className={`chat-message ${msg.sender}`}>
                                                    <div className="message-avatar">
                                                        {msg.sender === 'customer' ? '👤' : '🛍️'}
                                                    </div>
                                                    <div className="message-content">
                                                        <div className="message-bubble">
                                                            {msg.message}
                                                        </div>
                                                        <div className="message-time">{msg.time}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="chat-input-container">
                                            <input
                                                type="text"
                                                className="chat-input"
                                                placeholder="Type your message..."
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            />
                                            <button className="send-btn" onClick={handleSendMessage}>
                                                <span>Send</span>
                                                <span className="send-icon">📤</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            {isPasswordChangeModal && <PasswordChangeModal onClose={()=>{setIsPasswordChangeModal(false)}}/>}

        </div>
    );

}