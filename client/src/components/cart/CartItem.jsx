import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';
import ROUTES from '../../constants/ROUTES.js';

/**
 * CartItem — Premium Redesign
 *
 * A high-fidelity cart tile featuring elegant, tactile layout properties, polished
 * text line heights, micro-steppers, and strict spacing.
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const productId = item.product._id || item.product;
  const qty = item.quantity || 1;
  const lineTotal = item.price * qty;

  // Safely generate the product path to prevent runtime crashes (original robust logic)
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
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 rounded-3xl border border-surface-200/60 dark:border-surface-800/50 bg-white dark:bg-surface-900 hover:border-primary-200/80 dark:hover:border-primary-800/80 hover:shadow-premium transition-all duration-300 card-gleam"
    >
      {/* Product Image Frame */}
      <Link
        to={productPath}
        className="relative w-full sm:w-24 h-24 rounded-2xl overflow-hidden bg-surface-50 dark:bg-surface-950 shrink-0 block img-zoom border border-surface-200/35 dark:border-surface-800/30"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-300 dark:text-surface-700">
            <ShoppingBag className="w-6 h-6" />
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              to={productPath}
              className="font-bold text-surface-800 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 no-underline text-sm sm:text-base leading-snug transition-colors"
            >
              {item.name}
            </Link>
            {item.brand && (
              <p className="text-2xs font-extrabold uppercase tracking-widest text-surface-400 dark:text-surface-500 mt-1">{item.brand}</p>
            )}
            
            {/* Meta Properties Badges */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
              {item.color && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 dark:text-surface-400 bg-surface-50 dark:bg-surface-950 px-2.5 py-1 rounded-lg border border-surface-200/40 dark:border-surface-800/30">
                  <span 
                    className="w-3 h-3 rounded-full border border-surface-300 dark:border-surface-700 shrink-0 shadow-xs" 
                    style={{ backgroundColor: item.color }} 
                  />
                  {item.color}
                </span>
              )}
              {item.size && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-surface-500 dark:text-surface-400 bg-surface-50 dark:bg-surface-950 px-2.5 py-1 rounded-lg border border-surface-200/40 dark:border-surface-800/30">
                  Size: <span className="font-bold text-surface-700 dark:text-surface-200">{item.size}</span>
                </span>
              )}
            </div>
          </div>

          {/* Remove Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => removeItem(productId)}
            aria-label={`Remove ${item.name} from cart`}
            className="p-2 -mr-1 -mt-1 text-surface-400 dark:text-surface-500 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/15 rounded-xl transition-all cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Stepper + Total Price Row */}
        <div className="flex items-center justify-between gap-3 mt-4 sm:mt-auto pt-3 border-t border-dashed border-surface-150 dark:border-surface-800/40">
          
          {/* Quantity Stepper Capsule */}
          <div className="inline-flex items-center bg-surface-50 dark:bg-surface-950 border border-surface-200/60 dark:border-surface-800/50 rounded-full p-1 shadow-inner select-none">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => updateQuantity(productId, Math.max(1, qty - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-850 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.button>
            <span className="min-w-8 text-center text-xs font-bold text-surface-900 dark:text-white font-mono tabular-nums">
              {qty}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => updateQuantity(productId, qty + 1)}
              aria-label="Increase quantity"
              className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-850 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.button>
          </div>

          {/* Price breakdown */}
          <div className="text-right">
            <div className="text-base font-extrabold text-surface-900 dark:text-white font-mono tabular-nums leading-tight">
              {formatCurrency(lineTotal)}
            </div>
            {qty > 1 && (
              <div className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase font-mono tracking-wide mt-1 select-none">
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