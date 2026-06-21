import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';
import ROUTES from '../../constants/ROUTES.js';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const productId = item.product._id || item.product;
  const qty = item.quantity || 1;
  const lineTotal = item.price * qty;

  // Safely generate the product path to prevent runtime crashes
  let productPath = `/products/${productId}`; // safe default fallback
  if (ROUTES && ROUTES.PRODUCT_DETAIL) {
    if (typeof ROUTES.PRODUCT_DETAIL === 'function') {
      productPath = ROUTES.PRODUCT_DETAIL(productId);
    } else if (typeof ROUTES.PRODUCT_DETAIL === 'string') {
      productPath = ROUTES.PRODUCT_DETAIL.replace(':id', productId);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border border-surface-100 dark:border-surface-700 bg-white dark:bg-surface-800 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-premium transition-all duration-300"
    >
      {/* Image */}
      <Link
        to={productPath}
        className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-700 shrink-0 block img-zoom"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-300 dark:text-surface-600">
            <ShoppingBag className="w-7 h-7" />
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              to={productPath}
              className="font-semibold text-surface-800 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {item.name}
            </Link>
            {item.brand && (
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{item.brand}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              {item.color && (
                <span className="inline-flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
                  <span className="w-3 h-3 rounded-full border border-surface-200 dark:border-surface-600" style={{ backgroundColor: item.color }} />
                  {item.color}
                </span>
              )}
              {item.size && (
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  Size: <span className="font-medium text-surface-700 dark:text-surface-300">{item.size}</span>
                </span>
              )}
            </div>
          </div>

          {/* Remove button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => removeItem(productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="p-2 -mr-1 -mt-1 text-surface-400 dark:text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Bottom row: stepper + price */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-3">
          {/* Quantity Stepper */}
          <div className="inline-flex items-center bg-surface-50 dark:bg-surface-700/60 border border-surface-200 dark:border-surface-600 rounded-full overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => updateQuantity(productId, Math.max(1, qty - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="p-2 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5 text-surface-700 dark:text-surface-300" />
            </motion.button>
            <span className="min-w-8 text-center text-sm font-semibold text-surface-900 dark:text-white tabular-nums">
              {qty}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => updateQuantity(productId, qty + 1)}
              aria-label="Increase quantity"
              className="p-2 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-surface-700 dark:text-surface-300" />
            </motion.button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-sm font-bold text-surface-900 dark:text-white tabular-nums">
              {formatCurrency(lineTotal)}
            </div>
            {qty > 1 && (
              <div className="text-xs text-surface-400 dark:text-surface-500 tabular-nums">
                {formatCurrency(item.price)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;