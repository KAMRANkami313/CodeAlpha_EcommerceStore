import { motion } from 'framer-motion';
import {
  Home,
  ShoppingBag,
  Compass,
  Search,
  ArrowRight,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

const popularLinks = [
  { label: 'New Arrivals', to: '/products?sort=newest', icon: Sparkles },
  { label: 'Deals & Offers', to: '/products?filter=deals', icon: ShoppingBag },
  { label: 'All Products', to: '/products', icon: Search },
  { label: 'Support', to: '/profile', icon: Headphones },
];

const NotFoundPage = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Single subtle glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm mb-6"
        >
          <Compass className="w-8 h-8 text-primary-600 dark:text-primary-400" strokeWidth={1.5} />
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', bounce: 0.4 }}
          className="text-[120px] sm:text-[160px] font-bold leading-none text-surface-900 dark:text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          404
        </motion.h1>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="-mt-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            Lost in the store
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-3 font-display">
            This page took a wrong turn
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
            The page you're looking for may have been moved, deleted, or never existed. Let's get you back to the good stuff.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-10"
        >
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" icon={Home} className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
          <Link to="/products" className="w-full sm:w-auto">
            <Button variant="secondary" icon={ShoppingBag} iconRight={ArrowRight} className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>

        {/* Popular links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="border-t border-surface-200 dark:border-surface-800 pt-8"
        >
          <p className="text-xs uppercase tracking-wider text-surface-400 dark:text-surface-500 font-medium mb-4">
            Popular Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            {popularLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all no-underline"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-200">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;