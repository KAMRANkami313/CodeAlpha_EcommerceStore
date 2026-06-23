import { Star } from 'lucide-react';

/**
 * StarRating — Editorial Modern Redesign
 *
 * Props (unchanged):
 *   rating      — number 0-5 (supports fractions, rounds to nearest)
 *   size        — sm=14 | md=16 | lg=20 | xl=24
 *   showNumber  — show numeric rating next to stars
 *   count       — review count to display after rating
 *   interactive — boolean, makes stars clickable
 *   onChange    — callback(starNumber) when interactive
 */
const sizeMap = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const StarRating = ({
  rating = 0,
  size = 'md',
  showNumber = false,
  count = null,
  interactive = false,
  onChange = null,
}) => {
  const px = sizeMap[size] || size;
  const rounded = Math.round(rating);

  const handleClick = (star) => {
    if (interactive && onChange) onChange(star);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={px}
            onClick={() => handleClick(star)}
            className={`${
              star <= rounded
                ? 'fill-amber-400 text-amber-400'
                : 'fill-surface-200 dark:fill-surface-800 text-surface-200 dark:text-surface-800'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-xs text-surface-500 dark:text-surface-400 tabular-nums">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;