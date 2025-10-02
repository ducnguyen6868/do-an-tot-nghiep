import { useState } from 'react';
import '../css/AdminDashboard.css';

// Mock data for dashboard
const dashboardStats = {
  totalRevenue: 245680,
  totalOrders: 1243,
  totalCustomers: 8456,
  totalProducts: 342,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  productsGrowth: 5.7
};

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', product: 'Classic Elegance Watch', amount: 2499, status: 'completed', date: '2025-10-02' },
  { id: '#ORD-002', customer: 'Sarah Johnson', product: 'Sport Chronograph', amount: 3299, status: 'pending', date: '2025-10-02' },
  { id: '#ORD-003', customer: 'Mike Brown', product: 'Diamond Lady Watch', amount: 5999, status: 'processing', date: '2025-10-01' },
  { id: '#ORD-004', customer: 'Emily Davis', product: 'Minimalist Watch', amount: 1899, status: 'completed', date: '2025-10-01' },
  { id: '#ORD-005', customer: 'Robert Wilson', product: 'Pilot Navigator', amount: 4299, status: 'cancelled', date: '2025-09-30' }
];

const topProducts = [
  { name: 'Classic Elegance', sales: 245, revenue: 612255, trend: 'up' },
  { name: 'Sport Chronograph', sales: 189, revenue: 623511, trend: 'up' },
  { name: 'Diamond Lady', sales: 156, revenue: 935844, trend: 'up' },
  { name: 'Minimalist Watch', sales: 342, revenue: 649458, trend: 'down' },
  { name: 'Pilot Navigator', sales: 98, revenue: 421302, trend: 'up' }
];

