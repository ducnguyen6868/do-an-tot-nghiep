import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Heart, Camera } from 'lucide-react';
import websiteLogo from '../../assets/website-logo.png';

export default function Header() {
    const navigate = useNavigate();

    const { infoUser } = useContext(UserContext);
    const [logged, setLogged] = useState(false);

    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        if (infoUser.name !== '') {
            setLogged(true);
        }
    }, [infoUser]);

    const handleSearch = () => {
        if (keyword !== '') {
            navigate(`/search?keyword=${keyword}`);
        }
    }
    return (
        <>
            <header className="sticky top-0 z-50 border-b bg-white shadow-sm transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-6">

                        {/* Logo & Brand */}
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <img
                                src={websiteLogo}
                                alt="Logo"
                                className="w-7 h-7 object-contain"
                            />
                            <span className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                TIMEPIECE
                            </span>
                        </Link>

                        {/* Search & Actions */}
                        <div className="flex flex-1 items-center justify-end gap-4">

                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-2xl">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                                    onClick={()=>handleSearch()}
                                />
                                <input
                                    type="text"
                                    placeholder="Search watches, collections, promotions..."
                                    className="w-full pl-10 pr-12 py-2 text-sm border border-cyan-500 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                           transition-all"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Camera className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer hover:text-cyan-500 transition-colors" />
                            </div>

                            {/* User Actions */}
                            <div className="flex items-center gap-3">

                                {/* User Avatar / Login */}
                                <div className="relative group flex items-center">
                                    {logged ? (
                                        <Link to="/user/profile" className="block">
                                            <img
                                                src={`http://localhost:5000/${infoUser.avatar}`||infoUser.avatar}
                                                alt="User Avatar"
                                                className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 
                                 hover:border-cyan-500 shadow-sm hover:shadow-md 
                                 transition-all duration-300"
                                            />
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/login"
                                        >
                                            <User className="w-6 h-6 text-gray-600" />
                                        </Link>
                                    )}
                                </div>

                                {/* Cart */}
                                <Link to="/cart" className="relative group">
                                    <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-cyan-500 transition-colors duration-300" />
                                    {infoUser.cart > 0 && (
                                        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 
                                   bg-cyan-500 text-white text-xs font-semibold 
                                   rounded-full px-1.5 flex items-center justify-center 
                                   shadow-sm">
                                            {infoUser.cart}
                                        </span>
                                    )}
                                </Link>

                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative group">
                                    <Heart className="w-6 h-6 text-gray-600 group-hover:text-rose-500 transition-colors duration-300" />
                                    {infoUser.wishlist > 0 && (
                                        <span className="absolute -top-2 -right-2 min-w-[20px] h-5 
                                   bg-cyan-500 text-white text-xs font-semibold 
                                   rounded-full px-1.5 flex items-center justify-center 
                                   shadow-sm">
                                            {infoUser.wishlist}
                                        </span>
                                    )}
                                </Link>

                            </div>
                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}