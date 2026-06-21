/**
 * Badge — Premium Redesign
 *
 * Variants:
 *   default, primary, success, warning, danger, accent,
 *   gradient (animated), glass, gold
 *
 * Props:
 *   children, variant, className, size [xs|sm|md], dot [boolean]
 */
const Badge = ({
  children,
  variant = 'default',
  className = '',
  size = 'sm',
  dot = false,
}) => {
  const variants = {
    default:  'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 ring-1 ring-inset ring-surface-200/60 dark:ring-surface-700/60',
    primary:  'bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 ring-1 ring-inset ring-primary-200/60 dark:ring-primary-700/40',
    success:  'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200/60 dark:ring-emerald-700/40',
    warning:  'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-200/60 dark:ring-amber-700/40',
    danger:   'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-200/60 dark:ring-red-700/40',
    accent:   'bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 ring-1 ring-inset ring-accent-200/60 dark:ring-accent-700/40',
    gradient: 'bg-gradient-to-r from-primary-600 to-violet-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-sm',
    glass:    'glass-card text-surface-800 dark:text-white',
    gold:     'bg-gold-soft dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 ring-1 ring-inset ring-amber-300/50 dark:ring-amber-700/40',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-2xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide transition-all ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;