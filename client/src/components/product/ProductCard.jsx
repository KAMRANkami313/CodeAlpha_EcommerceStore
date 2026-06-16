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
 * ProductCard — Phase 9 redesigned
 *
 * Cleaner image area, hover lift, quick-add overlay button,
 * wishlist heart always visible (no longer hover-only),
 * star rating inline with numeric, better price layout.
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
      className="group relative bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden card-hover hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-large"
    >
      {/* Image */}
      <Link
        to={`/products/${product._id}`}
        className="block relative overflow-hidden aspect-square bg-surface-100 dark:bg-surface-800 no-underline"
      >
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
          </div>
        )}

        {/* Top-left badges stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="danger" size="xs">-{discount}%</Badge>
          )}
          {product.featured && (
            <Badge variant="primary" size="xs" dot>Featured</Badge>
          )}
          {outOfStock && (
            <Badge variant="default" size="xs" className="bg-surface-900/80 text-white dark:bg-surface-100/90 dark:text-surface-900 backdrop-blur-sm">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Wishlist button — always visible */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            wishlisted
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-surface-900/80 text-surface-500 dark:text-surface-400 hover:bg-white hover:text-red-500 dark:hover:bg-surface-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick-add overlay button (desktop hover) */}
        {!outOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md text-surface-900 dark:text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-600 hover:text-white transition-colors shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
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
              <span className="text-lg font-bold text-surface-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-surface-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            {lowStock && (
              <span className="text-2xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Mobile add-to-cart (always visible since hover doesn't work on touch) */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label="Add to cart"
            className="sm:hidden p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;