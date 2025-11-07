import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, Heart } from 'lucide-react';
import websiteLogo from '../../assets/website-logo.png';
import defaultImage from '../../assets/default-image.jpg';

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
            {/* Header */}
            <header
                className="border-b border-border sticky top-0 z-50 shadow-sm transition-colors duration-500 "
                style={{
                    backgroundColor: 'var(--header-bg, var(--bg-primary))', // Fallback to bg-primary
                    boxShadow: '0 1px 3px 0 var(--shadow-sm), 0 1px 2px -1px var(--shadow-sm)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between gap-12 ">
                        {/* Tên Công Ty và Slogan */}
                        <div className="flex flex-row gap-2 ">
                            <img className='w-7' src={websiteLogo} alt='Logo' title='Logo' />
                            <Link to='/'
                                className="text-xl font-extrabold tracking-widest"
                                style={{
                                    // Sử dụng linear-gradient tùy chỉnh của bạn
                                    background: 'linear-gradient(90deg, var(--brand-light, #3355ff), var(--brand-color, #00bcd4))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'drop-shadow(0 0 2px rgba(0, 188, 212, 0.4))'
                                }}
                            >
                                TIMEPIECE
                            </Link>
                        </div>

                        <div className="flex flex-1 items-center justify-end gap-2 space-x-3 animate-fadeInRight">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" onClick={() => handleSearch()} />
                                <input
                                    type="text"
                                    name='search'
                                    placeholder="Search watches , collections, promotions ,..."
                                    className="w-[600px] min-w-52 pl-9 pr-3 py-1.5 text-xs border border-solid border-brand rounded transition-all focus:outline-none"
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

                                />
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Avatar / User */}
                                <div className="relative group">
                                    {logged ? (
                                        <Link to='/user/profile' className="block w-9 h-9">
                                            <img
                                                src={`http://localhost:5000/${infoUser.avatar}`}
                                                onError={(e) => e.target.src = defaultImage}
                                                alt="User Avatar"
                                                className="h-9 rounded-full object-cover border border-gray-300 shadow-sm group-hover:shadow-md transition-all duration-300"
                                            />
                                        </Link>
                                    ) : (
                                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">
                                            <User className="w-5 h-5 text-text-secondary" />
                                        </div>
                                    )}
                                </div>

                                {/* Cart */}
                                <Link to='/cart' className="relative group cursor-pointer">
                                    <ShoppingCart className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors duration-300" />
                                    <span className="absolute -top-2 -right-2 bg-bg-secondary text-brand text-xs font-medium rounded-full px-1.5 py-0.5 shadow">
                                        {infoUser.cart}
                                    </span>
                                </Link>

                                {/* Wishlist */}
                                <Link to='/wishlist' className="relative group cursor-pointer">
                                    <Heart className="w-6 h-6 text-text-secondary group-hover:text-rose-500 transition-colors duration-300" />
                                    <span className="absolute -top-2 -right-2 bg-bg-secondary text-brand text-xs font-medium rounded-full px-1.5 py-0.5 shadow">
                                        {infoUser.wishlist}
                                    </span>
                                </Link>
                            </div>


                            {!logged && (
                                <>
                                    <Link to='/login' className="px-4 py-1.5 text-white text-xs rounded transition-all transform hover:scale-105 btn-brand"
                                        style={{ backgroundColor: 'var(--brand-color)' }}>
                                        Sign In
                                    </Link>

                                    <Link to='/register'
                                        className="px-4 py-1.5 border text-xs rounded transition-all transform hover:scale-105"
                                        style={{
                                            borderColor: 'var(--brand-color)',
                                            color: 'var(--brand-color)',
                                        }}
                                        onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--brand-color)'; e.target.style.color = 'white'; }}
                                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = 'var(--brand-color)'; }}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}