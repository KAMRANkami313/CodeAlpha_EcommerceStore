import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal — Premium Redesign
 *
 * Props:
 *   isOpen, onClose, title, children, size, showClose [default true], footer
 *
 * Sizes: sm | md | lg | xl | 2xl | full
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
          {/* Backdrop with subtle mesh */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-950/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className={`relative w-full ${sizes[size]} bg-white dark:bg-surface-900 rounded-2xl shadow-large border border-surface-200 dark:border-surface-800 overflow-hidden`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Premium top hairline */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
                {title ? (
                  <h2 id="modal-title" className="text-lg font-bold text-surface-900 dark:text-white font-display tracking-tight">
                    {title}
                  </h2>
                ) : (
                  <div />
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="p-2 -mr-2 rounded-lg text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

            {/* Footer (optional) */}
            {footer && (
              <div className="px-6 py-4 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/50">
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