import { useState } from 'react';
import { Star, X, Image, Video, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import reviewApi from '../../api/reviewApi';
import '../../styles/ReviewModal.css';

export default function ReviewModal({ data,onClose , onChange }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'image'
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: 'video'
    }));
    setVideos(prev => [...prev, ...newVideos].slice(0, 2));
  };

  const removeMedia = (index, type) => {
    if (type === 'image') {
      setImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !reviewText.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
        const formData = new FormData();

        // Dữ liệu text
        formData.append("user", data.user);
        formData.append("name", data.name);
        formData.append("codeProduct", data.codeProduct);
        formData.append("codeOrder", data.codeOrder);
        formData.append("rating", rating);
        formData.append("reviewText", reviewText);

        // Ảnh
        images.forEach((img) => {
          formData.append("images", img.file); // gửi file thật
        });

        // Video (nếu có)
        videos.forEach((vid) => {
          formData.append("videos", vid.file);
        });
        const response = await reviewApi.post(formData);
        toast.success(response.message);
        onChange?.();
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setIsSubmitting(false);
        onClose?.();
      }

    };

    return (
      <>
        <div className="review-container">
          <div className="review-card">
            <div className="review-header">
              <h2 className="review-title">Write a Review</h2>
              <p className="review-subtitle">Share your experience with this product</p>
            </div>

            <div className="review-form">
              <div className="rating-container">
                <label className="form-label">
                  Rating<span className="required">*</span>
                </label>
                <div className="stars-wrapper">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                      fill={star <= (hoveredRating || rating) ? '#fbbf24' : 'none'}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                {rating > 0 && (
                  <span className="rating-text">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                  </span>
                )}
              </div>

              <div className="form-group-review">
                <label className="form-label">
                  Your Review<span className="required">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience with this product..."
                  maxLength={500}
                />
                <span className={`character-count ${reviewText.length > 400 ? 'warning' : ''}`}>
                  {reviewText.length}/500 characters
                </span>
              </div>

              <div className="upload-section">
                <label className="form-label">Add Photos & Videos (Optional)</label>

                <div className="upload-buttons">
                  <label className="upload-button">
                    <Image size={20} />
                    Upload Images
                    <input
                      name='images'
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>

                  <label className="upload-button">
                    <Video size={20} />
                    Upload Videos
                    <input
                      type="file"
                      name='videos'
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>

                <div className="upload-info">
                  <span>• Images: Up to 5 files (JPG, PNG, max 5MB each)</span>
                  <span>• Videos: Up to 2 files (MP4, MOV, max 50MB each)</span>
                </div>

                {(images.length > 0 || videos.length > 0) && (
                  <div className="media-preview">
                    {images.map((img, idx) => (
                      <div key={`img-${idx}`} className="media-item">
                        <img src={img.preview} alt={`Preview ${idx + 1}`} />
                        <button
                          type="button"
                          className="remove-media"
                          onClick={() => removeMedia(idx, 'image')}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {videos.map((vid, idx) => (
                      <div key={`vid-${idx}`} className="media-item">
                        <video src={vid.preview} />
                        <button
                          type="button"
                          className="remove-media"
                          onClick={() => removeMedia(idx, 'video')}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="submit-button"
                disabled={!rating || !reviewText.trim() || isSubmitting}
                onClick={handleSubmit}
              >
                <Send size={20} />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

