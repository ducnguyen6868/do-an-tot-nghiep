import { useState } from 'react';
import {

    Edit2, Trash2, Plus, Filter, ChevronUp, ChevronDown, Eye , Search
} from 'lucide-react';

// Dữ liệu giả lập
const productsData = [
    {
        id: 'AQUA982',
        name: 'Aquamaster Pro Dive Watch',
        category: 'Diver',
        price: 982.00,
        stock: 55,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=50&h=50&fit=crop'
    },
    {
        id: 'CHRO809',
        name: 'Chronos Executive Chronograph',
        category: 'Chronograph',
        price: 1299.00,
        stock: 12,
        status: 'Low Stock',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=50&h=50&fit=crop'
    },
    {
        id: 'CEL752',
        name: 'Celestial Moonphase Automatic',
        category: 'Automatic',
        price: 2500.00,
        stock: 0,
        status: 'Out of Stock',
        image: 'https://images.unsplash.com/photo-1509941943102-10c232535736?w=50&h=50&fit=crop'
    },
    {
        id: 'SPAR715',
        name: 'Spartan Field Watch',
        category: 'Field',
        price: 715.00,
        stock: 204,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1587836374868-20c85c2d46cd?w=50&h=50&fit=crop'
    },
    {
        id: 'AURORA688',
        name: 'Aurora Smartwatch Luxe',
        category: 'Smartwatch',
        price: 499.00,
        stock: 8,
        status: 'Low Stock',
        image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=50&h=50&fit=crop'
    },
    {
        id: 'MERID652',
        name: 'Meridian Dress Watch',
        category: 'Dress',
        price: 652.00,
        stock: 150,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=50&h=50&fit=crop'
    },
];

// Màu thương hiệu (Teal/Xanh ngọc)
const BRAND_COLOR_CLASSES = 'bg-teal-500 hover:bg-teal-600 text-white';

// ************************************************
// Reusable Component: Status Badge (điều chỉnh cho Stock Status)
// ************************************************
const StockStatusBadge = ({ status }) => {
    let classes = '';
    let text = status;

    if (status === 'In Stock') {
        classes = 'bg-green-100 text-green-700';
    } else if (status === 'Low Stock') {
        classes = 'bg-yellow-100 text-yellow-700';
    } else if (status === 'Out of Stock') {
        classes = 'bg-red-100 text-red-700';
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
            {text}
        </span>
    );
};

// ************************************************
// Main Component: Product Management Page
// ************************************************
export default function ProductManagementPage() {
    const [products, setProducts] = useState(productsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState({ key: 'id', direction: 'asc' });

    const handleSort = (key) => {
        setSortBy(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedProducts = [...products]
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const aValue = a[sortBy.key];
            const bValue = b[sortBy.key];

            let comparison = 0;
            if (aValue > bValue) {
                comparison = 1;
            } else if (aValue < bValue) {
                comparison = -1;
            }

            return sortBy.direction === 'asc' ? comparison : comparison * -1;
        });

    // Hàm render icon sắp xếp
    const renderSortIcon = (key) => {
        if (sortBy.key !== key) return null;
        return sortBy.direction === 'asc'
            ? <ChevronUp className="w-4 h-4 ml-1" />
            : <ChevronDown className="w-4 h-4 ml-1" />;
    };

    return (
        <>

            {/* Actions and Filters Bar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-teal-600">All Products ({productsData.length})</h2>
                <div className="flex space-x-3">
                    <div className="relative hidden sm:block">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name='order'
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search products..."
                            className="w-64 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-teal-500 bg-gray-50"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${BRAND_COLOR_CLASSES} shadow-md`}>
                        <Plus className="w-4 h-4" />
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>

            {/* Product Table Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* Table Headers */}
                                {['ID', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(header => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort(header.toLowerCase().replace(/\s/g, ''))}
                                    >
                                        <div className="flex items-center">
                                            {header}
                                            {renderSortIcon(header.toLowerCase().replace(/\s/g, ''))}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedProducts.length > 0 ? (
                                sortedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 w-10 h-10">
                                                    <img className="w-10 h-10 rounded-lg object-cover border border-gray-200" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StockStatusBadge status={product.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button title="View" className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors">
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button title="Edit" className="text-teal-600 hover:text-teal-800 p-1 rounded-full hover:bg-teal-50 transition-colors">
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button title="Delete" className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-lg">
                                        No products found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-4 flex justify-between items-center border-t border-gray-200">
                    <span className="text-sm text-gray-600">Showing 1 to {sortedProducts.length} of {productsData.length} results</span>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">Previous</button>
                        <button className={`px-3 py-1 text-sm rounded-lg ${BRAND_COLOR_CLASSES}`}>1</button>
                        <button className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">2</button>
                        <button className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">Next</button>
                    </div>
                </div>
            </div>
        </>
    );
}