const recentActivity = [
  { type: 'order', message: 'New order #ORD-001 from John Doe', time: '5 minutes ago', icon: '🛍️' },
  { type: 'user', message: 'New user registration: Sarah Johnson', time: '12 minutes ago', icon: '👤' },
  { type: 'product', message: 'Product "Classic Elegance" stock low (5 units)', time: '25 minutes ago', icon: '⚠️' },
  { type: 'review', message: 'New 5-star review on Sport Chronograph', time: '1 hour ago', icon: '⭐' },
  { type: 'order', message: 'Order #ORD-002 shipped', time: '2 hours ago', icon: '📦' }
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#4ade80';
      case 'processing': return '#fbbf24';
      case 'pending': return '#60a5fa';
      case 'cancelled': return '#ff4757';
      default: return '#999';
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⌚</span>
            {isSidebarOpen && <span className="logo-text">TIMEPIECE</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item1 ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && (
                <>
                  <span className="nav-label">{item.label}</span>
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
          <div className="search-bar">
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

        {/* Overview Content */}
        {activeMenu === 'overview' && (
          <div className="overview-content">
            {/* Page Title */}
            <div className="page-header">
              <h1 className="page-title">Dashboard Overview</h1>
              <div className="date-range">
                <select className="date-select">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>This year</option>
                </select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card revenue">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">${dashboardStats.totalRevenue.toLocaleString()}</div>
                  <div className="stat-growth positive">
                    ↑ {dashboardStats.revenueGrowth}% from last month
                  </div>
                </div>
              </div>

              <div className="stat-card orders">
                <div className="stat-icon">🛍️</div>
                <div className="stat-info">
                  <div className="stat-label">Total Orders</div>
                  <div className="stat-value">{dashboardStats.totalOrders.toLocaleString()}</div>
                  <div className="stat-growth positive">
                    ↑ {dashboardStats.ordersGrowth}% from last month
                  </div>
                </div>
              </div>

              <div className="stat-card customers">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-label">Total Customers</div>
                  <div className="stat-value">{dashboardStats.totalCustomers.toLocaleString()}</div>
                  <div className="stat-growth positive">
                    ↑ {dashboardStats.customersGrowth}% from last month
                  </div>
                </div>
              </div>

              <div className="stat-card products">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-label">Total Products</div>
                  <div className="stat-value">{dashboardStats.totalProducts.toLocaleString()}</div>
                  <div className="stat-growth positive">
                    ↑ {dashboardStats.productsGrowth}% from last month
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              {/* Revenue Chart */}
              <div className="content-card chart-card">
                <div className="card-header">
                  <h3>Revenue Analytics</h3>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="legend-dot revenue-dot"></span> Revenue</span>
                    <span className="legend-item"><span className="legend-dot orders-dot"></span> Orders</span>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="bar-chart">
                    <div className="chart-bars">
                      <div className="bar-group">
                        <div className="bar revenue-bar" style={{ height: '60%' }}></div>
                        <div className="bar orders-bar" style={{ height: '45%' }}></div>
                        <div className="bar-label">Jan</div>
                      </div>
                      <div className="bar-group">
                        <div className="bar revenue-bar" style={{ height: '75%' }}></div>
                        <div className="bar orders-bar" style={{ height: '60%' }}></div>
                        <div className="bar-label">Feb</div>
                      </div>
                      <div className="bar-group">
                        <div className="bar revenue-bar" style={{ height: '55%' }}></div>
                        <div className="bar orders-bar" style={{ height: '50%' }}></div>
                        <div className="bar-label">Mar</div>
                      </div>
                      <div className="bar-group">
                        <div className="bar revenue-bar" style={{ height: '85%' }}></div>
                        <div className="bar orders-bar" style={{ height: '70%' }}></div>
                        <div className="bar-label">Apr</div>
                      </div>
                      <div className="bar-group">
                        <div className="bar revenue-bar" style={{ height: '70%' }}></div>
                        <div className="bar orders-bar" style={{ height: '65%' }}></div>
                        <div className="bar-label">May</div>
                      </div>
                      <div className="bar-group">
                        <div className="bar revenue-bar" style={{ height: '90%' }}></div>
                        <div className="bar orders-bar" style={{ height: '80%' }}></div>
                        <div className="bar-label">Jun</div>
                      </div>
                      <div className="bar-group">
                        <div className="bar revenue-bar" style={{ height: '95%' }}></div>
                        <div className="bar orders-bar" style={{ height: '85%' }}></div>
                        <div className="bar-label">Jul</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Distribution Pie Chart */}
              <div className="content-card chart-card">
                <div className="card-header">
                  <h3>Sales by Category</h3>
                  <button className="export-btn">📥 Export</button>
                </div>
                <div className="chart-container">
                  <div className="pie-chart">
                    <div className="pie-slice luxury" style={{ '--percentage': '35%' }}>
                      <div className="pie-label">Luxury<br/>35%</div>
                    </div>
                    <div className="pie-slice sport" style={{ '--percentage': '30%' }}>
                      <div className="pie-label">Sport<br/>30%</div>
                    </div>
                    <div className="pie-slice casual" style={{ '--percentage': '25%' }}>
                      <div className="pie-label">Casual<br/>25%</div>
                    </div>
                    <div className="pie-slice smart" style={{ '--percentage': '10%' }}>
                      <div className="pie-label">Smart<br/>10%</div>
                    </div>
                  </div>
                  <div className="pie-legend">
                    <div className="pie-legend-item">
                      <span className="legend-color luxury-color"></span>
                      <span>Luxury Watches (35%)</span>
                    </div>
                    <div className="pie-legend-item">
                      <span className="legend-color sport-color"></span>
                      <span>Sport Watches (30%)</span>
                    </div>
                    <div className="pie-legend-item">
                      <span className="legend-color casual-color"></span>
                      <span>Casual Watches (25%)</span>
                    </div>
                    <div className="pie-legend-item">
                      <span className="legend-color smart-color"></span>
                      <span>Smart Watches (10%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic & Conversion Chart */}
            <div className="content-card traffic-card">
              <div className="card-header">
                <h3>Website Traffic & Conversion Rate</h3>
                <div className="time-range-tabs">
                  <button className="time-tab active">Day</button>
                  <button className="time-tab">Week</button>
                  <button className="time-tab">Month</button>
                </div>
              </div>
              <div className="chart-container">
                <div className="line-chart">
                  <div className="chart-grid">
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                  </div>
                  <svg className="line-svg" viewBox="0 0 700 200">
                    {/* Traffic Line */}
                    <path 
                      d="M 0 150 Q 100 100 200 120 T 400 80 T 600 60 L 700 50" 
                      fill="none" 
                      stroke="#667eea" 
                      strokeWidth="3"
                    />
                    {/* Conversion Line */}
                    <path 
                      d="M 0 180 Q 100 160 200 150 T 400 130 T 600 110 L 700 100" 
                      fill="none" 
                      stroke="#ffd700" 
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="chart-labels">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="stat-box">
                    <div className="stat-dot traffic-dot"></div>
                    <div className="stat-details">
                      <div className="stat-number">24,568</div>
                      <div className="stat-text">Total Visitors</div>
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-dot conversion-dot"></div>
                    <div className="stat-details">
                      <div className="stat-number">3.8%</div>
                      <div className="stat-text">Conversion Rate</div>
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-dot bounce-dot"></div>
                    <div className="stat-details">
                      <div className="stat-number">42.3%</div>
                      <div className="stat-text">Bounce Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Tables Row */}
            <div className="content-row">
              {/* Recent Orders */}
              <div className="content-card orders-card">
                <div className="card-header">
                  <h3>Recent Orders</h3>
                  <button className="view-all-btn">View All →</button>
                </div>
                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td className="order-id">{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.product}</td>
                          <td className="amount">${order.amount.toLocaleString()}</td>
                          <td>
                            <span className="status-badge" style={{ background: getStatusColor(order.status) }}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button className="table-action-btn">👁️</button>
                            <button className="table-action-btn">✏️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="content-card activity-card">
                <div className="card-header">
                  <h3>Recent Activity</h3>
                  <button className="filter-btn">Filter</button>
                </div>
                <div className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">{activity.icon}</div>
                      <div className="activity-content">
                        <div className="activity-message">{activity.message}</div>
                        <div className="activity-time">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="content-card top-products-card">
              <div className="card-header">
                <h3>Top Selling Products</h3>
                <select className="period-select">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>This month</option>
                  <option>This year</option>
                </select>
              </div>
              <div className="products-grid">
                {topProducts.map((product, index) => (
                  <div key={index} className="product-row">
                    <div className="product-rank">{index + 1}</div>
                    <div className="product-details">
                      <div className="product-name">{product.name}</div>
                      <div className="product-stats">
                        <span>{product.sales} sales</span>
                        <span className="separator">•</span>
                        <span>${product.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={`product-trend ${product.trend}`}>
                      {product.trend === 'up' ? '↑' : '↓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button className="quick-action-btn primary">
                <span className="btn-icon">➕</span>
                Add New Product
              </button>
              <button className="quick-action-btn">
                <span className="btn-icon">🎁</span>
                Create Promotion
              </button>
              <button className="quick-action-btn">
                <span className="btn-icon">📊</span>
                Generate Report
              </button>
              <button className="quick-action-btn">
                <span className="btn-icon">📧</span>
                Send Newsletter
              </button>
            </div>
          </div>
        )}

        {/* Placeholder for other sections */}
        {activeMenu !== 'overview' && (
          <div className="placeholder-content">
            <div className="placeholder-icon">{menuItems.find(m => m.id === activeMenu)?.icon}</div>
            <h2>{menuItems.find(m => m.id === activeMenu)?.label}</h2>
            <p>This section is under development. Full functionality coming soon!</p>
          </div>
        )}
      </main>

    </div>
  );
}