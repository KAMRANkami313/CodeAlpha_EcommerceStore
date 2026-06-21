/**
 * Loader — Premium Redesign
 *
 * Triple-layer spinner with brand color and subtle pulse.
 *
 * Props:
 *   size     — sm | md | lg | xl
 *   label    — optional text below spinner
 *   className
 */
const Loader = ({ size = 'md', label = null, className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 ${className}`}>
      <div className="relative">
        {/* Outer ring (track) */}
        <div
          className={`${sizes[size] || sizes.md} rounded-full border-2 border-primary-100 dark:border-primary-900/40`}
        />
        {/* Middle ring (spinning) */}
        <div
          className={`${sizes[size] || sizes.md} absolute inset-0 rounded-full border-2 border-transparent border-t-primary-600 dark:border-t-primary-400 animate-spin`}
          style={{ animationDuration: '0.8s' }}
        />
        {/* Inner pulse dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse ${
              size === 'sm' ? 'w-1 h-1' :
              size === 'lg' ? 'w-2.5 h-2.5' :
              size === 'xl' ? 'w-3.5 h-3.5' :
              'w-1.5 h-1.5'
            }`}
          />
        </div>
      </div>
      {label && (
        <p className={`text-surface-500 dark:text-surface-400 font-medium ${labelSizes[size] || labelSizes.md} animate-pulse`}>
          {label}
        </p>
      )}
    </div>
  );
};

export default Loader;