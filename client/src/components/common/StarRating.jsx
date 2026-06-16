import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 16 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-surface-300 dark:text-surface-600'}
        />
      ))}
    </div>
  );
};

export default StarRating;