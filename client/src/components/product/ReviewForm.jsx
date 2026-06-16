import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import reviewService from '../../services/reviewService.js';
import Button from '../common/Button.jsx';

const RATING_LABELS = {
  1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
};

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
    <div className="bg-white dark:bg-surface-900 rounded-2xl border-2 border-primary-200 dark:border-primary-800 p-6 relative">
      {/* Close button */}
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors"
        aria-label="Close form"
      >
        <X className="w-4 h-4" />
      </button>

      <h4 className="font-bold text-surface-900 dark:text-white font-display text-lg mb-1">Write Your Review</h4>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-5">Share your honest experience with this product</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setSelectedRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={32}
                    className={
                      star <= (hoverRating || selectedRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-surface-300 dark:text-surface-700'
                    }
                  />
                </button>
              ))}
            </div>
            {(hoverRating || selectedRating) > 0 && (
              <span className="text-sm font-medium text-surface-700 dark:text-surface-200 ml-2">
                {RATING_LABELS[hoverRating || selectedRating]}
              </span>
            )}
          </div>
          {selectedRating === 0 && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1.5">Click a star to rate</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Your Review <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs ${charCount > 500 ? 'text-red-500' : 'text-surface-400'}`}>
              {charCount}/500
            </span>
          </div>
          <textarea
            {...register('comment', {
              required: 'Please write a comment',
              maxLength: { value: 500, message: 'Comment cannot exceed 500 characters' },
            })}
            rows={4}
            className="w-full px-4 py-3 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder:text-surface-400 transition-colors"
            placeholder="Share your experience with this product. What did you like or dislike? How was the quality?"
          />
          {errors.comment && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
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