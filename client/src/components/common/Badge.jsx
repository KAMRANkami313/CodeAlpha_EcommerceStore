/**
 * Badge — Phase 9 upgraded
 *
 * Variants (existing + new):
 *   default  — neutral slate
 *   primary  — indigo
 *   success  — emerald
 *   warning  — amber
 *   danger   — red
 *   accent   — orange
 *   gradient — indigo→violet (NEW)
 *   glass    — frosted glass (NEW)
 *   gold     — premium gold (NEW)
 *
 * Props:
 *   children, variant, className, size [NEW: xs|sm|md], dot [NEW: boolean — shows a pulsing dot]
 */
const Badge = ({
  children,
  variant = 'default',
  className = '',
  size = 'sm',
  dot = false,
}) => {
  const variants = {
    default:  'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300',
    primary:  'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300',
    success:  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    warning:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    danger:   'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    accent:   'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300',
    gradient: 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-sm',
    glass:    'glass-card text-surface-800 dark:text-white',
    gold:     'bg-gold-soft dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-2xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${variants[variant]} ${sizes[size]} ${className}`}
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
