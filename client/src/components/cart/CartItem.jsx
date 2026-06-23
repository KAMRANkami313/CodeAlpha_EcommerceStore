import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';
import ROUTES from '../../constants/ROUTES.js';

/**
 * CartItem — Editorial Modern Redesign
 *
 * Clean rounded-xl card, sentence case meta, refined quantity stepper.
 * Same props, hooks, and logic — fully backward compatible.
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const productId = item.product._id || item.product;
  const qty = item.quantity || 1;
  const lineTotal = item.price * qty;

  // Safely generate the product path to prevent runtime crashes
  let productPath = `/products/${productId}`;
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
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-700 hover:shadow-sm transition-all"
    >
      {/* Image */}
      <Link
        to={productPath}
        className="relative w-full sm:w-20 h-20 rounded-lg overflow-hidden bg-surface-50 dark:bg-surface-950 shrink-0 block img-zoom border border-surface-200 dark:border-surface-800"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-300 dark:text-surface-700">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              to={productPath}
              className="font-medium text-surface-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 no-underline text-sm leading-snug transition-colors"
            >
              {item.name}
            </Link>
            {item.brand && (
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{item.brand}</p>
            )}

            {/* Color / size meta */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              {item.color && (
                <span className="inline-flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
                  <span
                    className="w-3 h-3 rounded-full border border-surface-300 dark:border-surface-700 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.color}
                </span>
              )}
              {item.size && (
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  Size: <span className="font-medium text-surface-700 dark:text-surface-200">{item.size}</span>
                </span>
              )}
            </div>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => removeItem(productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="p-1.5 -mr-1 -mt-1 text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity + price */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-surface-100 dark:border-surface-800">

          {/* Quantity stepper */}
          <div className="inline-flex items-center bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-lg p-0.5 select-none">
            <button
              type="button"
              onClick={() => updateQuantity(productId, Math.max(1, qty - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="p-1.5 rounded-md hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold text-surface-900 dark:text-white font-mono tabular-nums">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(productId, qty + 1)}
              aria-label="Increase quantity"
              className="p-1.5 rounded-md hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-base font-semibold text-surface-900 dark:text-white font-mono tabular-nums leading-tight">
              {formatCurrency(lineTotal)}
            </div>
            {qty > 1 && (
              <div className="text-xs text-surface-400 dark:text-surface-500 font-mono tabular-nums mt-0.5">
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