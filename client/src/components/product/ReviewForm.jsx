import { useState } from 'react';
import { Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import reviewService from '../../services/reviewService.js';
import Button from '../common/Button.jsx';

const ReviewForm = ({ productId, onSubmitted, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await reviewService.createReview(productId, {
        rating: selectedRating,
        comment: data.comment,
      });
      toast.success('Review submitted successfully!');
      onSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-primary-200 p-6">
      <h4 className="font-bold text-surface-800 mb-4">Write Your Review</h4>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={
                    star <= (hoverRating || selectedRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-surface-300'
                  }
                />
              </button>
            ))}
          </div>
          {selectedRating === 0 && (
            <p className="text-xs text-surface-400 mt-1">Click a star to rate</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Your Review</label>
          <textarea
            {...register('comment', {
              required: 'Please write a comment',
              maxLength: { value: 500, message: 'Comment cannot exceed 500 characters' },
            })}
            rows={4}
            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
            placeholder="Share your experience with this product..."
          />
          {errors.comment && (
            <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" loading={loading} size="md">
            Submit Review
          </Button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors cursor-pointer text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;