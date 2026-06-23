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
 * ProductCard — Editorial Modern Redesign
 *
 * Single clean card with subtle border + hover shadow. No stacked effects.
 * Same props, hooks, handlers, and logic — fully backward compatible.
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:border-surface-300 dark:hover:border-surface-700 hover:shadow-md transition-all duration-300"
    >
      {/* ─── Image ─── */}
      <Link
        to={`/products/${product._id}`}
        className="block relative overflow-hidden aspect-square bg-surface-50 dark:bg-surface-950 no-underline img-zoom"
      >
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-50 dark:bg-surface-950">
            <ShoppingBag className="w-10 h-10 text-surface-300 dark:text-surface-800" strokeWidth={1.5} />
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 select-none">
          {discount > 0 && (
            <Badge variant="danger" size="xs" className="font-semibold font-mono">
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge variant="primary" size="xs" className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </Badge>
          )}
          {outOfStock && (
            <Badge variant="default" size="xs" className="bg-surface-950/90 text-white dark:bg-surface-100/90 dark:text-surface-950">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 cursor-pointer z-10 ${
            wishlisted
              ? 'bg-red-500 text-white shadow-sm'
              : 'bg-white/90 dark:bg-surface-900/90 text-surface-500 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-800 hover:text-red-500 border border-surface-200/60 dark:border-surface-700/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick add (desktop hover) */}
        {!outOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block z-10">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-white dark:bg-surface-900 text-surface-900 dark:text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 border border-surface-200 dark:border-surface-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* ─── Info ─── */}
      <div className="p-3.5">
        {/* Category + rating row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-[11px] font-medium text-primary-600 dark:text-primary-400 truncate">
            {product.category}
          </p>
          {product.ratings > 0 && (
            <div className="flex items-center gap-1 shrink-0 bg-surface-50 dark:bg-surface-950 px-1.5 py-0.5 rounded-md border border-surface-100 dark:border-surface-800">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-surface-700 dark:text-surface-200 font-mono tabular-nums">
                {product.ratings.toFixed(1)}
              </span>
              <span className="text-[10px] text-surface-400 dark:text-surface-500 tabular-nums">({product.numOfReviews})</span>
            </div>
          )}
        </div>

        {/* Name */}
        <Link to={`/products/${product._id}`} className="no-underline">
          <h3 className="font-medium text-surface-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors min-h-10">
            {product.name}
          </h3>
        </Link>

        {/* Price + mobile add */}
        <div className="flex items-end justify-between mt-2.5 gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold text-surface-900 dark:text-white tabular-nums font-display">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-surface-400 dark:text-surface-500 line-through tabular-nums font-mono">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            {lowStock && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Mobile add button */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label="Add to cart"
            className="sm:hidden p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 flex items-center justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;