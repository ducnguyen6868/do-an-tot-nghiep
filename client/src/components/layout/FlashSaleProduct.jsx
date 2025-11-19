import { useState, useEffect } from "react";
import { Flame, BadgePercent, ChevronsRight } from "lucide-react";
import { formatCurrency } from '../../utils/formatCurrency';
import { Link, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import productApi from "../../api/productApi";

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
                const limit = 5;
                const response = await productApi.getFlashSale(page, limit);
                let updatedProducts = response.flashsales;

                updatedProducts = updatedProducts.map(product => {
                    const detail = product.detail;
                    const sold = detail.reduce((t, d) => t + d.sold, 0);
                    const quantity = detail.reduce((t, d) => t + d.quantity, 0);
                    const percent = sold / quantity * 100;
                    return { ...product, percent, sold };
                });

                setFlashSaleProducts(updatedProducts);
            } catch (err) {
                console.log(err.response?.data?.message || err.message);
            }
        }
        getFlashSales();
    }, []);

    const handleNavigate = (slug) => {
        navigate(`/product/${slug}`);
    }

    return (
        <>
            {/* Flash Sale Products (RESPONSIVE VERSION) */}
            <section className="mx-4 rounded-xl py-6 bg-gradient-to-r from-red-500 to-orange-400 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    {/* Header Section */}
                    {/* Mobile: Stack dọc hoặc wrap. Desktop: Nằm ngang, căn 2 bên */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 text-white">

                        {/* Title & Timer Group */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-1">
                                <Icon icon="noto:fire" width="20" height="20" className="shrink-0" />
                                <span className='font-bold text-lg sm:text-xl whitespace-nowrap'>FLASH SALE</span>
                            </div>

                            {/* Timer Blocks */}
                            <div className="flex items-center gap-1 text-black">
                                {/* Hours */}
                                <span className="text-sm sm:text-base bg-gray-100 font-bold text-brand px-2 py-0.5 rounded shadow-sm">
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className="text-white font-bold">:</span>
                                {/* Minutes */}
                                <span className="text-sm sm:text-base bg-gray-100 font-bold text-brand px-2 py-0.5 rounded shadow-sm">
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-white font-bold">:</span>
                                {/* Seconds */}
                                <span className="text-sm sm:text-base bg-gray-100 font-bold text-brand px-2 py-0.5 rounded shadow-sm">
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        {/* View All Link */}
                        <Link to='#' className='flex items-center gap-1 text-sm sm:text-base font-medium hover:text-yellow-200 transition-colors self-end sm:self-auto'>
                            View all <ChevronsRight size={18} />
                        </Link>
                    </div>

                    {/* Product Grid */}
                    {/* Mobile: 2 cột, Tablet: 3 cột, Desktop: 4-5 cột */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                        {flashSaleProducts?.map((product, idx) => (
                            <div
                                key={product._id}
                                data-animate
                                className={`
                        bg-white cursor-pointer rounded-lg overflow-hidden shadow-xl border border-white/20 
                        transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                        flex flex-col h-full animate-fadeInUp
                    `}
                                style={{ animationDelay: `${idx * 0.1}s` }}
                                onClick={() => handleNavigate(product.slug)}
                            >
                                {/* Image Container */}
                                <div className="relative group overflow-hidden aspect-square bg-gray-50">
                                    {/* Discount Badge */}
                                    <span className="absolute top-0 right-0 z-10 flex items-center gap-0.5 text-white text-[10px] sm:text-xs font-bold px-2 py-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-bl-lg shadow-md">
                                        <BadgePercent size={12} />
                                        -{Math.ceil((1 - product.detail[0].flashSalePrice / product.detail[0].originalPrice) * 100)}%
                                    </span>

                                    <img
                                        src={`http://localhost:5000/${product?.images[0]}`}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://placehold.co/300x300/dc2626/ffffff?text=FLASH+SALE";
                                        }}
                                        loading='lazy'
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Flash Sale Ribbon (ẩn trên mobile quá nhỏ nếu cần thiết) */}
                                    <div className="absolute bottom-1 left-1 right-1">
                                        <span className="bg-orange-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] sm:text-xs flex items-center justify-center gap-1 shadow w-max">
                                            <Flame size={12} className="text-yellow-300 fill-yellow-300" />
                                            <span className="hidden xs:inline">Hot Deal</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Content Container */}
                                <div className="p-2 sm:p-3 flex flex-col flex-grow justify-end">
                                    {/* Price */}
                                    <div className="text-center mb-2">
                                        <div className="text-base sm:text-lg md:text-xl font-black text-red-600 leading-tight">
                                            {formatCurrency(product.detail[0]?.flashSalePrice, 'en-Us', 'USD')}
                                        </div>
                                        {/* Original Price (Optional - adds value) */}
                                        <div className="text-xs text-gray-400 line-through mt-0.5">
                                            {formatCurrency(product.detail[0]?.originalPrice, 'en-Us', 'USD')}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center transition-all duration-1000"
                                            style={{ width: `${product.percent}%` }}
                                        >
                                            {/* Fire icon inside bar - only show if wide enough */}
                                            {parseInt(product.percent) > 20 && (
                                                <Icon icon="noto:fire" width="10" height="10" className="hidden sm:block" />
                                            )}
                                        </div>

                                        {/* Sold Text Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <span className="text-[9px] sm:text-[10px] font-bold text-gray-800 uppercase drop-shadow-sm bg-white/40 px-1 rounded-sm backdrop-blur-[1px]">
                                                Sold <span className='text-red-700'>{product.sold}</span>
                                            </span>
                                        </div>
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