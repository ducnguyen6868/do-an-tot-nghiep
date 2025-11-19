
import { useState, useEffect, useContext } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';
import { Icon } from '@iconify/react';
import productApi from '../../api/productApi';
import userApi from '../../api/userApi';

export default function TrendingProduct() {
    const navigate = useNavigate();

    const { setInfoUser } = useContext(UserContext);

    const [trendingProducts, setTrendingProducts] = useState([]);

    useEffect(() => {
        const getTrendingProducts = async () => {
            try {
                const page = 1;
                const limit = 4;
                const response = await productApi.getTrending(page, limit);
                setTrendingProducts(response.products);
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
            }
        }
        getTrendingProducts();
    }, []);

    const handleCheckout = (product) => {
        const id = product._id;
        const code = product.code;
        const name = product.name;
        const image = product.images[0];
        const description = product.description;
        const quantity = 1;
        const color = product.detail[0]?.color;
        const price = product.detail[0]?.currentPrice;
        const productData = [{
            id, code, name, image, description, quantity, color, price
        }]
        navigate('/product/checkout', { state: { productData } });
    }

    const handleCart = async (product) => {
        const detail = product.detail?.[0];
        if (!detail) return toast.error("Product detail not found!");

        const cartItem = {
            slug: product.slug,
            name: product.name,
            image: product.images[0],
            quantity: 1,
            color: detail.color,
            price: detail.currentPrice,
            index: 0
        };

        const token = localStorage.getItem("token");

        // Guest user
        if (!token) {
            let cartLocal = JSON.parse(localStorage.getItem("cart") || "[]");
            const exist = cartLocal.find(
                (i) => i.code === cartItem.code && i.color === cartItem.color
            );

            if (exist) {
                exist.quantity++;
                toast.info("Product quantity updated");
            } else {
                cartLocal.push(cartItem);
                toast.success("Added to cart 🛒");
            }

            localStorage.setItem("cart", JSON.stringify(cartLocal));
            setInfoUser((prev) => ({ ...prev, cart: cartLocal.length }));
            return;
        }

        try {
            const response = await userApi.addCart(cartItem);
            toast.success(response.message || "Added to cart!");
            setInfoUser((prev) => ({ ...prev, cart: response.cart }));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const toggleWishlist = async (code, isRemove = false) => {
        const token = localStorage.getItem("token");

        if (!token) {
            let wishlistLocal = JSON.parse(localStorage.getItem("wishlist") || "[]");
            const exists = wishlistLocal.some((item) => item.code === code);

            if (isRemove) {
                wishlistLocal = wishlistLocal.filter((i) => i.code !== code);
                toast.info("Removed from wishlist 💔");
            } else if (exists) {
                toast.warn("Already in wishlist");
                return;
            } else {
                wishlistLocal.push({ code });
                toast.success("Added to wishlist ❤️");
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlistLocal));
            setInfoUser((prev) => ({ ...prev, wishlist: wishlistLocal.length }));
            return;
        }

        try {
            const response = isRemove
                ? await userApi.removeWishlist(code)
                : await userApi.addWishlist(code, 0);
            toast.success(response.message);
            setInfoUser((prev) => ({ ...prev, wishlist: response.wishlist }));
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
            if (err.response?.status === 403) localStorage.removeItem("token");
        }
    };

    const getRankTag = (rank) => {
        // Định nghĩa size responsive cho từng breakpoint
        const sizes = {
            mobile: 20,      // < 640px
            sm: 24,          // >= 640px
            md: 32,          // >= 768px
            lg: 42,          // >= 1024px
        };

        // Sử dụng CSS class để responsive thay vì fixed size
        const MedalIcon = ({ icon }) => (
            <Icon
                icon={icon}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-[42px] xl:h-[42px]"
            />
        );

        switch (rank) {
            case 1:
                return <MedalIcon icon="noto:1st-place-medal" />;
            case 2:
                return <MedalIcon icon="noto:2nd-place-medal" />;
            case 3:
                return <MedalIcon icon="noto:3rd-place-medal" />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Trending Products - Single Row */}
            <section className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 transition-colors duration-500" id='trending-container'>
                <div className="w-full max-w-[95vw] mx-auto py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-r from-blue-500 to-violet-400 rounded-lg sm:rounded-xl">

                    {/* Header */}
                    <div
                        id="trending-header"
                        data-animate
                        className="text-center text-white mb-3 sm:mb-4 md:mb-6 animate-fadeInUp visible"
                    >
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1">Our Best Seller</h2>
                        <p className="text-[10px] sm:text-xs md:text-sm">Our top-selling timepieces, trusted by the TIMEPIECE community</p>
                    </div>

                    {/* Products Grid - Always 5 columns */}
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
                        {trendingProducts.map((product, idx) => (
                            <div
                                key={product._id}
                                data-animate
                                className="bg-bg-primary rounded-md sm:rounded-lg overflow-hidden border border-border 
                               transition-all duration-300 transform hover:-translate-y-1 
                               hover:shadow-xl animate-cardSlideInUp visible flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative bg-bg-secondary overflow-hidden group">
                                    {/* Rank Badge */}
                                    <div className='absolute top-0.5 sm:top-1 md:top-2 left-0 z-30 text-[8px] sm:text-[10px] md:text-xs'>
                                        {getRankTag(idx + 1)}
                                    </div>

                                    {/* Product Image */}
                                    <img
                                        src={`http://localhost:5000/${product?.images[0]}`}
                                        alt={product.name}
                                        loading='lazy'
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Watch';
                                        }}
                                        className="w-full aspect-square object-cover transform group-hover:scale-110 
                                       transition-transform duration-500"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    />

                                    {/* Wishlist Button */}
                                    <button
                                        className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 md:top-2 md:right-2 
                                       w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8
                                       bg-bg-primary rounded-full flex items-center justify-center 
                                       shadow hover:bg-error hover:text-text-primary 
                                       transition-all transform hover:scale-110 active:scale-95
                                       animate-badgeSlideIn opacity-0 group-hover:opacity-100"
                                        style={{ animationDelay: `${idx * 0.2}s` }}
                                        onClick={() => toggleWishlist(product.code)}
                                        aria-label="Add to wishlist"
                                    >
                                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="p-1.5 sm:p-2 md:p-3 flex flex-col flex-1">
                                    {/* Product Name */}
                                    <Link
                                        to={`/product/${product.slug}`}
                                        className="font-semibold text-[9px] sm:text-[10px] md:text-xs lg:text-sm 
                                       mb-1 text-text-primary line-clamp-1 hover:text-brand 
                                       transition-colors animate-textSlideLeft 
                                       min-h-[1.8rem] sm:min-h-[2rem] md:min-h-[2.5rem]"
                                        style={{ animationDelay: `${idx * 0.15}s` }}
                                        title={product.name}
                                    >
                                        {product.name}
                                    </Link>

                                    {/* Price */}
                                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold mb-1.5 sm:mb-2 text-brand animate-fadeInUp">
                                        {formatCurrency(product.detail[0]?.currentPrice, 'en-Us', 'USD')}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className='flex items-center justify-center gap-1 sm:gap-1.5 mt-auto'>
                                        {/* Add to Cart */}
                                        <button
                                            className="p-1 sm:p-1.5 md:py-1 md:px-2 bg-gray-400 text-white 
                                           rounded transition-all transform hover:scale-105 
                                           active:scale-95 btn-brand shadow flex items-center justify-center"
                                            onClick={() => handleCart(product)}
                                            aria-label="Add to cart"
                                        >
                                            <ShoppingCart className='w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4' />
                                        </button>

                                        {/* Buy Now */}
                                        <button
                                            className="flex-1 py-1 sm:py-1.5 md:py-2 bg-brand text-white 
                                           text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs 
                                           rounded transition-all transform hover:scale-105 active:scale-95 
                                           btn-brand shadow font-medium leading-tight"
                                            onClick={() => handleCheckout(product)}
                                        >
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>

    )
}