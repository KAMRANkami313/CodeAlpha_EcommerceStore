import { motion } from 'framer-motion';

/**
 * Button — Phase 9 upgraded
 *
 * Variants (existing + new):
 *   primary   — solid indigo (default CTA)
 *   secondary — neutral surface
 *   accent    — solid orange (deals/CTA-on-dark)
 *   outline   — bordered indigo
 *   ghost     — text only
 *   danger    — solid red
 *   gradient  — indigo→violet gradient (NEW)
 *   glow      — primary + animated glow shadow (NEW)
 *   glass     — frosted glass (NEW)
 *
 * Sizes: sm | md | lg
 *
 * Props:
 *   children, variant, size, className, disabled, loading,
 *   icon (left), iconRight (right) [NEW], onClick, type, ...props
 */
const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md',
  secondary: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700',
  accent:    'bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md',
  outline:   'border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 bg-transparent',
  ghost:     'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 bg-transparent',
  danger:    'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
  gradient:  'bg-gradient-to-r from-primary-600 to-violet-600 text-white hover:from-primary-700 hover:to-violet-700 shadow-md hover:shadow-lg',
  glow:      'bg-primary-600 text-white hover:bg-primary-700 btn-glow',
  glass:     'glass-card text-surface-800 dark:text-white hover:bg-white/90 dark:hover:bg-surface-800/90 border border-white/40 dark:border-surface-700/50',
};

const sizes = {
  sm: 'px-3.5 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center font-semibold
        rounded-xl transition-all duration-200 cursor-pointer
        select-none whitespace-nowrap
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {!loading && IconRight ? (
        <IconRight className="w-4 h-4 shrink-0" />
      ) : null}
    </motion.button>
  );
};

export default Button;
