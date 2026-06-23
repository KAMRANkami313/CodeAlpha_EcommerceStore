import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Star, ThumbsUp } from 'lucide-react';
import reviewService from '../../services/reviewService.js';
import useAuth from '../../hooks/useAuth.js';
import StarRating from '../common/StarRating.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import Loader from '../common/Loader.jsx';
import ReviewForm from './ReviewForm.jsx';

/**
 * ReviewList — Editorial Modern Redesign
 *
 * Single cohesive avatar gradient, sentence case, rounded-xl cards.
 * Same props, logic, and memos — fully backward compatible.
 *
 * Props (unchanged):
 *   productId      — product ID
 *   productRating  — fallback rating from product (default: 0)
 *   numOfReviews   — fallback review count from product (default: 0)
 */
const ReviewList = ({ productId, productRating = 0, numOfReviews = 0 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const { user, isAuthenticated } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewService.getProductReviews(productId);
      setReviews(response.data.reviews || []);
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
    } catch {
      // error handled by interceptor
    }
  };

  const hasReviewed = reviews.some((r) => r.user?._id === user?._id);

  // Dynamic calculations to prevent mismatches
  const derivedNumOfReviews = useMemo(() => {
    return reviews.length > 0 ? reviews.length : (numOfReviews || 0);
  }, [reviews, numOfReviews]);

  const derivedRating = useMemo(() => {
    if (reviews.length === 0) return productRating || 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  }, [reviews, productRating]);

  // Rating distribution
  const distribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });
    return dist;
  }, [reviews]);

  // Sorted reviews
  const sortedReviews = useMemo(() => {
    const arr = [...reviews];
    if (sortBy === 'highest') return arr.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'lowest')  return arr.sort((a, b) => a.rating - b.rating);
    return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reviews, sortBy]);

  // Bar color by star level
  const barColor = (star) => {
    if (star === 5) return 'bg-emerald-500';
    if (star === 4) return 'bg-lime-500';
    if (star === 3) return 'bg-amber-500';
    if (star === 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-5">
      {/* ─── Summary Card ─── */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">

          {/* Big rating */}
          <div className="md:col-span-4 text-center md:border-r md:border-surface-200 dark:md:border-surface-800 md:pr-5">
            <p className="text-4xl sm:text-5xl font-bold text-surface-900 dark:text-white font-display tracking-tight tabular-nums">
              {derivedRating.toFixed(1)}
            </p>
            <div className="flex justify-center my-2">
              <StarRating rating={derivedRating} size="md" />
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Based on {derivedNumOfReviews} {derivedNumOfReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Distribution bars */}
          <div className="md:col-span-5 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2.5 text-xs">
                  <span className="w-7 flex items-center gap-0.5 font-medium text-surface-500 dark:text-surface-400">
                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                  </span>
                  <div className="flex-1 h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${barColor(star)}`}
                    />
                  </div>
                  <span className="w-6 text-right font-medium text-surface-400 dark:text-surface-500 tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="md:col-span-3 flex flex-col gap-2 md:items-end">
            {isAuthenticated && !hasReviewed ? (
              <Button variant="primary" size="md" icon={MessageSquare} onClick={() => setShowForm(!showForm)} className="w-full md:w-auto">
                Write a Review
              </Button>
            ) : isAuthenticated && hasReviewed ? (
              <Badge variant="success" size="sm" dot>You reviewed this</Badge>
            ) : (
              <a href="/login" className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline no-underline">
                Login to write a review →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Review form (expandable) */}
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ReviewForm
              productId={productId}
              onSubmitted={handleReviewSubmitted}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort header */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
          <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-surface-500 dark:text-surface-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-surface-200 dark:border-surface-800 rounded-md text-xs font-medium bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <Loader size="md" label="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800">
          <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-surface-400" strokeWidth={1.5} />
          </div>
          <p className="text-surface-700 dark:text-surface-200 font-medium text-sm">No reviews yet</p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedReviews.map((review, idx) => {
            const isOwner = user?._id === review.user?._id;
            return (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Single cohesive avatar gradient */}
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-surface-900 dark:text-white leading-tight">{review.user?.name || 'Anonymous'}</p>
                        <Badge variant="success" size="xs" className="flex items-center gap-0.5">
                          <ThumbsUp className="w-2.5 h-2.5" /> Verified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-[11px] text-surface-400 dark:text-surface-500 tabular-nums">
                          {new Date(review.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-1.5 text-surface-400 dark:text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
                      title="Delete review"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-surface-700 dark:text-surface-300 mt-3 leading-relaxed text-sm">{review.comment}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
