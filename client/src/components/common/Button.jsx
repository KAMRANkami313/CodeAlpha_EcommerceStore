import { motion } from 'framer-motion';

/**
 * Button — Premium Redesign
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
 *   shine     — premium white-sweep on hover
 *
 * Sizes: sm | md | lg
 *
 * Props:
 *   children, variant, size, className, disabled, loading,
 *   icon (left), iconRight (right), onClick, type, ...props
 */
const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 shadow-xs hover:shadow-brand hover:shadow-primary-500/10 border border-transparent',
  secondary: 'bg-surface-100 dark:bg-surface-900 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-850 border border-surface-200/60 dark:border-surface-800/50',
  accent:    'bg-accent-500 text-white hover:bg-accent-600 shadow-xs hover:shadow-accent hover:shadow-accent-500/10 border border-transparent',
  outline:   'border-1.5 border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-500/5 dark:hover:bg-primary-950/10 bg-transparent',
  ghost:     'text-surface-650 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-850 bg-transparent border border-transparent',
  danger:    'bg-red-600 text-white hover:bg-red-700 shadow-xs hover:shadow-md hover:shadow-red-500/10 border border-transparent',
  gradient:  'bg-linear-to-r from-primary-600 via-violet-600 to-primary-600 bg-[length:200%_auto] text-white hover:bg-[position:right_center] shadow-brand hover:shadow-lg',
  glow:      'bg-primary-600 text-white hover:bg-primary-700 btn-glow border border-transparent',
  glass:     'glass-card text-surface-800 dark:text-white hover:bg-white/90 dark:hover:bg-surface-900/90 border border-surface-200/10 dark:border-white/10 shadow-xs',
  shine:     'bg-linear-to-br from-primary-600 to-violet-600 text-white hover:from-primary-700 hover:to-violet-750 shadow-md hover:shadow-premium-hover shine-effect border border-transparent',
};

const sizes = {
  sm: 'px-4 py-2 text-2xs font-extrabold uppercase tracking-widest gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest gap-2 rounded-xl',
  lg: 'px-7.5 py-3.5 text-xs font-extrabold uppercase tracking-widest gap-2.5 rounded-xl',
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
  const baseVariant = variants[variant] || variants.primary;
  const withShine = (variant === 'primary' || variant === 'accent' || variant === 'gradient')
    ? 'shine-effect'
    : '';

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center
        transition-all duration-300 cursor-pointer
        select-none whitespace-nowrap overflow-hidden
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${baseVariant}
        ${withShine}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4.5 w-4.5 text-white stroke-[3.5]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
      ) : null}
      
      <span>{children}</span>
      
      {!loading && IconRight ? (
        <IconRight className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
      ) : null}
    </motion.button>
  );
};

export default Button;