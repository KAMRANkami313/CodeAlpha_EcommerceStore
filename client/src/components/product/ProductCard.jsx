import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import StarRating from '../common/StarRating.jsx';
import Badge from '../common/Badge.jsx';
import formatCurrency from '../../utils/formatCurrency.js';
import calculateDiscount from '../../utils/calculateDiscount.js';
import useCart from '../../hooks/useCart.js';
import ROUTES from '../../constants/ROUTES.js';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const discount = calculateDiscount(product.price, product.compareAtPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square bg-surface-100 no-underline">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-100">
            <ShoppingBag className="w-12 h-12 text-surface-300" />
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
          onClick={(e) => { e.preventDefault(); }}
          className="absolute bottom-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 cursor-pointer"
        >
          <Heart className="w-4 h-4 text-surface-400 hover:text-red-500" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.category}</p>
        <Link to={`/products/${product._id}`} className="no-underline">
          <h3 className="font-semibold text-surface-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.ratings} size={13} />
          <span className="text-xs text-surface-400">({product.numOfReviews})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-surface-900">{formatCurrency(product.price)}</span>
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
          <p className="text-xs text-amber-600 mt-2 font-medium">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-600 mt-2 font-medium">Out of Stock</p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;