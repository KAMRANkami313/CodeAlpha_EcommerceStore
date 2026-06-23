import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTopButton — Editorial Modern Redesign
 *
 * Floating button with a circular SVG progress ring that reflects
 * the user's scroll position. Cleaner solid styling, kept the
 * progress ring (it's a nice subtle touch).
 */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef(null);

  const size = 48;
  const stroke = 2.5;
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
        setIsVisible(scrollTop > 400);
      });
    };

    handleScroll();
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
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 right-6 z-50 cursor-pointer group"
          style={{ width: size, height: size }}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2.5 py-1.5 rounded-md bg-surface-900 dark:bg-surface-700 text-white text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none"
              >
                Back to top
                <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-surface-900 dark:border-l-surface-700" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Solid background */}
          <span className="absolute inset-0 rounded-full bg-white dark:bg-surface-800 shadow-md border border-surface-200 dark:border-surface-700 group-hover:border-primary-300 dark:group-hover:border-primary-600 transition-colors" />

          {/* SVG progress ring */}
          <svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            width={size}
            height={size}
            aria-hidden="true"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              className="text-surface-200 dark:text-surface-700"
              opacity={0.6}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-primary-500)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
            />
          </svg>

          {/* Center icon */}
          <span className="absolute inset-0 flex items-center justify-center">
            <ArrowUp
              className={`w-4.5 h-4.5 text-primary-600 dark:text-primary-300 transition-transform duration-200 ${
                isHovered ? '-translate-y-0.5' : ''
              }`}
              strokeWidth={2.5}
            />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;