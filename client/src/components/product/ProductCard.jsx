import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import formatCurrency from '../../utils/formatCurrency.js';
import calculateDiscount from '../../utils/calculateDiscount.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import toast from 'react-hot-toast';

/**
 * ProductCard — Premium Redesign
 * Premium hover lift, image shine, animated badges, gradient hairline on hover.
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
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4 }}
      className="group relative bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden card-premium hover:border-primary-200 dark:hover:border-primary-700"
    >
      {/* Image */}
      <Link
        to={`/products/${product._id}`}
        className="block relative overflow-hidden aspect-square bg-surface-100 dark:bg-surface-800 no-underline img-zoom"
      >
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
          </div>
        )}

        {/* Top-left badges stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge variant="danger" size="xs">-{discount}%</Badge>
            </motion.span>
          )}
          {product.featured && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Badge variant="primary" size="xs" dot>Featured</Badge>
            </motion.span>
          )}
          {outOfStock && (
            <Badge variant="default" size="xs" className="bg-surface-900/80 text-white dark:bg-surface-100/90 dark:text-surface-900 backdrop-blur-sm">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Wishlist button — always visible */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
            wishlisted
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-surface-900/80 text-surface-500 dark:text-surface-400 hover:bg-white hover:text-red-500 dark:hover:bg-surface-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </motion.button>

        {/* Subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-surface-950/0 group-hover:bg-surface-950/10 transition-colors duration-300 pointer-events-none" />

        {/* Quick-add overlay button (desktop hover) */}
        {!outOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block z-10">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md text-surface-900 dark:text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-600 hover:text-white transition-all shadow-md cursor-pointer shine-effect"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 relative">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide truncate">
            {product.category}
          </p>
          {product.ratings > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">
                {product.ratings.toFixed(1)}
              </span>
              <span className="text-xs text-surface-400">({product.numOfReviews})</span>
            </div>
          )}
        </div>

        <Link to={`/products/${product._id}`} className="no-underline">
          <h3 className="font-semibold text-surface-800 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors min-h-10">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-3 gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-surface-900 dark:text-white tabular-nums font-display">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-surface-400 line-through tabular-nums">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            {lowStock && (
              <span className="text-2xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Mobile add-to-cart */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label="Add to cart"
            className="sm:hidden p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;