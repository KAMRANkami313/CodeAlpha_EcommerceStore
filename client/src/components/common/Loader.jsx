/**
 * Loader — Premium Redesign
 *
 * Triple-layer spinner with brand gradient, subtle pulse glow, and refined typography.
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
    sm: 'text-2xs uppercase tracking-widest font-extrabold',
    md: 'text-xs uppercase tracking-widest font-extrabold',
    lg: 'text-sm uppercase tracking-widest font-extrabold',
    xl: 'text-base uppercase tracking-widest font-extrabold',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 select-none ${className}`}>
      <div className="relative">
        
        {/* Soft backlighting pulse glow behind the spinner */}
        <div 
          className={`absolute inset-0 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-lg animate-pulse ${sizes[size] || sizes.md}`} 
        />

        {/* Outer ring (Track background) */}
        <div
          className={`${sizes[size] || sizes.md} rounded-full border-2 border-surface-150 dark:border-surface-850`}
        />
        
        {/* Middle ring (Precision spinning sweep) */}
        <div
          className={`${sizes[size] || sizes.md} absolute inset-0 rounded-full border-2 border-transparent border-t-primary-600 dark:border-t-primary-400 border-r-primary-600/30 dark:border-r-primary-400/30 animate-spin`}
          style={{ animationDuration: '0.75s', animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)' }}
        />
        
        {/* Opposite direction auxiliary accent ring for premium texture */}
        <div
          className={`${sizes[size] || sizes.md} absolute inset-0 rounded-full border-2 border-transparent border-b-violet-500/40 dark:border-b-violet-400/40 animate-spin`}
          style={{ animationDuration: '1.2s', animationTimingFunction: 'linear', animationDirection: 'reverse' }}
        />

        {/* Inner core pulse dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`bg-linear-to-r from-primary-500 to-violet-500 rounded-full animate-pulse shadow-glow ${
              size === 'sm' ? 'w-1 h-1' :
              size === 'lg' ? 'w-2.5 h-2.5' :
              size === 'xl' ? 'w-3.5 h-3.5' :
              'w-1.5 h-1.5'
            }`}
          />
        </div>
      </div>

      {/* Dynamic Pulsating Label with modern layout tokens */}
      {label && (
        <p className={`text-surface-450 dark:text-surface-500 text-center animate-pulse ${labelSizes[size] || labelSizes.md}`}>
          {label}
        </p>
      )}
    </div>
  );
};

export default Loader;