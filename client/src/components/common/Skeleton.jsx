/**
 * Skeleton — Editorial Modern Redesign
 *
 * Cleaner shimmer placeholders with consistent rounded corners.
 *
 * Components (all preserved):
 *   SkeletonCard  — product card placeholder
 *   SkeletonGrid  — grid of SkeletonCards (default export)
 *   SkeletonLine  — single line placeholder
 *   SkeletonBlock — arbitrary block
 */

const shimmerClass = 'shimmer bg-surface-200 dark:bg-surface-800';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
      <div className={`aspect-square ${shimmerClass}`} />
      <div className="p-4 space-y-3">
        <div className={`h-2.5 w-16 ${shimmerClass} rounded-full`} />
        <div className={`h-3.5 w-3/4 ${shimmerClass} rounded-md`} />
        <div className="flex items-center gap-1.5">
          <div className={`h-3 w-20 ${shimmerClass} rounded-md`} />
        </div>
        <div className="flex items-center justify-between">
          <div className={`h-4.5 w-20 ${shimmerClass} rounded-md`} />
          <div className={`h-8 w-8 ${shimmerClass} rounded-lg`} />
        </div>
      </div>
    </div>
  );
};

const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

const SkeletonLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${shimmerClass} ${width} ${height} rounded-md ${className}`} />
);

const SkeletonBlock = ({ className = '' }) => (
  <div className={`${shimmerClass} rounded-lg ${className}`} />
);

export { SkeletonCard, SkeletonGrid, SkeletonLine, SkeletonBlock };
export default SkeletonGrid;