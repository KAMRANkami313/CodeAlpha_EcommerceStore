import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import reviewService from '../../services/reviewService.js';
import Button from '../common/Button.jsx';

const RATING_LABELS = {
  1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
};

/**
 * ReviewForm — Editorial Modern Redesign
 *
 * Clean card, sentence case labels, refined textarea.
 * Same props, validation, and service call — fully backward compatible.
 *
 * Props (unchanged):
 *   productId   — product ID to review
 *   onSubmitted — callback after successful submission
 *   onCancel    — callback to close form
 */
const ReviewForm = ({ productId, onSubmitted, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const commentValue = watch('comment', '');
  const charCount = commentValue.length;

  const onSubmit = async (data) => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      await reviewService.createReview(productId, { rating: selectedRating, comment: data.comment });
      toast.success('Review submitted successfully!');
      onSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 sm:p-6 relative">
      {/* Close button */}
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 p-1.5 rounded-md text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors"
        aria-label="Close form"
      >
        <X className="w-4 h-4" />
      </button>

      <h4 className="font-semibold text-surface-900 dark:text-white font-display text-base mb-1">Write a Review</h4>
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-5">Share your honest experience with this product</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Star rating selector */}
        <div>
          <label className="block text-xs font-medium text-surface-600 dark:text-surface-300 mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= (hoverRating || selectedRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-surface-200 dark:fill-surface-800 text-surface-200 dark:text-surface-800'
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || selectedRating) > 0 && (
              <span className="text-xs font-medium text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 py-1 px-2.5 rounded-md">
                {RATING_LABELS[hoverRating || selectedRating]}
              </span>
            )}
          </div>
          {selectedRating === 0 && (
            <p className="text-[11px] text-surface-400 mt-1.5">Click a star to rate</p>
          )}
        </div>

        {/* Comment field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-surface-600 dark:text-surface-300">
              Your Review <span className="text-red-500">*</span>
            </label>
            <span className={`text-[11px] font-medium tabular-nums ${charCount > 500 ? 'text-red-500' : 'text-surface-400'}`}>
              {charCount}/500
            </span>
          </div>
          <textarea
            {...register('comment', {
              required: 'Please write a comment',
              maxLength: { value: 500, message: 'Comment cannot exceed 500 characters' },
            })}
            rows={4}
            className="w-full px-3.5 py-2.5 border border-surface-200 dark:border-surface-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 text-sm font-medium resize-none bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all"
            placeholder="Share your experience with this product. What did you like or dislike? How was the quality?"
          />
          {errors.comment && (
            <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-1">
          <Button type="submit" variant="primary" loading={loading} size="md" className="flex-1 sm:flex-none">
            Submit Review
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} size="md">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;