const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="aspect-square skeleton dark:opacity-20" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton dark:opacity-20 rounded" />
        <div className="h-4 w-3/4 skeleton dark:opacity-20 rounded" />
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-20 skeleton dark:opacity-20 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 skeleton dark:opacity-20 rounded" />
          <div className="h-9 w-9 skeleton dark:opacity-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonGrid };
export default SkeletonGrid;
