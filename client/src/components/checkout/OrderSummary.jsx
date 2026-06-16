import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';
import ROUTES from '../../constants/ROUTES.js';

const OrderSummary = () => {
  const { cart } = useCart();
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 5000 ? 0 : 150;
  const total = subtotal + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 sticky top-24 shadow-soft"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-surface-800 dark:text-white">Your Order</h3>
        </div>
        <Link
          to={ROUTES.CART}
          className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          Edit
        </Link>
      </div>

      {/* Itemized list with thumbnails */}
      <div className="max-h-72 overflow-y-auto pr-1 -mr-1 space-y-3 mb-4 scrollbar-thin">
        {cart.items.map((item) => (
          <div key={item.product._id || item.product} className="flex gap-3 items-start">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-700 shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              ) : null}
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-700 dark:text-surface-200 line-clamp-2 leading-tight">
                {item.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {item.color && (
                  <span className="text-[10px] text-surface-400 dark:text-surface-500">{item.color}</span>
                )}
                {item.size && (
                  <span className="text-[10px] text-surface-400 dark:text-surface-500">· {item.size}</span>
                )}
              </div>
            </div>
            <div className="text-xs font-semibold text-surface-900 dark:text-white whitespace-nowrap">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="space-y-2 py-3 border-t border-dashed border-surface-200 dark:border-surface-700 text-sm">
        <div className="flex justify-between">
          <span className="text-surface-500 dark:text-surface-400">Subtotal</span>
          <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-500 dark:text-surface-400">Shipping</span>
          {shipping === 0 ? (
            <span className="font-semibold text-success">FREE</span>
          ) : (
            <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(shipping)}</span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-baseline pt-3 border-t border-surface-200 dark:border-surface-700">
        <span className="font-semibold text-surface-800 dark:text-white">Total</span>
        <div className="text-right">
          <div className="text-xl font-bold gradient-text-brand">{formatCurrency(total)}</div>
          <div className="text-[10px] text-surface-400 dark:text-surface-500">Incl. all taxes</div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700 space-y-2">
        <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          <Lock className="w-3.5 h-3.5 text-success" />
          <span>Encrypted &amp; secure checkout</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          <Truck className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <span>Ships in 1-2 business days</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-500" />
          <span>7-day easy returns</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;