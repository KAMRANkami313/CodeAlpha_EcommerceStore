import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck, Lock, PencilLine } from 'lucide-react';
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
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850 p-6 shadow-premium overflow-hidden relative"
    >
      {/* Premium subtle top gradient border highlight */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary-500/30 to-transparent" />

      {/* Header Panel */}
      <div className="flex items-center justify-between mb-5 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/20">
            <ShoppingBag className="w-4.5 h-4.5 text-primary-600 dark:text-primary-450" />
          </div>
          <h3 className="text-sm font-black text-surface-900 dark:text-white uppercase tracking-wider font-display">Your Order</h3>
        </div>
        <Link
          to={ROUTES.CART}
          className="text-2xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 no-underline transition-colors flex items-center gap-1.5"
        >
          <PencilLine className="w-3.5 h-3.5" /> Edit
        </Link>
      </div>

      {/* Itemized list with thumbnails */}
      <div className="max-h-72 overflow-y-auto pr-1 -mr-1.5 space-y-4 mb-5 scrollbar-hide">
        {cart.items.map((item) => (
          <div key={item.product._id || item.product} className="flex gap-3.5 items-start">
            
            {/* Thumbnail Frame */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-950 shrink-0 border border-surface-150 dark:border-surface-850 select-none">
              {item.image ? (
                <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-surface-300 dark:text-surface-700">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
              
              {/* Count Overlay Badge */}
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-primary-600 text-white text-[9px] font-black font-mono flex items-center justify-center border border-white dark:border-surface-900 shadow-sm">
                {item.quantity}
              </span>
            </div>
            
            {/* Details info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 line-clamp-2 leading-snug">
                {item.name}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 select-none">
                {item.color && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500">{item.color}</span>
                )}
                {item.size && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 flex items-center gap-1">
                    <span className="text-surface-300 dark:text-surface-700">·</span> Size: {item.size}
                  </span>
                )}
              </div>
            </div>
            
            {/* Pricing Total */}
            <div className="text-xs font-black text-surface-900 dark:text-white font-mono tabular-nums leading-snug pt-0.5 pl-2">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Breakdown */}
      <div className="space-y-3.5 py-4 border-t border-dashed border-surface-150 dark:border-surface-850 text-xs select-none">
        <div className="flex justify-between items-center font-semibold text-surface-500 dark:text-surface-455">
          <span>Subtotal</span>
          <span className="font-black text-surface-800 dark:text-white font-mono tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center font-semibold text-surface-500 dark:text-surface-455">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="font-extrabold text-[10px] text-success bg-success-soft/20 px-2 py-0.5 rounded-md uppercase tracking-wider select-none">FREE</span>
          ) : (
            <span className="font-black text-surface-800 dark:text-white font-mono tabular-nums">{formatCurrency(shipping)}</span>
          )}
        </div>
      </div>

      {/* Total panel block */}
      <div className="flex justify-between items-center pt-4 border-t border-surface-150 dark:border-surface-850">
        <span className="font-bold text-surface-900 dark:text-white font-display text-sm uppercase tracking-wider select-none">Order Total</span>
        <div className="text-right">
          <div className="text-xl font-black gradient-text-brand font-display tabular-nums">{formatCurrency(total)}</div>
          <div className="text-[10px] font-bold text-surface-400 dark:text-surface-555 uppercase tracking-widest mt-0.5 select-none">VAT Included</div>
        </div>
      </div>

      {/* Secure trust indicators list */}
      <div className="mt-5 pt-5 border-t border-surface-150 dark:border-surface-850 space-y-3.5 select-none">
        <div className="flex items-center gap-2.5 text-3xs font-extrabold uppercase tracking-widest text-surface-500 dark:text-surface-400 leading-none">
          <Lock className="w-4 h-4 text-success stroke-[2.2]" />
          <span>Secure Encrypted checkout</span>
        </div>
        <div className="flex items-center gap-2.5 text-3xs font-extrabold uppercase tracking-widest text-surface-500 dark:text-surface-400 leading-none">
          <Truck className="w-4 h-4 text-primary-500 stroke-[2.2]" />
          <span>Ships in 1-2 Business Days</span>
        </div>
        <div className="flex items-center gap-2.5 text-3xs font-extrabold uppercase tracking-widest text-surface-500 dark:text-surface-400 leading-none">
          <ShieldCheck className="w-4 h-4 text-accent-500 stroke-[2.2]" />
          <span>7-Day Easy Nationwide Returns</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;