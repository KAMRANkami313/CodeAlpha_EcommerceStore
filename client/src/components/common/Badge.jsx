/**
 * Badge — Editorial Modern Redesign
 *
 * Variants (all preserved for backward compatibility):
 *   default, primary, success, warning, danger, accent,
 *   gradient, glass, gold
 *
 * Props (unchanged):
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
    default:
      'bg-surface-100 dark:bg-surface-850 text-surface-700 dark:text-surface-300 ring-1 ring-inset ring-surface-200/70 dark:ring-surface-800/60',
    primary:
      'bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 ring-1 ring-inset ring-primary-200/60 dark:ring-primary-900/40',
    success:
      'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-200/60 dark:ring-emerald-900/40',
    warning:
      'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-200/60 dark:ring-amber-900/40',
    danger:
      'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200/60 dark:ring-red-900/40',
    accent:
      'bg-accent-50 dark:bg-accent-950/30 text-accent-700 dark:text-accent-400 ring-1 ring-inset ring-accent-200/60 dark:ring-accent-900/40',
    gradient:
      'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-xs font-semibold',
    glass:
      'glass-card text-surface-800 dark:text-white ring-1 ring-inset ring-surface-200/40 dark:ring-white/10',
    gold:
      'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 ring-1 ring-inset ring-amber-300/40 dark:ring-amber-800/30',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px] tracking-wide font-medium',
    sm: 'px-2.5 py-0.5 text-[11px] tracking-wide font-medium',
    md: 'px-3 py-1 text-xs tracking-wide font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-current opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;