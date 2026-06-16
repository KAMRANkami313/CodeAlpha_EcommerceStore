import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight, Home as HomeIcon, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import useWishlist from '../hooks/useWishlist.js';
import useAuth from '../hooks/useAuth.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

const WishlistPage = () => {
  const { wishlistProducts, fetchWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center py-16"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 mx-auto rounded-3xl bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text-brand mb-2">Your Wishlist Awaits</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Sign in to save your favorite products and access them anytime, anywhere.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="gradient" size="lg" iconRight={ArrowRight}>Login to Continue</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center py-16"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-accent-500/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 mx-auto rounded-3xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <Heart className="w-12 h-12 text-surface-400 dark:text-surface-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-surface-800 dark:text-white mb-2">Your wishlist is empty</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Save items you love by tapping the heart icon on any product. They'll show up here for quick access.
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="gradient" size="lg" icon={ShoppingBag} iconRight={ArrowRight}>
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
      <nav className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 mb-4" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-surface-800 dark:text-white font-medium">Wishlist</span>
      </nav>

      {/* Page header */}
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow shrink-0">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand mb-1">My Wishlist</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'} · Tap heart again to remove
            </p>
          </div>
        </div>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-12 p-5 rounded-2xl bg-linear-to-r from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-primary-100 dark:border-primary-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-surface-800 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-300">
            To remove an item from your wishlist, tap the heart icon on the product card.
          </p>
        </div>
        <Link to={ROUTES.PRODUCTS} className="shrink-0">
          <Button variant="outline" size="md" iconRight={ArrowRight}>Browse More</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default WishlistPage;