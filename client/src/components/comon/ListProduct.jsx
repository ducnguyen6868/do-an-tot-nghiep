import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatCurrency } from '../../utils/formatCurrency';
import userApi from '../../api/userApi';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import useProductsPerRow from '../../hooks/useProductsPerRow';
import '../../styles/ListProduct.css';

export default function ListProduct({ products }) {

  const { setInfoUser } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);

  // Pagination
  const itemsPerPage = useProductsPerRow();
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCart = async (product) => {
    try {
      const id = product._id;
      const code = product.code;
      const name = product.name;
      const image = product.images[0];
      const description = product.description;
      const quantity = 1;
      const color = product.detail[0]?.color;
      const price = product.detail[0]?.price;
      const detailId = product.detail[0]?._id;
      const data = {
        id, code, name, image, description, quantity, color, price ,detailId
      }
      const response = await userApi.addCart(data);
      toast.success(response.message);
      setInfoUser(prev => ({ ...prev, cart: response.cart }));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  };
  return (
    <>
      <div className='product-grid'>
        {currentProducts.map(product => (
          <div key={product._id} className="product-card" >
            <div className="product-image">
              <img src={`http://localhost:5000` + product.images[0]} loading="lazy" alt={product.name} />
              <div className="product-overlay">
                <Link to={`/product?code=${product.code}`} className="quick-view-btn">👁️ Quick View</Link>
                <button className="wishlist-btn">❤️</button>
              </div>
            </div>
            <div className="product-details">
              <div className="product-brand">{product.brand?.name || 'N/A'}</div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-rating">
                <span className="stars"> {renderStars(product.ratings)} {product.ratings}</span>
                <span className="reviews">({product.reviewCount} reviews)</span>
              </div>
              <div className="product-footer">
                <div className="price">
                  {formatCurrency(product.detail?.[0]?.price, 'en-US', 'USD') || 'N/A'}
                </div>
                <button className="add-to-cart-btn"
                  onClick={() => handleCart(product)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </>
  )
}