import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import SkeletonGrid, { SkeletonCard } from '../common/Skeleton.jsx';
import formatCurrency from '../../utils/formatCurrency.js';
import calculateDiscount from '../../utils/calculateDiscount.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import toast from 'react-hot-toast';
import ProductCard from './ProductCard.jsx';

/**
 * ProductGrid — Phase 9 upgraded
 *
 * Supports two view modes:
 *   - 'grid' (default) — uses ProductCard
 *   - 'list' — horizontal cards with image + details side-by-side
 *
 * Props:
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
      className="group bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden card-hover hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-medium"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link
          to={`/products/${product._id}`}
          className="block relative sm:w-48 lg:w-56 shrink-0 aspect-square sm:aspect-auto overflow-hidden bg-surface-100 dark:bg-surface-800 no-underline"
        >
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-surface-300 dark:text-surface-700" />
            </div>
          )}
          {discount > 0 && (
            <Badge variant="danger" size="xs" className="absolute top-3 left-3">-{discount}%</Badge>
          )}
        </Link>

        {/* Details */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              {product.category}
            </p>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product._id); }}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer -mt-1 -mr-1 ${
                wishlisted ? 'text-red-500' : 'text-surface-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          <Link to={`/products/${product._id}`} className="no-underline">
            <h3 className="font-bold text-surface-900 dark:text-white text-base lg:text-lg leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 line-clamp-2 hidden sm:block">
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
                      className={`w-3.5 h-3.5 ${s <= Math.round(product.ratings) ? 'fill-amber-400 text-amber-400' : 'text-surface-300 dark:text-surface-700'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  {product.ratings.toFixed(1)} ({product.numOfReviews})
                </span>
              </>
            ) : (
              <span className="text-xs text-surface-400">No reviews yet</span>
            )}
          </div>

          <div className="mt-auto pt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-surface-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-sm text-surface-400 line-through">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
  if (loading) {
    return view === 'list'
      ? <div className="space-y-4">{Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="shimmer bg-surface-200 dark:bg-surface-800 sm:w-48 lg:w-56 h-48 sm:h-auto" />
              <div className="flex-1 p-5 space-y-3">
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-3 w-20 rounded" />
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-5 w-3/4 rounded" />
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-3 w-full rounded" />
                <div className="shimmer bg-surface-200 dark:bg-surface-800 h-10 w-32 rounded-xl mt-4" />
              </div>
            </div>
          </div>
        ))}</div>
      : <SkeletonGrid count={8} />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-surface-700 dark:text-surface-300 font-medium">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 text-surface-300 dark:text-surface-600" strokeWidth={1.5} />
        </div>
        <p className="text-surface-700 dark:text-surface-300 text-lg font-medium">
          {emptyMessage || 'No products found'}
        </p>
        <p className="text-surface-400 dark:text-surface-500 text-sm mt-1">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return view === 'list' ? (
    <div className="space-y-4">
      {products.map((product, index) => (
        <ProductListItem key={product._id} product={product} index={index} />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
