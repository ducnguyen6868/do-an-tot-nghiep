import {
    ShoppingCart, TrendingUp,
     DollarSign, Users, Tag, AlertTriangle,
    List
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Dữ liệu giả lập
const statsData = [
    { title: 'Total Sales', value: '$45,231.89', change: '+12.5%', isPositive: true, icon: DollarSign },
    { title: 'New Orders', value: '2,350', change: '+8% last week', isPositive: true, icon: ShoppingCart },
    { title: 'Active Promotions', value: '8', change: 'None last month', isPositive: false, icon: Tag },
    { title: 'Total Customers', value: '1,204', change: '+2.3% new sign ups', isPositive: true, icon: Users },
    { title: 'Low Stock Items', value: '14', change: 'Review inventory', isPositive: false, icon: List },
];

const recentOrders = [
    { id: 'ORD001', customer: 'Alicia Johnson', date: '2025-10-28', total: 250.00, status: 'Completed' },
    { id: 'ORD002', customer: 'Rob Smith', date: '2025-10-27', total: 89.50, status: 'Pending' },
    { id: 'ORD003', customer: 'Charlie Brown', date: '2025-10-26', total: 350.00, status: 'Completed' },
    { id: 'ORD004', customer: 'Diana Wong', date: '2025-10-25', total: 145.00, status: 'Cancelled' },
    { id: 'ORD005', customer: 'Michael Lee', date: '2025-10-24', total: 55.99, status: 'Completed' },
];

const topCustomers = [
    { name: 'Eleanor Vance', sales: 5490.50, status: 'VIP', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734bcae?w=50&h=50&fit=crop' },
    { name: 'Marcus Thorne', sales: 4890.00, status: 'Gold', avatar: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=50&h=50&fit=crop' },
    { name: 'Sophia Li', sales: 3870.00, status: 'Silver', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?w=50&h=50&fit=crop' },
    { name: 'David Chen', sales: 3100.00, status: 'Bronze', avatar: 'https://images.unsplash.com/photo-1506794778202-dfa6703828d0?w=50&h=50&fit=crop' },
];

const topSellingWatches = [
    { name: 'Aquamaster Pro Dive Watch', unitsSold: 982, image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=100&h=100&fit=crop' },
    { name: 'Chronos Executive Chronograph', unitsSold: 809, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop' },
    { name: 'Celestial Moonphase Automatic', unitsSold: 752, image: 'https://images.unsplash.com/photo-1509941943102-10c232535736?w=100&h=100&fit=crop' },
    { name: 'Spartan Field Watch', unitsSold: 715, image: 'https://images.unsplash.com/photo-1587836374868-20c85c2d46cd?w=100&h=100&fit=crop' },
    { name: 'Aurora Smartwatch Luxe', unitsSold: 688, image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=100&h=100&fit=crop' },
    { name: 'Meridian Dress Watch', unitsSold: 652, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=100&h=100&fit=crop' },
];

const adminAlerts = [
    { text: 'Server load is critically high, investigate immediately.', level: 'high' },
    { text: 'New customer support ticket requires attention.', level: 'medium' },
    { text: 'Inventory count mismatch for product X.', level: 'low' },
];

// Màu thương hiệu (Teal/Xanh ngọc)
const BRAND_COLOR_CLASSES = 'bg-teal-500 hover:bg-teal-600 text-white';
const BRAND_TEXT_COLOR = 'text-teal-600 hover:text-teal-700';


// ************************************************
// Reusable Component: Stat Card
// ************************************************
const StatCard = ({ title, value, change, isPositive, icon: Icon }) => {
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
    const changeBg = isPositive ? 'bg-green-100' : 'bg-red-100';

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className={`p-2 rounded-full ${BRAND_COLOR_CLASSES}`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${changeColor} ${changeBg}`}>
                <TrendingUp className={`w-3 h-3 mr-1 transform ${isPositive ? 'rotate-0' : 'rotate-180'}`} />
                {change}
            </div>
        </div>
    );
};

// ************************************************
// Reusable Component: Status Badge
// ************************************************
const StatusBadge = ({ status }) => {
    let classes = '';
    let text = status;

    if (status === 'Completed') {
        classes = 'bg-green-100 text-green-700';
    } else if (status === 'Pending') {
        classes = 'bg-yellow-100 text-yellow-700';
    } else if (status === 'Cancelled') {
        classes = 'bg-red-100 text-red-700';
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
            {text}
        </span>
    );
};


// ************************************************
// Main Component: Overview Dashboard
// ************************************************
export default function OverviewDashboard() {

    const getCustomerStatusClass = (status) => {
        if (status === 'VIP') return 'text-yellow-600 border-yellow-300 bg-yellow-50';
        if (status === 'Gold') return 'text-amber-600 border-amber-300 bg-amber-50';
        if (status === 'Silver') return 'text-gray-600 border-gray-300 bg-gray-50';
        return 'text-orange-600 border-orange-300 bg-orange-50';
    };

    return (
        <>
            {/* 1. Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {statsData.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* 2. Sales Overview (Placeholder for a Chart) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Sales Overview</h2>
                    <div className="flex space-x-2 text-sm">
                        {['Last 6 Months', 'Last 12 Months', 'All Time'].map(period => (
                            <button
                                key={period}
                                className={`px-3 py-1 rounded-full font-medium transition-colors ${period === 'Last 6 Months' ? BRAND_COLOR_CLASSES : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Biểu đồ giả lập - Sử dụng div placeholder */}
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    <span className="text-sm">Chart Placeholder (e.g., Line Chart)</span>
                </div>

                <p className="text-sm text-gray-600 mt-4 border-t border-gray-100 pt-3">
                    <TrendingUp className="w-4 h-4 inline mr-1 text-green-600" />
                    <span className="text-green-600 font-semibold">+24.00% increase</span> compared to previous period.
                </p>
            </div>

            {/* 3. Recent Orders & Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                        <Link to="#" className={`text-sm font-medium ${BRAND_TEXT_COLOR}`}>View All</Link>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3 w-1/4 min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 truncate">{order.id}</div>
                                </div>
                                <div className="text-sm text-gray-600 w-1/4 min-w-0 truncate">{order.customer}</div>
                                <div className="text-sm text-gray-600 w-1/4 hidden sm:block">{order.date}</div>
                                <div className="text-right w-1/4">
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Customers */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Top Customers</h2>
                    <div className="space-y-4">
                        {topCustomers.map(customer => (
                            <div key={customer.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                                        <p className={`text-xs font-medium border rounded-full px-2 py-0.5 ${getCustomerStatusClass(customer.status)}`}>
                                            {customer.status}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-900">${customer.sales.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Top-Selling Watches & Promotions/Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Top-Selling Watches */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Top-Selling Watches</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {topSellingWatches.map(watch => (
                            <div key={watch.name} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <img src={watch.image} alt={watch.name} className="w-20 h-20 object-cover rounded-lg mb-2 border border-gray-300" />
                                <p className="text-sm font-medium text-gray-900 truncate w-full px-1">{watch.name}</p>
                                <span className="text-xs text-gray-600 mt-1">{watch.unitsSold} units sold</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promotions & Admin Alerts Column */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Promotions & Loyalty */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                            <h2 className="text-xl font-bold text-gray-900">Promotions & Loyalty</h2>
                            <button className={`text-xs px-3 py-1.5 rounded-full font-medium ${BRAND_COLOR_CLASSES}`}>
                                Create New Promo
                            </button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="border border-teal-300 bg-teal-50 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-teal-700">Summer Sale</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-200 text-teal-800 font-semibold">Active</span>
                                </div>
                                <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1 text-xs">
                                    <li>Up to 30% off on selected items</li>
                                    <li>27% redemption rate</li>
                                </ul>
                            </div>
                            <div className="border border-blue-300 bg-blue-50 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-blue-700">New Customer Welcome</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 font-semibold">Active</span>
                                </div>
                                <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1 text-xs">
                                    <li>10% off first order for new sign-ups</li>
                                    <li>High conversion rate</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Admin Alerts */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Admin Alerts</h2>
                        <div className="space-y-3">
                            {adminAlerts.map((alert, index) => {
                                let iconColor = 'text-red-500';
                                let bgColor = 'bg-red-50';
                                let borderColor = 'border-red-300';
                                if (alert.level === 'medium') {
                                    iconColor = 'text-yellow-500';
                                    bgColor = 'bg-yellow-50';
                                    borderColor = 'border-yellow-300';
                                } else if (alert.level === 'low') {
                                    iconColor = 'text-blue-500';
                                    bgColor = 'bg-blue-50';
                                    borderColor = 'border-blue-300';
                                }

                                return (
                                    <div key={index} className={`flex items-start p-3 rounded-lg border ${bgColor} ${borderColor}`}>
                                        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
                                        <p className="text-xs text-gray-800 ml-3">{alert.text}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}