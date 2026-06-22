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
 * ReviewList — Redesigned with dynamic, real-time ratings calculation
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

  return (
    <div className="space-y-6">
      {/* ============ Reviews Summary Card ============ */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-150 dark:border-surface-850/60 p-6 sm:p-8 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: big rating */}
          <div className="md:col-span-4 text-center md:border-r md:border-surface-100 dark:md:border-surface-800 md:pr-6 select-none">
            <p className="text-5xl sm:text-6xl font-black text-surface-900 dark:text-white font-display tracking-tight">
              {derivedRating.toFixed(1)}
            </p>
            <div className="flex justify-center my-3">
              <StarRating rating={derivedRating} size="md" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500">
              Based on {derivedNumOfReviews} {derivedNumOfReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Right: distribution bars */}
          <div className="md:col-span-5 space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2.5 text-xs">
                  <span className="w-8 flex items-center gap-0.5 font-bold text-surface-500 dark:text-surface-400 select-none">
                    {star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-2" />
                  </span>
                  <div className="flex-1 h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden select-none">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${
                        star === 5 ? 'bg-emerald-500' :
                        star === 4 ? 'bg-lime-500' :
                        star === 3 ? 'bg-amber-500' :
                        star === 2 ? 'bg-orange-500' : 'bg-red-550'
                      }`}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-surface-400 dark:text-surface-500 tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <div className="md:col-span-3 flex flex-col gap-2 md:items-end">
            {isAuthenticated && !hasReviewed ? (
              <Button variant="primary" size="md" icon={MessageSquare} onClick={() => setShowForm(!showForm)} className="w-full md:w-auto font-bold uppercase tracking-wider text-xs">
                Write a Review
              </Button>
            ) : isAuthenticated && hasReviewed ? (
              <Badge variant="success" size="sm" dot className="font-bold uppercase tracking-wider py-1 px-2.5">You reviewed this</Badge>
            ) : (
              <a href="/login" className="text-xs text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest hover:underline no-underline">
                Login to write a review →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Review Form container */}
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
        <div className="flex items-center justify-between gap-3 flex-wrap pt-2 select-none">
          <p className="text-xs font-bold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-2xs font-extrabold uppercase tracking-wider text-surface-450 dark:text-surface-500">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-surface-200 dark:border-surface-700 rounded-lg text-xs font-bold bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List Cards */}
      {loading ? (
        <Loader size="md" label="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <div className="text-center py-14 bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 select-none">
          <div className="w-16 h-16 bg-surface-50 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-7 h-7 text-surface-300 dark:text-surface-600 animate-float" strokeWidth={1.5} />
          </div>
          <p className="text-surface-700 dark:text-surface-200 font-bold uppercase tracking-wider text-xs">No reviews yet</p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review, idx) => {
            const isOwner = user?._id === review.user?._id;
            const avatarColor = ['from-primary-500 to-violet-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-pink-500 to-rose-600', 'from-blue-500 to-cyan-600'][idx % 5];
            return (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-150 dark:border-surface-850/60 p-5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full bg-linear-to-br ${avatarColor} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs select-none`}>
                      {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-surface-850 dark:text-white leading-tight">{review.user?.name || 'Anonymous'}</p>
                        <Badge variant="success" size="xs" className="text-4xs font-black uppercase tracking-widest flex items-center gap-1 select-none">
                          <ThumbsUp className="w-2.5 h-2.5" /> Verified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 select-none">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500">
                          {new Date(review.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-2 text-surface-400 dark:text-surface-500 hover:text-red-550 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer select-none"
                      title="Delete review"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-surface-650 dark:text-surface-300 mt-3 leading-relaxed text-sm font-medium">{review.comment}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
