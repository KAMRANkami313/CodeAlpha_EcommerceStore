import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight, Home as HomeIcon, ArrowRight, Trash2 } from 'lucide-react';
import useWishlist from '../hooks/useWishlist.js';
import useAuth from '../hooks/useAuth.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

/**
 * WishlistPage — Editorial Modern Redesign
 */
const WishlistPage = () => {
  const { wishlistProducts, fetchWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold mb-2 font-display tracking-tight text-surface-900 dark:text-white">Your wishlist awaits</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-8 max-w-sm mx-auto leading-relaxed">
            Sign in to save your favorite products, monitor stock changes, and access them anywhere.
          </p>
          <Link to={ROUTES.LOGIN} className="no-underline">
            <Button variant="primary" size="md" iconRight={ArrowRight}>Login to Continue</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Empty
  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md mx-auto text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-800 flex items-center justify-center">
            <Heart className="w-8 h-8 text-surface-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2 font-display tracking-tight">Your wishlist is empty</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-8 max-w-sm mx-auto leading-relaxed">
            Save items you love by tapping the heart icon on any product card. They'll show up here for quick access.
          </p>
          <Link to={ROUTES.PRODUCTS} className="no-underline">
            <Button variant="primary" size="md" icon={ShoppingBag} iconRight={ArrowRight}>
              Discover Products
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 mb-5" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-700" />
        <span className="text-surface-800 dark:text-white">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap pb-6 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">My Wishlist</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'} · Tap heart again to remove
            </p>
          </div>
        </div>

        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:gap-2 transition-all no-underline link-underline"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Info banner */}
      <div className="mt-12 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-900 flex items-center justify-center shrink-0 border border-surface-200 dark:border-surface-800">
            <Trash2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400">
            To remove an item, tap the heart icon on the product card.
          </p>
        </div>
        <Link to={ROUTES.PRODUCTS} className="shrink-0 no-underline">
          <Button variant="outline" size="sm" iconRight={ArrowRight}>Browse More</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default WishlistPage;