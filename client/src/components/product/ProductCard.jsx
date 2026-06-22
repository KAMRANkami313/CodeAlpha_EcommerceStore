import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Sparkles } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import formatCurrency from '../../utils/formatCurrency.js';
import calculateDiscount from '../../utils/calculateDiscount.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import toast from 'react-hot-toast';

/**
 * ProductCard — Premium Redesign
 * Elevated hover transitions, high-blur glass overlays, micro-interactive badges, and layout harmony.
 */
const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product._id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    try {
      await addToCart(product._id);
      toast.success(`${product.name.slice(0, 30)}${product.name.length > 30 ? '…' : ''} added to cart`);
    } catch (err) {
      toast.error('Could not add to cart');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/60 dark:border-surface-800/50 overflow-hidden card-premium hover:border-primary-200/80 dark:hover:border-primary-800/80 shadow-premium card-gleam"
    >
      {/* Product Image Panel */}
      <Link
        to={`/products/${product._id}`}
        className="block relative overflow-hidden aspect-square bg-surface-50 dark:bg-surface-950 no-underline img-zoom"
      >
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-50 dark:bg-surface-950">
            <ShoppingBag className="w-12 h-12 text-surface-300 dark:text-surface-800" strokeWidth={1} />
          </div>
        )}

        {/* Top-left Badges Stack */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-2 z-10 select-none">
          {discount > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="danger" size="xs" className="font-bold font-mono tracking-wider">
                -{discount}%
              </Badge>
            </motion.div>
          )}
          {product.featured && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-center"
            >
              <Badge variant="primary" size="xs" className="font-bold tracking-wide flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </Badge>
            </motion.div>
          )}
          {outOfStock && (
            <Badge variant="default" size="xs" className="bg-surface-950/90 text-white dark:bg-surface-100/90 dark:text-surface-950 font-bold tracking-wide backdrop-blur-md border border-white/10">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Wishlist Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer z-10 ${
            wishlisted
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/90 dark:bg-surface-900/95 text-surface-500 dark:text-surface-400 hover:bg-white hover:text-red-500 dark:hover:bg-surface-850 border border-surface-200/10'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-300 ${wishlisted ? 'fill-white scale-110' : 'group-hover:scale-110'}`} />
        </motion.button>

        {/* Subtle Dark Layer Overlay */}
        <div className="absolute inset-0 bg-surface-950/0 group-hover:bg-surface-950/15 transition-colors duration-500 pointer-events-none" />

        {/* Quick Add Slide-Up Overlay (Desktop) */}
        {!outOfStock && (
          <div className="absolute inset-x-3.5 bottom-3.5 translate-y-3.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block z-10">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md text-surface-900 dark:text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-surface-200/20 dark:border-surface-800/30 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 hover:border-transparent dark:hover:border-transparent transition-all duration-300 shadow-md cursor-pointer shine-effect"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Info Panel */}
      <div className="p-4 relative bg-white dark:bg-surface-900">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-2xs font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-widest truncate">
            {product.category}
          </p>
          {product.ratings > 0 && (
            <div className="flex items-center gap-1 shrink-0 bg-surface-50 dark:bg-surface-950 px-2 py-0.5 rounded-full border border-surface-100 dark:border-surface-800/40">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-surface-800 dark:text-surface-200 font-mono">
                {product.ratings.toFixed(1)}
              </span>
              <span className="text-[10px] font-semibold text-surface-400 dark:text-surface-500">({product.numOfReviews})</span>
            </div>
          )}
        </div>

        <Link to={`/products/${product._id}`} className="no-underline">
          <h3 className="font-semibold text-surface-800 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 min-h-10">
            {product.name}
          </h3>
        </Link>

        {/* Pricing & Stock Management */}
        <div className="flex items-end justify-between mt-3 gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-surface-900 dark:text-white tabular-nums font-display">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-surface-400 dark:text-surface-500 line-through tabular-nums font-mono">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            {lowStock && (
              <span className="text-2xs text-amber-600 dark:text-amber-400 font-bold mt-1.5 flex items-center gap-1.5 select-none bg-amber-500/5 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse-ring shrink-0" />
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Mobile Add-To-Cart Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label="Add to cart"
            className="sm:hidden p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm flex items-center justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;