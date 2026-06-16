import { Star } from 'lucide-react';

/**
 * StarRating — Phase 9 upgraded
 *
 * Props:
 *   rating     — number 0-5 (supports fractions)
 *   size       — sm=13 | md=16 | lg=20 | xl=24
 *   showNumber — show numeric rating next to stars [NEW]
 *   count      — review count to display after rating [NEW]
 *   interactive — boolean, makes stars clickable [NEW]
 *   onChange    — callback(starNumber) when interactive [NEW]
 */
const sizeMap = {
  sm: 13,
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
            className={`${star <= rounded ? 'fill-amber-400 text-amber-400' : 'fill-surface-200 dark:fill-surface-700 text-surface-200 dark:text-surface-700'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== null && (
        <span className="text-xs text-surface-500 dark:text-surface-400">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;