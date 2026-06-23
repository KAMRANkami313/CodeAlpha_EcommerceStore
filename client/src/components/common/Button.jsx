import { motion } from 'framer-motion';

/**
 * Button — Editorial Modern Redesign
 *
 * Variants (all preserved for backward compatibility):
 *   primary   — solid indigo (default CTA)
 *   secondary — neutral surface
 *   accent    — solid amber (deals / CTAs on dark)
 *   outline   — bordered indigo
 *   ghost     — text only
 *   danger    — solid red
 *   gradient  — indigo → violet gradient
 *   glow      — primary with soft glow shadow
 *   glass     — frosted glass
 *   shine     — gradient with white shine sweep (special CTAs only)
 *
 * Sizes: sm | md | lg
 *
 * Props (unchanged):
 *   children, variant, size, className, disabled, loading,
 *   icon (left), iconRight (right), onClick, type, ...props
 */
const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 shadow-xs hover:shadow-sm hover:shadow-primary-500/10 border border-transparent',
  secondary:
    'bg-surface-100 dark:bg-surface-900 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-850 border border-surface-200 dark:border-surface-800',
  accent:
    'bg-accent-500 text-white hover:bg-accent-600 shadow-xs hover:shadow-sm hover:shadow-accent-500/10 border border-transparent',
  outline:
    'border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 bg-transparent',
  ghost:
    'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-850 bg-transparent border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-xs hover:shadow-sm hover:shadow-red-500/10 border border-transparent',
  gradient:
    'bg-gradient-to-r from-primary-600 via-violet-600 to-primary-600 bg-[length:200%_auto] text-white hover:bg-[position:right_center] shadow-sm hover:shadow-md',
  glow:
    'bg-primary-600 text-white hover:bg-primary-700 btn-glow border border-transparent',
  glass:
    'glass-card text-surface-800 dark:text-white hover:bg-white/80 dark:hover:bg-surface-900/80 border border-surface-200/60 dark:border-white/10 shadow-xs',
  shine:
    'bg-gradient-to-br from-primary-600 to-violet-600 text-white hover:from-primary-700 hover:to-violet-700 shadow-sm hover:shadow-md shine-effect border border-transparent',
};

const sizes = {
  sm: 'px-3.5 py-2 text-xs font-medium gap-1.5 rounded-lg',
  md: 'px-4.5 py-2.5 text-sm font-medium gap-2 rounded-lg',
  lg: 'px-6 py-3 text-sm font-medium gap-2 rounded-lg',
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

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center
        transition-all duration-200 cursor-pointer
        select-none whitespace-nowrap overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${baseVariant}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current stroke-[2.5]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
      ) : null}

      <span>{children}</span>

      {!loading && IconRight ? (
        <IconRight className="w-4 h-4 shrink-0" strokeWidth={2} />
      ) : null}
    </motion.button>
  );
};

export default Button;