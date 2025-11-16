
import { useState, useEffect, useContext } from 'react';
import {
    Heart, ShoppingCart, Bookmark, Award, Crown, Star
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';
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
                const limit = 3;
                const response = await productApi.getTrending(page, limit);
                const rank = [2, 1, 3];
                const updatedProducts = response.products.map((product, index) => {
                    return { ...product, rank: rank[index] }
                })
                setTrendingProducts(updatedProducts);
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
            id: product._id,
            code: product.code,
            name: product.name,
            image: product.images[0],
            description: product.description,
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
        switch (rank) {
            case 1: return <div className='relative mt-[-8px] ml-[-15px]'>
                <Bookmark fill='yellow' className=' w-24 h-24 text-white' />
                <div className='absolute inset-0 z-40 flex gap-1 justify-center mt-5'>
                    <Crown className="w-8 h-8 text-red-600" />                                            </div>
            </div>;
            case 2: return <div className='relative mt-[-6px] ml-[-12px]'>
                <Bookmark fill='gray' className=' w-20 h-20  text-white' />
                <div className='absolute inset-0 z-40 flex gap-1 justify-center mt-5'>
                    <Award className="w-6 h-6 text-white" />                                        </div>
            </div>;
            case 3: return <div className='relative mt-[-6px] ml-[-10px]'>
                <Bookmark fill='orange' className=' w-16 h-16  text-white' />
                <div className='absolute inset-0 z-40 flex gap-1 justify-center mt-5'>
                    <Star className="w-4 h-4 text-white" />
                </div>
            </div>;
            default: return null;
        }
    };

    return (
        <>
            {/* Trending Products */}
            <section className=" min-w-96 flex justify-center py-6 transition-colors duration-500" id='trending-container'>
                <div className="max-w-4xl mx-auto p-4 bg-gradient-to-r from-blue-500 to-violet-400 rounded-lg">
                    <div
                        id="trending-header"
                        data-animate
                        className={`text-center text-white mb-4 animate-fadeInUp visible`}
                    >
                        <h2 className="text-3xl font-bold mb-2">Our Best Seller</h2>
                        <p className="text-sm">Our top-selling timepieces, trusted by the TIMEPIECE community</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {trendingProducts.map((product, idx) => (
                            <div
                                key={product._id}
                                data-animate
                                className={`bg-bg-primary rounded-lg overflow-hidden border h-max
                                    border-border transition-all duration-300 transform 
                                    hover:translate-y-1 hover:shadow-xl animate-cardSlideInUp visible
                ${product.rank === 1 ? 'md:scale-110 md:mt-0' : 'md:mt-12'
                                    }`}
                            >

                                <div className="relative bg-bg-secondary overflow-hidden">
                                    <div className='absolute top-0 left-0 z-30'>
                                        {getRankTag(product.rank)}
                                    </div>
                                    <img
                                        src={`http://localhost:5000/${product?.images[0]}`}
                                        alt={product.name}
                                        loading='lazy'
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=Watch'; }}
                                        className="w-full aspect-square object-cover transform hover:scale-110 transition-transform duration-500 "
                            
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    />
                                    <button className="absolute top-2 right-2 w-7 h-7 bg-bg-primary rounded-full flex items-center justify-center shadow hover:bg-error hover:text-text-primary transition-all transform hover:scale-110 animate-badgeSlideIn"
                                        style={{ animationDelay: `${idx * 0.2}s` }}
                                        onClick={() => toggleWishlist(product.code)}
                                    >
                                        <Heart className="w-4 h-4 text-text-primary" />
                                    </button>
                                </div>
                                <div className="p-3">
                                    <Link to={`/product?code=${product.code}`} className="font-semibold text-sm mb-1 text-text-primary truncate animate-textSlideLeft translate-x-6"
                                        style={{ animationDelay: `${idx * 0.15}s` }}
                                    >{product.name}</Link>
                                    <p className="text-lg font-bold mb-3 text-brand animate-fadeInUp">{formatCurrency(product.detail[0]?.currentPrice, 'en-Us', 'USD')}</p>
                                    <div className='flex items-center justify-center gap-2'>
                                        <button
                                            className="py-1 px-4 bg-gray-400 text-white text-xs rounded transition-all transform hover:scale-[1.02] btn-brand shadow" onClick={() => handleCart(product)}
                                        >
                                            <ShoppingCart className='w-4' />
                                        </button>
                                        <button
                                            className="flex-1 py-2 bg-brand text-white text-xs rounded transition-all transform hover:scale-[1.02] btn-brand shadow" onClick={() => handleCheckout(product)}
                                        >
                                            Buy now
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