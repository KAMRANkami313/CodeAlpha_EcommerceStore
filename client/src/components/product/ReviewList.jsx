import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2 } from 'lucide-react';
import reviewService from '../../services/reviewService.js';
import useAuth from '../../hooks/useAuth.js';
import StarRating from '../common/StarRating.jsx';
import Loader from '../common/Loader.jsx';
import ReviewForm from './ReviewForm.jsx';

const ReviewList = ({ productId, productRating, numOfReviews }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId);
      setReviews(response.data.reviews);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewSubmitted = () => {
    setShowForm(false);
    fetchReviews();
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      fetchReviews();
    } catch (error) {
      // error handled by interceptor
    }
  };

  const hasReviewed = reviews.some(
    (review) => review.user?._id === user?._id
  );

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-white">Customer Reviews</h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={productRating} size={20} />
              <span className="text-sm text-surface-500 dark:text-surface-400">
                {productRating.toFixed(1)} out of 5 ({numOfReviews} {numOfReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
          {isAuthenticated && !hasReviewed && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors cursor-pointer text-sm"
            >
              Write a Review
            </button>
          )}
          {!isAuthenticated && (
            <a href="/login" className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline no-underline">
              Login to write a review
            </a>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ReviewForm
            productId={productId}
            onSubmitted={handleReviewSubmitted}
            onCancel={() => setShowForm(false)}
          />
        </motion.div>
      )}

      {/* Reviews List */}
      {loading ? (
        <Loader />
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700">
          <MessageSquare className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
          <p className="text-surface-500 dark:text-surface-400 font-medium">No reviews yet</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-surface-800 dark:text-white">{review.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size={14} />
                      <span className="text-xs text-surface-400 dark:text-surface-500">
                        {new Date(review.createdAt).toLocaleDateString('en-PK', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                {user?._id === review.user?._id && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="p-2 text-surface-400 dark:text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-surface-600 dark:text-surface-300 mt-3 leading-relaxed text-sm">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;