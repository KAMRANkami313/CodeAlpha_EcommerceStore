import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ChevronRight, Home as HomeIcon, ArrowRight, Trash2, Sparkles } from 'lucide-react';
import useWishlist from '../hooks/useWishlist.js';
import useAuth from '../hooks/useAuth.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

/**
 * WishlistPage — Premium Redesign
 *
 * A high-fidelity personal curation hub featuring smooth loading transitions,
 * tactical metadata summaries, and beautiful responsive grid structures.
 */
const WishlistPage = () => {
  const { wishlistProducts, fetchWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Fallback: Not Authenticated State
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md mx-auto text-center py-12 select-none"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary-500/15 blur-3xl rounded-full animate-pulse-glow" />
            <div className="relative w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-glow border border-white/10">
              <Heart className="w-9 h-9 text-white stroke-[2.2]" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2 font-display tracking-tight text-surface-900 dark:text-white">Your Wishlist Awaits</h1>
          <p className="text-xs font-semibold text-surface-400 dark:text-surface-555 mb-8 max-w-sm mx-auto leading-relaxed">
            Sign in to your premium account to save your favorite products, monitor stock changes, and access them anywhere.
          </p>
          <Link to={ROUTES.LOGIN} className="no-underline">
            <Button variant="gradient" size="md" iconRight={ArrowRight}>Login to Continue</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Fallback: Empty State
  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md mx-auto text-center py-12 select-none"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full" />
            <div className="relative w-20 h-20 mx-auto rounded-2xl bg-surface-100 dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/40 flex items-center justify-center shadow-xs">
              <Heart className="w-9 h-9 text-surface-400 dark:text-surface-600 stroke-[2.2]" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mb-2 font-display tracking-tight">Your wishlist is empty</h1>
          <p className="text-xs font-semibold text-surface-400 dark:text-surface-555 mb-8 max-w-sm mx-auto leading-relaxed">
            Save premium items you love by tapping the heart icon on any catalog card. They'll show up here for quick tracking.
          </p>
          <Link to={ROUTES.PRODUCTS} className="no-underline">
            <Button variant="gradient" size="md" icon={ShoppingBag} iconRight={ArrowRight}>
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
      {/* Breadcrumb Navigation (Sleek Tactical Link Stack) */}
      <nav className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-surface-450 dark:text-surface-555 mb-5 select-none" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-450 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-700" />
        <span className="text-surface-800 dark:text-white">Wishlist</span>
      </nav>

      {/* Page Header Layout Block */}
      <div className="flex items-end justify-between gap-4 mb-8 flex-wrap pb-6 border-b border-surface-150 dark:border-surface-850">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand shrink-0 border border-white/10 select-none">
            <Heart className="w-6.5 h-6.5 text-white fill-white stroke-none" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">My Wishlist</h1>
            <p className="text-2xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-wider mt-2.5 flex items-center gap-1.5 select-none">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'} · Tap heart again to remove
            </p>
          </div>
        </div>
        
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 hover:gap-2.5 transition-all no-underline link-underline select-none"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Unified Curated Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Styled Informational Guide Banner */}
      <div className="mt-12 p-5 rounded-2xl bg-linear-to-r from-primary-50 to-violet-50 dark:from-primary-950/20 dark:to-violet-950/20 border border-primary-100/40 dark:border-primary-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-4.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-surface-900 flex items-center justify-center shrink-0 border border-surface-150 dark:border-surface-800 shadow-xs">
            <Trash2 className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-surface-550 dark:text-surface-400">
            To remove an item from your wishlist, tap the heart icon on the product card.
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