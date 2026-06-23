import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal — Editorial Modern Redesign
 *
 * Clean, restrained dialog. Solid card with subtle border, smooth spring
 * animation, accessible close behavior (Escape + backdrop click + X button).
 *
 * Props (unchanged):
 *   isOpen    — boolean, controls visibility
 *   onClose   — callback when modal requests close
 *   title     — optional header title
 *   children  — modal body content
 *   size      — sm | md | lg | xl | 2xl | full (default: md)
 *   showClose — show X button in header (default: true)
 *   footer    — optional footer content (rendered in a subtle gray bar)
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md', showClose = true, footer = null }) => {
  const sizes = {
    sm:    'max-w-md',
    md:    'max-w-lg',
    lg:    'max-w-2xl',
    xl:    'max-w-4xl',
    '2xl': 'max-w-6xl',
    full:  'max-w-[95vw]',
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isOpen) onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className={`relative w-full ${sizes[size]} bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-surface-200 dark:border-surface-800 overflow-hidden`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-800">
                {title ? (
                  <h2 id="modal-title" className="text-base font-semibold text-surface-900 dark:text-white font-display tracking-tight">
                    {title}
                  </h2>
                ) : (
                  <div />
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="p-1.5 -mr-1.5 rounded-md text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>

            {/* Footer (optional) */}
            {footer && (
              <div className="px-5 py-4 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/40">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;