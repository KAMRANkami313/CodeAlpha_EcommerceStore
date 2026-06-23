import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, SearchX } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import SkeletonGrid from '../common/Skeleton.jsx';
import formatCurrency from '../../utils/formatCurrency.js';
import calculateDiscount from '../../utils/calculateDiscount.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import toast from 'react-hot-toast';
import ProductCard from './ProductCard.jsx';

/**
 * ProductGrid — Editorial Modern Redesign
 *
 * Supports two view modes:
 *   - 'grid' (default) — uses ProductCard
 *   - 'list' — horizontal cards with image + details side-by-side
 *
 * Props (unchanged):
 *   products, loading, view ('grid'|'list'), error, emptyMessage
 */
const ProductListItem = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    try {
      await addToCart(product._id);
      toast.success('Added to cart');
    } catch {
      toast.error('Could not add to cart');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:border-surface-300 dark:hover:border-surface-700 hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link
          to={`/products/${product._id}`}
          className="block relative sm:w-44 lg:w-52 shrink-0 aspect-square sm:aspect-auto overflow-hidden bg-surface-100 dark:bg-surface-800 no-underline img-zoom"
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
              <ShoppingBag className="w-9 h-9 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
            </div>
          )}
          {discount > 0 && (
            <Badge variant="danger" size="xs" className="absolute top-2.5 left-2.5 font-mono">-{discount}%</Badge>
          )}
        </Link>

        {/* Details */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[11px] font-medium text-primary-600 dark:text-primary-400">
              {product.category}
            </p>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product._id); }}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-1.5 rounded-md transition-colors cursor-pointer -mt-1 -mr-1 ${
                wishlisted ? 'text-red-500' : 'text-surface-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          <Link to={`/products/${product._id}`} className="no-underline">
            <h3 className="font-semibold text-surface-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5 line-clamp-2 hidden sm:block leading-relaxed">
              {product.description.replace(/<[^>]+>/g, '')}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            {product.ratings > 0 ? (
              <>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= Math.round(product.ratings) ? 'fill-amber-400 text-amber-400' : 'fill-surface-200 dark:fill-surface-800 text-surface-200 dark:text-surface-800'}`}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span className="text-xs text-surface-500 dark:text-surface-400 tabular-nums">
                  {product.ratings.toFixed(1)} ({product.numOfReviews})
                </span>
              </>
            ) : (
              <span className="text-xs text-surface-400">No reviews yet</span>
            )}
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-surface-900 dark:text-white tabular-nums font-display">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-sm text-surface-400 line-through tabular-nums font-mono">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
              {outOfStock && (
                <Badge variant="default" size="xs" className="ml-1">Sold Out</Badge>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductGrid = ({ products, loading, view = 'grid', error, emptyMessage }) => {
  // Loading state
  if (loading) {
    return view === 'list'
      ? <div className="space-y-3">{Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="shimmer bg-surface-200 dark:bg-surface-800 sm:w-44 lg:w-52 h-44 sm:h-auto" />
              <div className="flex-1 p-5 space-y-2.5">
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-3 w-20 rounded-md" />
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-5 w-3/4 rounded-md" />
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-3 w-full rounded-md" />
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-9 w-32 rounded-lg mt-3" />
              </div>
            </div>
          </div>
        ))}</div>
      : <SkeletonGrid count={8} />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7 text-surface-400" strokeWidth={1.5} />
        </div>
        <p className="text-surface-700 dark:text-surface-300 font-medium">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-surface-100 dark:bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-surface-400" strokeWidth={1.5} />
        </div>
        <p className="text-surface-700 dark:text-surface-300 text-base font-medium">
          {emptyMessage || 'No products found'}
        </p>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  // Render grid or list
  return view === 'list' ? (
    <div className="space-y-3">
      {products.map((product, index) => (
        <ProductListItem key={product._id} product={product} index={index} />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
