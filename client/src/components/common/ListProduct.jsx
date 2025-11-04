import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { UserContext } from "../../contexts/UserContext";
import useProductsPerRow from "../../hooks/useProductsPerRow";
import userApi from "../../api/userApi";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ListProduct({ search, products, wishlist, onChange }) {
  const { setInfoUser, locale, currency } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination
  let itemsPerPage = useProductsPerRow();
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const renderStars = (rating) => "⭐".repeat(Math.floor(rating || 0));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
      price: detail.price,
      detailId: detail._id,
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
      onChange?.();
      return;
    }

    try {
      const response = isRemove
        ? await userApi.removeWishlist(code)
        : await userApi.addWishlist(code, 0);
      toast.success(response.message);
      setInfoUser((prev) => ({ ...prev, wishlist: response.wishlist }));
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      if (err.response?.status === 403) localStorage.removeItem("token");
    }
  };

  return (
    <div className="w-full space-y-10">
      {/* Product Grid */}
      <motion.div
        layout
        className={(search || wishlist) ? 'grid grid-cols-3 gap-4' : 'grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '}
      >
        <AnimatePresence>
          {currentProducts.map((product) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group hover:shadow-lg transition min-w-64"
            >
              <div className="relative overflow-hidden">
                <img
                  src={`http://localhost:5000${product.images[0]}`}
                  alt={product.name}
                  loading="lazy"
                  className="object-cover w-full aspect-square group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-row flex-wrap items-center justify-center gap-3 bg-black/40 opacity-0 group-hover:opacity-100 transition">
                  <Link
                    to={`/product?code=${product.code}`}
                    className="bg-white text-gray-900 text-sm px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-200 transition"
                  >
                    👁️ Quick View
                  </Link>
                  <button
                    className="text-white bg-teal-600 p-2 rounded-full hover:bg-teal-500 transition"
                    onClick={() => toggleWishlist(product.code, wishlist)}
                  >
                    {wishlist ? (
                      <Icon icon="noto:broken-heart" width="20" height="20" />
                    ) : (
                      "❤️"
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-gray-900 dark:text-gray-100 font-semibold truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-2 flex items-center text-yellow-500 text-sm">
                  <span>{renderStars(product.ratings)}</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">
                    {formatCurrency(
                      product.detail?.[0]?.price,
                      locale,
                      currency
                    ) || "N/A"}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-sm bg-teal-600 text-white px-3 py-1.5 rounded-md hover:bg-teal-500 transition"
                    onClick={() => handleCart(product)}
                  >
                    🛒 Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pb-4">
          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-teal-500 hover:text-white transition disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft size={18} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 rounded-full font-medium text-sm transition ${currentPage === index + 1
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-teal-500 hover:text-white"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-teal-500 hover:text-white transition disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
