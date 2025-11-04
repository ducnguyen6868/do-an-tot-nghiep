import { useState } from 'react';
import {
    Users,
    UserPlus, Shield, UserCheck, UserX, Clock, Mail, Phone, Lock, Search
} from 'lucide-react';

// Dữ liệu giả lập cho Khách hàng
const customersData = [
    {
        id: 101,
        name: 'James Rodriguez',
        email: 'james.r@example.com',
        phone: '090-123-4567',
        joined: '2024-05-15',
        status: 'Active',
        orders: 5,
        loyalty: 'Silver',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a81283c706d?w=30&h=30&fit=crop'
    },
    {
        id: 102,
        name: 'Maria Dupont',
        email: 'maria.d@example.com',
        phone: '091-234-5678',
        joined: '2023-11-01',
        status: 'Active',
        orders: 12,
        loyalty: 'Gold',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=30&h=30&fit=crop'
    },
    {
        id: 103,
        name: 'Chen Wei',
        email: 'chen.wei@example.com',
        phone: '092-345-6789',
        joined: '2025-01-20',
        status: 'Inactive',
        orders: 1,
        loyalty: 'Bronze',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=30&h=30&fit=crop'
    },
];

// Dữ liệu giả lập cho Admin/Staff
const staffData = [
    {
        id: 201,
        name: 'Elara Vance',
        email: 'elara.vance@timepiece.com',
        role: 'Super Admin',
        status: 'Active',
        lastLogin: '2025-10-28',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=30&h=30&fit=crop'
    },
    {
        id: 202,
        name: 'Ben Carter',
        email: 'ben.carter@timepiece.com',
        role: 'Order Manager',
        status: 'Active',
        lastLogin: '2025-10-27',
        avatar: 'https://images.unsplash.com/photo-1506794778202-dfa7995a52a7?w=30&h=30&fit=crop'
    },
    {
        id: 203,
        name: 'Mia Sol',
        email: 'mia.sol@timepiece.com',
        role: 'Promotion Specialist',
        status: 'Suspended',
        lastLogin: '2025-08-01',
        avatar: 'https://images.unsplash.com/photo-1508243771922-a9ae1b22e11a?w=30&h=30&fit=crop'
    },
];

// Màu thương hiệu (Teal/Xanh ngọc)
const BRAND_COLOR_CLASSES = 'bg-teal-500 hover:bg-teal-600 text-white';
const BRAND_TEXT_COLOR = 'text-teal-600 hover:text-teal-700';


// ************************************************
// Reusable Component: User Status Badge
// ************************************************
const UserStatusBadge = ({ status }) => {
    let classes = '';
    let Icon = null;

    if (status === 'Active') {
        classes = 'bg-green-100 text-green-700 border-green-300';
        Icon = UserCheck;
    } else if (status === 'Inactive') {
        classes = 'bg-gray-100 text-gray-700 border-gray-300';
        Icon = Clock;
    } else if (status === 'Suspended') {
        classes = 'bg-red-100 text-red-700 border-red-300';
        Icon = UserX;
    }

    return (
        <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${classes}`}>
            {Icon && <Icon className="w-3 h-3" />}
            <span>{status}</span>
        </span>
    );
};

// ************************************************
// Sub-Component: Customer List Table
// ************************************************
const CustomerList = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {['User ID', 'Customer Name', 'Contact', 'Joined Date', 'Total Orders', 'Loyalty Tier', 'Status', 'Actions'].map(header => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {customersData.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{customer.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="w-8 h-8 rounded-full object-cover mr-3" src={customer.avatar} alt={customer.name} />
                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className='flex items-center space-x-1'><Mail className='w-3 h-3 text-gray-400' /><span>{customer.email}</span></div>
                                <div className='flex items-center space-x-1'><Phone className='w-3 h-3 text-gray-400' /><span>{customer.phone}</span></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.joined}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600 font-bold">{customer.orders}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{customer.loyalty}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <UserStatusBadge status={customer.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button title="View Details" className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// ************************************************
// Sub-Component: Staff/Admin List Table
// ************************************************
const StaffList = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {['User ID', 'Staff Member', 'Role', 'Status', 'Last Login', 'Actions'].map(header => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {staffData.map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{staff.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="w-8 h-8 rounded-full object-cover mr-3 border border-teal-300" src={staff.avatar} alt={staff.name} />
                                    <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="font-semibold text-teal-600 mr-2">{staff.role === 'Super Admin' ? '⭐' : ''}</span>
                                {staff.role}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <UserStatusBadge status={staff.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.lastLogin}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button title="Edit Permissions" className="text-teal-600 hover:text-teal-800 p-1 rounded-full hover:bg-teal-50 transition-colors">
                                    <Shield className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// ************************************************
// Main Component: User Management Page
// ************************************************
export default function UserManagementPage() {
    const [activeTab, setActiveTab] = useState('customers'); // 'customers' hoặc 'staff'
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            {/* Tab Navigation */}
            <div className="flex justify-between items-center">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'customers'
                            ? `border-b-4 border-teal-500 ${BRAND_TEXT_COLOR}`
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Users className="w-5 h-5 inline mr-2" /> Customers ({customersData.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`px-4 py-2 text-lg font-semibold transition-colors ml-4 ${activeTab === 'staff'
                            ? `border-b-4 border-teal-500 ${BRAND_TEXT_COLOR}`
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Shield className="w-5 h-5 inline mr-2" /> Admin & Staff ({staffData.length})
                    </button>
                </div>
                <div className="relative flex flex-row gap-4 ">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        name='order'
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        placeholder="Search promotions..."
                        className="w-64 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-teal-500 bg-gray-50"
                    />
                    <button className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${BRAND_COLOR_CLASSES} shadow-md`}>
                        <UserPlus className="w-4 h-4" />
                        <span>{activeTab === 'customers' ? 'Add Customer' : 'Add Staff'}</span>
                    </button>
                </div>
            </div>


            {/* Tab Content */}
            <div className="pt-4" >
                {activeTab === 'customers' ? <CustomerList /> : <StaffList />}
            </div>

            {/* Pagination Placeholder (Dùng chung cho cả hai bảng) */}
            <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-white rounded-xl shadow-lg">
                <span className="text-sm text-gray-600">Showing 1 to 3 of {activeTab === 'customers' ? customersData.length : staffData.length} results</span>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">Previous</button>
                    <button className={`px-3 py-1 text-sm rounded-lg ${BRAND_COLOR_CLASSES}`}>1</button>
                    <button className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">Next</button>
                </div>
            </div>
        </>
    );
}