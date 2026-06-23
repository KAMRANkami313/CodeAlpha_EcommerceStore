import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  Check,
  ArrowRight,
  Gift,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import Button from '../common/Button.jsx';
import ROUTES from '../../constants/ROUTES.js';

const FREE_SHIPPING_THRESHOLD = 5000;
const FLAT_SHIPPING = 150;

/**
 * CartSummary — Editorial Modern Redesign
 *
 * Clean card, sentence case, solid primary CTA. Same promo logic,
 * free shipping threshold, and trust badges.
 *
 * Props (unchanged): cart
 */
const CartSummary = ({ cart }) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoStatus, setPromoStatus] = useState(null);

  const subtotal = cart.totalPrice;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.rate) : 0;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    const validCodes = {
      WELCOME10: { code: 'WELCOME10', rate: 0.1, label: '10% off' },
      SAVE15: { code: 'SAVE15', rate: 0.15, label: '15% off' },
      FREESHIP: { code: 'FREESHIP', rate: 0, label: 'Free shipping', freeShip: true },
    };
    if (validCodes[code]) {
      setAppliedPromo(validCodes[code]);
      setPromoStatus('applied');
    } else {
      setAppliedPromo(null);
      setPromoStatus('invalid');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoStatus(null);
    setPromoCode('');
  };

  const effectiveShipping = appliedPromo?.freeShip ? 0 : shipping;
  const finalTotal = subtotal + effectiveShipping - discount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
          <ShoppingBag className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white font-display">Order Summary</h3>
      </div>

      {/* Free shipping progress */}
      <div className="mb-5 p-3 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2 text-xs font-medium text-surface-600 dark:text-surface-300 mb-2">
          <Truck className={`w-4 h-4 shrink-0 ${remaining === 0 ? 'text-emerald-500' : 'text-primary-500'}`} />
          {remaining === 0 ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Free shipping unlocked!
            </span>
          ) : (
            <span>
              Add <span className="font-semibold text-surface-900 dark:text-white font-mono tabular-nums">{formatCurrency(remaining)}</span> for free delivery
            </span>
          )}
        </div>

        <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full ${remaining === 0 ? 'bg-emerald-500' : 'bg-primary-500'}`}
          />
        </div>
      </div>

      {/* Promo code */}
      <div className="mb-5">
        <label className="text-xs font-medium text-surface-600 dark:text-surface-300 mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-surface-400" /> Promo Code
        </label>

        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-xs font-semibold font-mono">{appliedPromo.code}</div>
                <div className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5">{appliedPromo.label} applied</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemovePromo}
              className="p-1 rounded-md text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              aria-label="Remove promo code"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoStatus(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
              placeholder="WELCOME10"
              className="flex-1 px-3 py-2 border border-surface-200 dark:border-surface-800 rounded-lg bg-surface-50 dark:bg-surface-950 text-sm font-mono uppercase text-surface-900 dark:text-white placeholder:text-surface-400 placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 transition-all"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        )}

        <AnimatePresence>
          {promoStatus === 'invalid' && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-500 mt-1.5"
            >
              Invalid promo code. Try WELCOME10 or SAVE15.
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-2">
          Try: <span className="font-mono text-primary-600 dark:text-primary-400">WELCOME10</span>, <span className="font-mono text-primary-600 dark:text-primary-400">SAVE15</span>
        </p>
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-2.5 text-sm pb-4 border-b border-surface-200 dark:border-surface-800">
        <div className="flex justify-between items-center text-surface-600 dark:text-surface-400">
          <span>Subtotal ({cart.totalQuantity} items)</span>
          <span className="font-semibold tabular-nums font-mono text-surface-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-surface-600 dark:text-surface-400">
          <span>Delivery</span>
          {effectiveShipping === 0 ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">FREE</span>
          ) : (
            <span className="font-semibold tabular-nums font-mono text-surface-900 dark:text-white">{formatCurrency(effectiveShipping)}</span>
          )}
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5 text-sm">
              <Gift className="w-3.5 h-3.5" /> Discount ({appliedPromo?.code})
            </span>
            <span className="tabular-nums font-mono font-semibold">−{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 mb-5">
        <span className="font-semibold text-surface-900 dark:text-white font-display">Total</span>
        <div className="text-right">
          <div className="text-xl font-bold text-surface-900 dark:text-white tabular-nums font-display">{formatCurrency(finalTotal)}</div>
          <div className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5">VAT included</div>
        </div>
      </div>

      {/* Checkout CTA */}
      <Link to={ROUTES.CHECKOUT} className="block no-underline">
        <Button variant="primary" size="lg" className="w-full" iconRight={ArrowRight}>
          Proceed to Checkout
        </Button>
      </Link>

      <Link
        to={ROUTES.PRODUCTS}
        className="mt-3 block text-center text-xs font-medium text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors no-underline"
      >
        or Continue Shopping
      </Link>

      {/* Trust badges */}
      <div className="mt-5 pt-5 border-t border-surface-200 dark:border-surface-800 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-surface-50 dark:bg-surface-950/30">
          <ShieldCheck className="w-4 h-4 text-emerald-500" strokeWidth={2} />
          <span className="text-[10px] font-medium text-surface-500 dark:text-surface-400 leading-tight">Secure<br />Checkout</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-surface-50 dark:bg-surface-950/30">
          <RotateCcw className="w-4 h-4 text-primary-500" strokeWidth={2} />
          <span className="text-[10px] font-medium text-surface-500 dark:text-surface-400 leading-tight">14-Day<br />Returns</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-surface-50 dark:bg-surface-950/30">
          <Truck className="w-4 h-4 text-accent-500" strokeWidth={2} />
          <span className="text-[10px] font-medium text-surface-500 dark:text-surface-400 leading-tight">Express<br />Shipping</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;