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
    <div className="bg-white dark:bg-surface-900 rounded-3xl border border-primary-500/35 dark:border-primary-500/20 p-6 sm:p-7 relative shadow-medium">
      {/* Close button */}
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-850 cursor-pointer transition-colors select-none"
        aria-label="Close form"
      >
        <X className="w-4 h-4" />
      </button>

      <h4 className="font-extrabold text-surface-900 dark:text-white font-display text-lg mb-1 select-none">Write Your Review</h4>
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-6 select-none">Share your honest experience with this product</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Star Rating selector */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-surface-750 dark:text-surface-300 mb-2 select-none">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 select-none">
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
                    size={30}
                    className={`transition-colors duration-150 ${
                      star <= (hoverRating || selectedRating)
                        ? 'fill-amber-400 text-amber-400 stroke-[1.8]'
                        : 'text-surface-300 dark:text-surface-750 stroke-[1.5]'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || selectedRating) > 0 && (
              <span className="text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-200 bg-surface-50 dark:bg-surface-800 py-1 px-2 rounded-md border border-surface-100 dark:border-surface-750 select-none">
                {RATING_LABELS[hoverRating || selectedRating]}
              </span>
            )}
          </div>
          {selectedRating === 0 && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-555 mt-2 select-none">Click a star to rate</p>
          )}
        </div>

        {/* Comment field */}
        <div>
          <div className="flex items-center justify-between mb-2 select-none">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-surface-750 dark:text-surface-300">
              Your Review <span className="text-red-500">*</span>
            </label>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${charCount > 500 ? 'text-red-500' : 'text-surface-400'}`}>
              {charCount}/500
            </span>
          </div>
          <textarea
            {...register('comment', {
              required: 'Please write a comment',
              maxLength: { value: 500, message: 'Comment cannot exceed 500 characters' },
            })}
            rows={4}
            className="w-full px-4 py-3 border border-surface-150 dark:border-surface-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm font-medium resize-none bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all shadow-inner"
            placeholder="Share your experience with this product. What did you like or dislike? How was the quality?"
          />
          {errors.comment && (
            <p className="text-red-500 text-[11px] font-semibold mt-1.5 flex items-center gap-1 select-none">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 select-none">
          <Button type="submit" variant="primary" loading={loading} size="md" className="flex-1 sm:flex-none font-bold uppercase tracking-wider text-xs px-5">
            Submit Review
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} size="md" className="font-bold uppercase tracking-wider text-xs">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;