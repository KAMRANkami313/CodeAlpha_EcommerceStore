import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTopButton — Phase 9.10 polish
 *
 * Floating glass button with a circular SVG progress ring that
 * reflects the user's scroll position on the page (0% → 100%).
 *
 * Behaviors:
 *   - Hidden until user scrolls past 300px
 *   - Progress ring fills as user scrolls down
 *   - Click smoothly scrolls back to top
 *   - Tooltip label appears on hover
 *   - Glass morphism styling with brand color accents
 */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef(null);

  // SVG ring geometry
  const size = 56;          // button width/height
  const stroke = 3;         // ring stroke width
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
        setProgress(pct);
        setIsVisible(scrollTop > 300);
      });
    };

    handleScroll(); // initialize on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 right-6 z-50 cursor-pointer group"
          style={{ width: size, height: size }}
        >
          {/* Tooltip on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2.5 py-1.5 rounded-lg bg-surface-900 dark:bg-surface-700 text-white text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none"
              >
                Back to top
                <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-surface-900 dark:border-l-surface-700" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Glass background + SVG ring overlay */}
          <span
            className="absolute inset-0 rounded-full glass-card shadow-large border border-white/40 dark:border-surface-700/60 group-hover:border-primary-300 dark:group-hover:border-primary-600 transition-colors"
          />
          <svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            width={size}
            height={size}
            aria-hidden="true"
          >
            {/* Track ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              className="text-surface-200 dark:text-surface-700"
              opacity={0.5}
            />
            {/* Progress ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#scrollTopGradient)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
            />
            <defs>
              <linearGradient id="scrollTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-primary-500)" />
                <stop offset="100%" stopColor="var(--color-primary-700)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center icon */}
          <span className="absolute inset-0 flex items-center justify-center">
            <ArrowUp
              className={`w-5 h-5 text-primary-600 dark:text-primary-300 transition-transform duration-300 ${
                isHovered ? '-translate-y-0.5' : ''
              }`}
              strokeWidth={2.5}
            />
          </span>

          {/* Percentage label (small, bottom-right) */}
          {progress > 5 && (
            <span className="absolute -bottom-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-primary-600 text-white text-[9px] font-bold leading-none shadow-sm">
              {Math.round(progress)}
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;