import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import StarRating from '../common/StarRating.jsx';
import Badge from '../common/Badge.jsx';
import formatCurrency from '../../utils/formatCurrency.js';
import calculateDiscount from '../../utils/calculateDiscount.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import ROUTES from '../../constants/ROUTES.js';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square bg-surface-100 dark:bg-surface-700 no-underline">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-100 dark:bg-surface-700">
            <ShoppingBag className="w-12 h-12 text-surface-300 dark:text-surface-600" />
          </div>
        )}
        {discount > 0 && (
          <Badge variant="danger" className="absolute top-3 left-3">
            -{discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge variant="primary" className="absolute top-3 right-3">
            Featured
          </Badge>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product._id); }}
          className="absolute bottom-3 right-3 p-2 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-surface-400 dark:text-surface-500 hover:text-red-500'}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{product.category}</p>
        <Link to={`/products/${product._id}`} className="no-underline">
          <h3 className="font-semibold text-surface-800 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.ratings} size={13} />
          <span className="text-xs text-surface-400 dark:text-surface-500">({product.numOfReviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-surface-900 dark:text-white">{formatCurrency(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-sm text-surface-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
            className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">Out of Stock</p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;