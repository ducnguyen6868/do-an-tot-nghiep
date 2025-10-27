import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import reviewApi from '../../api/reviewApi';
import '../../styles/Review.css';

export default function Review({ code }) {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState();


    useEffect(() => {
        const limit = 10;
        setLimit(limit);
        const getReviews = async () => {
            try {
                const response = await reviewApi.get(code, page, limit);
                setReviews(response.reviews);
                setTotal(response.total);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
            }
        }
        getReviews();
    }, [code, page, limit]);

    const pages = Math.ceil(total / limit);

    const handlePageChange = (page) => {
        setPage(page);
    }

    const renderStars = (rating) => {
        return '⭐'.repeat(Math.floor(rating)) + (rating % 1 ? '½' : '');
    };
    return (
        <div className="reviews-list">
            {reviews?.map(review => (
                <div key={review._id} className="review-item">
                    <div className="reviewer-header">
                        <div className="reviewer-info">
                            <div className="reviewer-avatar">
                                {
                                    review?.avatar ? (
                                        <img style={{ width: '100%', height: 'auto', borderRadius: '50%' }} src={`http://localhost:5000/${review.avatar}`} alt='Avatar' title='Avatar' />
                                    ) : (<span>{review.name?.slice(0, 2)}</span>)
                                }
                            </div>
                            <div>
                                <div className="reviewer-name">
                                    {review.name || 'John Wick'}
                                    <span className="verified-badge">✓ Verified Purchase</span>
                                </div>
                                <div className="reviewer-date">{formatDate(review?.createdAt) || '08/08/1988'}</div>
                                <div className="review-rating">{renderStars(review?.rating)}</div>
                            </div>
                        </div>
                    </div>
                    <p className="review-comment">{review?.comment}</p>
                    {review.images && review.images.length > 0 && (
                        <div className="review-images">
                            {review.images.map((src, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000/${src}`}
                                    alt="Review"
                                    title="Review"
                                    className="review-image"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    )}
                    {review.videos && review.videos.length > 0 && (
                        <div className="review-videos">
                            {review.videos.map((src, index) => (
                                <video
                                    key={index}
                                    src={`http://localhost:5000/${src}`}
                                    controls
                                    preload="metadata"
                                    title="Review video"
                                    className="review-video"
                                />
                            ))}
                        </div>
                    )}

                    <div className="review-footer">
                        <button className="helpful-btn">👍 Helpful 999+</button>
                    </div>
                </div>
            ))}
            {/* Pagination */}
            {pages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronsLeft width={14} height={14} />
                    </button>

                    <div className="page-numbers">
                        {[...Array(pages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={`page-number ${page === index + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pages}
                    >
                        <ChevronsRight width={14} height={14} />
                    </button>
                </div>
            )}
        </div>
    )
}