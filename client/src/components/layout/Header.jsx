import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { Search, User, ShoppingCart, Heart, Camera } from 'lucide-react';
import websiteLogo from '../../assets/website-logo.png'
import productApi from '../../api/productApi';
import Notification from '../common/Notification';

export default function Header() {
    // Mock user data for demo
    const { infoUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [logged, setLogged] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [scanning, setScanning] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const fileInputRef = useRef(null);

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        if (infoUser.name !== '') {
            setLogged(true);
        }
    }, [infoUser]);

    const handleSearch = async () => {
        if (keyword !== '') {
            navigate(`/search?keyword=${keyword}`);
        }
    }

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target.result);
                setScanning(true);

                setTimeout(() => {
                    setScanning(false);
                }, 2500);
            };
            reader.readAsDataURL(file);

            try {
                new Promise(resolve => setTimeout(resolve, 2500));
                const formData = new FormData();
                formData.append('image', file);
                const response = await productApi.postImgToSearch(formData);
                const products = response.products;
                navigate(`/search`, { state: { products } });
            } catch (err) {
                setType('error');
                setMessage(err.response?.data?.message || err.message);
                setShow(true);
            } finally {
                closeScanModal?.();
            }

        }

    };

    const closeScanModal = () => {
        setScanning(false);
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Notification show={show} message={message} type={type} onClose={() => setShow(false)} />
            {/* Header - Responsive */}
            <header className="sticky top-0 z-10 border-b bg-white shadow-sm transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3">
                    <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">

                        {/* Logo & Brand */}
                        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <img
                                className='w-6 sm:w-7 md:w-8'
                                src={websiteLogo}
                                title="Website Logo"
                                alt="Website Logo"
                            />
                            <span className="text-sm sm:text-lg md:text-xl font-extrabold tracking-wider sm:tracking-widest bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                TIMEPIECE
                            </span>
                        </Link>

                        {/* Search & Actions */}
                        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 md:gap-4">

                            {/* Search Bar */}
                            <div className="relative flex-1 max-w-xs sm:max-w-md md:max-w-2xl">
                                <Search
                                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 cursor-pointer"
                                    onClick={handleSearch}
                                />
                                <input
                                    type="text"
                                    placeholder="Search watches..."
                                    className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-1.5 sm:py-2 text-xs sm:text-sm border border-cyan-500 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                       transition-all placeholder:text-xs sm:placeholder:text-sm"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    name='image'
                                />
                                <Camera
                                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 cursor-pointer hover:text-cyan-500 transition-colors"
                                    onClick={handleCameraClick}
                                />
                            </div>

                            {/* User Actions */}
                            <div className="flex items-center gap-2 sm:gap-3">

                                {/* User Avatar / Login */}
                                <div className="relative group flex items-center">
                                    {logged ? (
                                        <Link to="/user/profile" className="block">
                                            <img
                                                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full shadow-sm hover:shadow-md transition-all duration-300 object-cover"
                                                src={`http://localhost:5000/${infoUser.avatar}` || infoUser.avatar}
                                                title='Avatar'
                                                alt='Avatar'
                                                loading='lazy'
                                            />
                                        </Link>
                                    ) : (
                                        <Link to="/login">
                                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                        </Link>
                                    )}
                                </div>

                                {/* Cart */}
                                <Link to="/cart" className="relative group">
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-cyan-500 transition-colors duration-300" />
                                    {infoUser.cart > 0 && (
                                        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 
                           bg-cyan-500 text-white text-[10px] sm:text-xs font-semibold 
                           rounded-full px-1 sm:px-1.5 flex items-center justify-center 
                           shadow-sm">
                                            {infoUser.cart}
                                        </span>
                                    )}
                                </Link>

                                {/* Wishlist */}
                                <Link to="/wishlist" className="relative group">
                                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-rose-500 transition-colors duration-300" />
                                    {infoUser.wishlist > 0 && (
                                        <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 
                           bg-cyan-500 text-white text-[10px] sm:text-xs font-semibold 
                           rounded-full px-1 sm:px-1.5 flex items-center justify-center 
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

            {/* Scan Modal - Responsive */}
            {uploadedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4"
                    onClick={() => closeScanModal()}
                >
                    <div className="relative bg-gray-100 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 max-w-xs sm:max-w-md md:max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Header */}
                        <div className="text-center mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                {scanning ? 'Scanning Image...' : ''}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                {scanning ? 'Analyzing your watch image' : ''}
                            </p>
                        </div>

                        {/* Image Container with Scan Effect */}
                        <div className="relative rounded-lg sm:rounded-xl overflow-hidden">
                            <img
                                src={uploadedImage}
                                alt="Uploaded watch"
                                className="w-full h-48 sm:h-56 md:h-64 object-contain bg-white"
                            />

                            {/* Scanning Line Effect */}
                            {scanning && (
                                <>
                                    {/* Animated scan line */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="absolute inset-x-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan"></div>
                                    </div>

                                    {/* Corner brackets - Responsive */}
                                    <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-t-2 border-l-2 border-cyan-500"></div>
                                    <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-t-2 border-r-2 border-cyan-500"></div>
                                    <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-b-2 border-l-2 border-cyan-500"></div>
                                    <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-b-2 border-r-2 border-cyan-500"></div>

                                    {/* Scanning grid overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
                                </>
                            )}
                        </div>

                        {/* Progress */}
                        {scanning && (
                            <div className="mt-3 sm:mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-progress"></div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

        </>
    );
}