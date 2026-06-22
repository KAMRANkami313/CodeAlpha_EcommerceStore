import { motion } from 'framer-motion';

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
    default:  'bg-surface-100 dark:bg-surface-850 text-surface-700 dark:text-surface-300 ring-1 ring-inset ring-surface-200/50 dark:ring-surface-800/40',
    primary:  'bg-primary-50/70 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-1 ring-inset ring-primary-200/30 dark:ring-primary-900/30',
    success:  'bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-250/30 dark:ring-emerald-900/30',
    warning:  'bg-amber-50/80 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-250/30 dark:ring-amber-900/30',
    danger:   'bg-red-50/80 dark:bg-red-950/20 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-250/30 dark:ring-red-900/30',
    accent:   'bg-accent-50/80 dark:bg-accent-950/20 text-accent-700 dark:text-accent-400 ring-1 ring-inset ring-accent-250/30 dark:ring-accent-900/30',
    gradient: 'bg-linear-to-r from-primary-600 to-violet-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-xs font-bold',
    glass:    'glass-card text-surface-800 dark:text-white ring-1 ring-inset ring-surface-200/10 dark:ring-white/10',
    gold:     'bg-gold-soft/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-450 ring-1 ring-inset ring-amber-300/30 dark:ring-amber-800/20',
  };

  const sizes = {
    xs: 'px-2.5 py-0.5 text-[9px] tracking-widest font-extrabold uppercase',
    sm: 'px-3 py-0.5 text-[10px] tracking-wider font-extrabold uppercase',
    md: 'px-3.5 py-1 text-xs tracking-wide font-extrabold uppercase',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
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