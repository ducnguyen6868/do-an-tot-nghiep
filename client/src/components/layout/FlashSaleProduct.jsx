import { useState, useEffect } from "react";
import productApi from "../../api/productApi";
import { formatCurrency } from '../../utils/formatCurrency';
import { Link ,useNavigate} from "react-router-dom";

export default function FlashSale() {
    const navigate = useNavigate();

    const [flashSaleProducts, setFlashSaleProducts] = useState([]);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Countdown timer for flash sale
    useEffect(() => {
        if (flashSaleProducts?.length === 0) return;
        const timer = setInterval(() => {
            if (flashSaleProducts?.length > 0) {
                const endTime = new Date(flashSaleProducts[0].flashSaleEnd);
                const now = new Date();
                const diff = endTime - now;

                if (diff > 0) {
                    setTimeLeft({
                        hours: Math.floor(diff / (1000 * 60 * 60)),
                        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((diff % (1000 * 60)) / 1000)
                    });
                } else {
                    setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [flashSaleProducts]);

    useEffect(() => {
        const getFlashSales = async () => {
            try {
                const page = 1;
                const limit = 4;
                const response = await productApi.getFlashsale(page, limit);
                setFlashSaleProducts(response.flashsales);
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
            }
        }
        getFlashSales();
    }, []);

    const handleCheckout = (product) => {
        const id = product._id;
        const code = product.code;
        const name = product.name;
        const image = product.images[0];
        const description = product.description;
        const quantity = 1;
        const color = product.detail[0]?.color;
        const price = product.detail[0]?.price;
        const detailId = product.detail[0]?._id;
        const productData = [{
            id, code, name, image, description, quantity, color, price, detailId
        }]
        navigate('/product/checkout',{state:{productData}});
    }
    return (
        <>

            {/* Flash Sale Products (NEW SECTION) */}
            <section className="py-6 bg-bg-secondary transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4">
                    <div
                        id="flash-header"
                        data-animate
                        className={`text-center mb-10 animate-fadeInUp visible' : ''}`}
                    >
                        <h2 className="text-3xl font-extrabold mb-2 text-text-primary flex items-center justify-center space-x-3">
                            <span className="text-sale-color animate-pulse-slow">🔥</span>
                            <span>Flash Sale - Limited Time!</span>
                            <span className="text-sale-color animate-pulse-slow">🔥</span>
                        </h2>
                        <p className="text-text-secondary text-sm">Grab these luxury watches before the timer runs out!</p>

                        {/* Countdown Timer */}
                        <div className='mt-5 flex justify-center'>
                            <div className='px-6 py-3 rounded-full font-mono text-xl font-black shadow-2xl transition-all text-white bg-red-600'
                            >
                                <div className="flex items-center justify-center space-x-2 font-mono">
                                    <span className="text-xl font-semibold text-white tracking-wide uppercase">
                                        ENDS IN:
                                    </span>

                                    <div className="flex items-center space-x-1.5">
                                        {/* Hours */}
                                        <div className=" border border-blue-500/30 bg-bg-secondary rounded-md flex items-center justify-center shadow-sm">
                                            <div className="text-xl font-bold text-brand p-1">{String(timeLeft.hours).padStart(2, '0')}</div>
                                        </div>

                                        <span className="text-xl font-semibold bg-bg-secondary/70">:</span>

                                        {/* Minutes */}
                                        <div className=" border border-blue-500/30 bg-bg-secondary rounded-md flex items-center justify-center shadow-sm">
                                            <div className="text-xl font-bold text-brand p-1">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                        </div>

                                        <span className="text-xl font-semibold bg-bg-secondary/70">:</span>

                                        {/* Seconds */}
                                        <div className=" border border-blue-500/30 bg-bg-secondary rounded-md flex items-center justify-center shadow-sm">
                                            <div className="text-xl font-bold text-brand p-1">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-center items-center gap-6">
                        {flashSaleProducts?.map((product, idx) => (
                            <div
                                key={product._id}
                                data-animate
                                className={`bg-white rounded-xl max-w-80 overflow-hidden shadow-2xl border border-sale-color/30 transform transition-all duration-500 hover:scale-[1.02] animate-fadeInUp visible`}
                                style={{ animationDelay: `${idx * 0.15 + 0.3}s` }}
                            >
                                <div className="relative bg-bg-tertiary overflow-hidden">
                                    {/* Sale Tag */}
                                    <span className="absolute top-2 left-2 bg-sale-color text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                                    </span>
                                    <img
                                        src={`http://localhost:5000${product?.images[0]}`}
                                        alt={product.name}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/dc2626/ffffff?text=FLASH+SALE'; }}
                                        className="w-full aspect-square object-cover transform hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 flex flex-col items-center text-center">
                                    <Link to={`/product?code=${product.code}`} className="cursor-pointer text-base font-medium tracking-wide text-gray-800 dark:text-gray-100 
hover:text-brand transition-all duration-500 line-clamp-1 text-center italic">
                                        {product.name}
                                    </Link>                                    <div className="mb-4">
                                        <p className="text-sm   text-red-600 line-through">{formatCurrency(product.detail[0]?.originalPrice, 'en-Us', 'USD')}</p>
                                        <p className="text-3xl font-black   text-red-600">{formatCurrency(product.detail[0]?.price, 'en-Us', 'USD')}</p>
                                    </div>
                                    <button
                                        className="w-full py-3 text-white text-sm rounded-md transition-all transform hover:scale-[1.03] shadow-lg font-semibold bg-red-600" onClick={()=>handleCheckout}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}