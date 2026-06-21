import { motion } from 'framer-motion';

/**
 * Button — Enhanced
 *
 * Variants:
 *   primary   — solid indigo (default CTA) + shine sweep
 *   secondary — neutral surface
 *   accent    — solid orange (deals/CTA-on-dark) + shine sweep
 *   outline   — bordered indigo
 *   ghost     — text only
 *   danger    — solid red
 *   gradient  — indigo→violet animated gradient
 *   glow      — primary + animated glow shadow
 *   glass     — frosted glass
 *   shine     — premium white-sweep on hover (NEW)
 *
 * Sizes: sm | md | lg
 *
 * Props:
 *   children, variant, size, className, disabled, loading,
 *   icon (left), iconRight (right), onClick, type, ...props
 */
const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md hover:shadow-primary-500/25',
  secondary: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700',
  accent:    'bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md hover:shadow-accent-500/25',
  outline:   'border-2 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 bg-transparent',
  ghost:     'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 bg-transparent',
  danger:    'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md hover:shadow-red-500/25',
  gradient:  'bg-gradient-to-r from-primary-600 via-violet-600 to-primary-600 bg-[length:200%_auto] text-white hover:bg-[position:right_center] shadow-md hover:shadow-lg hover:shadow-primary-500/30',
  glow:      'bg-primary-600 text-white hover:bg-primary-700 btn-glow',
  glass:     'glass-card text-surface-800 dark:text-white hover:bg-white/90 dark:hover:bg-surface-800/90 border border-white/40 dark:border-surface-700/50',
  shine:     'bg-gradient-to-br from-primary-600 to-violet-600 text-white hover:from-primary-700 hover:to-violet-700 shadow-md hover:shadow-premium-hover shine-effect',
};

const sizes = {
  sm: 'px-3.5 py-2 text-sm gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-xl',
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
  // Add shine sweep to primary & accent for that premium feel
  const baseVariant = variants[variant] || variants.primary;
  const withShine = (variant === 'primary' || variant === 'accent' || variant === 'gradient')
    ? 'shine-effect'
    : '';

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center font-semibold
        transition-all duration-200 cursor-pointer
        select-none whitespace-nowrap overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${baseVariant}
        ${withShine}
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