import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Scroll to top"
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-primary-600 text-white
        shadow-lg shadow-primary-600/30
        dark:bg-primary-500 dark:shadow-primary-500/20
        cursor-pointer
        transition-all duration-300 ease-in-out
        hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/40
        dark:hover:bg-primary-400
        hover:-translate-y-1
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        dark:focus:ring-offset-surface-900
        ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-4 opacity-0 pointer-events-none'
        }
      `}
    >
      <ArrowUp
        className={`w-5 h-5 transition-transform duration-300 ${
          isHovered ? '-translate-y-0.5' : ''
        }`}
        strokeWidth={2.5}
      />
    </button>
  );
};

export default ScrollToTopButton;