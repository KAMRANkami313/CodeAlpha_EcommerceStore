import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, Lock, PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';
import ROUTES from '../../constants/ROUTES.js';

/**
 * OrderSummary — Editorial Modern Redesign
 *
 * Clean card, sentence case, solid total. Same item list and calculations.
 * No props — reads from useCart().
 */
const OrderSummary = () => {
  const { cart } = useCart();
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white font-display">Your Order</h3>
        </div>
        <Link
          to={ROUTES.CART}
          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 no-underline transition-colors flex items-center gap-1"
        >
          <PencilLine className="w-3.5 h-3.5" /> Edit
        </Link>
      </div>

      {/* Item list */}
      <div className="max-h-72 overflow-y-auto pr-1 -mr-1 space-y-3.5 mb-5 scrollbar-hide">
        {cart.items.map((item) => (
          <div key={item.product._id || item.product} className="flex gap-3 items-start">

            {/* Thumbnail */}
            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-surface-50 dark:bg-surface-950 shrink-0 border border-surface-200 dark:border-surface-800">
              {item.image ? (
                <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-surface-300 dark:text-surface-700">
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                </div>
              )}
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary-600 text-white text-[9px] font-bold font-mono flex items-center justify-center border border-white dark:border-surface-900">
                {item.quantity}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-800 dark:text-surface-200 line-clamp-2 leading-snug">
                {item.name}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                {item.color && (
                  <span className="text-[11px] text-surface-500 dark:text-surface-400">{item.color}</span>
                )}
                {item.size && (
                  <span className="text-[11px] text-surface-500 dark:text-surface-400">
                    {item.color && <span className="text-surface-300 dark:text-surface-700">·</span>} Size: {item.size}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="text-xs font-semibold text-surface-900 dark:text-white font-mono tabular-nums leading-snug pt-0.5">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5 py-4 border-t border-surface-200 dark:border-surface-800 text-sm">
        <div className="flex justify-between items-center text-surface-600 dark:text-surface-400">
          <span>Subtotal</span>
          <span className="font-semibold text-surface-900 dark:text-white font-mono tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-surface-600 dark:text-surface-400">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">FREE</span>
          ) : (
            <span className="font-semibold text-surface-900 dark:text-white font-mono tabular-nums">{formatCurrency(shipping)}</span>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-200 dark:border-surface-800">
        <span className="font-semibold text-surface-900 dark:text-white font-display">Total</span>
        <div className="text-right">
          <div className="text-xl font-bold text-surface-900 dark:text-white font-display tabular-nums">{formatCurrency(total)}</div>
          <div className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5">VAT included</div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="mt-5 pt-5 border-t border-surface-200 dark:border-surface-800 space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs text-surface-500 dark:text-surface-400">
          <Lock className="w-4 h-4 text-emerald-500" strokeWidth={2} />
          <span>Secure encrypted checkout</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-surface-500 dark:text-surface-400">
          <Truck className="w-4 h-4 text-primary-500" strokeWidth={2} />
          <span>Ships in 1-2 business days</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-surface-500 dark:text-surface-400">
          <ShieldCheck className="w-4 h-4 text-accent-500" strokeWidth={2} />
          <span>7-day easy nationwide returns</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;