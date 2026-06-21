import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
  Check,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import Button from '../common/Button.jsx';
import ROUTES from '../../constants/ROUTES.js';

const FREE_SHIPPING_THRESHOLD = 5000;
const FLAT_SHIPPING = 150;

const CartSummary = ({ cart }) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoStatus, setPromoStatus] = useState(null); // 'applied' | 'invalid' | null

  const subtotal = cart.totalPrice;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const discount = appliedPromo ? Math.round(subtotal * appliedPromo.rate) : 0;
  const total = subtotal + shipping - discount;

  // Free shipping progress
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    // Demo promos — purely client-side cosmetic
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 sticky top-24 shadow-soft"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-bold text-surface-800 dark:text-white">Order Summary</h3>
      </div>

      {/* Free shipping progress bar */}
      <div className="mb-5 p-3 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
        <div className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-300 mb-2">
          <Truck className={`w-4 h-4 ${remaining === 0 ? 'text-success' : 'text-primary-600 dark:text-primary-400'}`} />
          {remaining === 0 ? (
            <span className="font-medium text-success">You unlocked FREE shipping!</span>
          ) : (
            <span>
              Add <span className="font-bold text-surface-900 dark:text-white">{formatCurrency(remaining)}</span> more for free shipping
            </span>
          )}
        </div>
        <div className="h-1.5 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${remaining === 0 ? 'bg-success' : 'bg-linear-to-r from-primary-500 to-primary-700'}`}
          />
        </div>
      </div>

      {/* FIX: Demo-only warning when a promo code is applied */}
      {appliedPromo && (
        <div className="mb-4 p-2.5 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-surface-600 dark:text-surface-300">
            <span className="font-semibold">Demo only</span> — promo discounts shown here are for preview and will be applied at checkout.
          </p>
        </div>
      )}

      {/* Promo code input */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-surface-600 dark:text-surface-300 mb-1.5 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> Promo Code
        </label>
        {appliedPromo ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-success/10 border border-success/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-success">{appliedPromo.code}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400">{appliedPromo.label}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemovePromo}
              className="text-xs text-surface-500 hover:text-red-500 font-medium cursor-pointer px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Remove
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
              className="flex-1 px-3 py-2 text-sm border border-surface-200 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase tracking-wider"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-600 cursor-pointer transition-colors"
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
              className="text-xs text-danger mt-1.5"
            >
              Invalid promo code. Try WELCOME10 or SAVE15.
            </motion.p>
          )}
        </AnimatePresence>
        <p className="text-[10px] text-surface-400 dark:text-surface-500 mt-1.5">
          Try: WELCOME10, SAVE15, FREESHIP
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5 text-sm pb-4 border-b border-dashed border-surface-200 dark:border-surface-700">
        <div className="flex justify-between">
          <span className="text-surface-500 dark:text-surface-400">Subtotal ({cart.totalQuantity} items)</span>
          <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-500 dark:text-surface-400">Shipping</span>
          {effectiveShipping === 0 ? (
            <span className="font-semibold text-success">FREE</span>
          ) : (
            <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(effectiveShipping)}</span>
          )}
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Discount ({appliedPromo?.code})
            </span>
            <span className="font-medium">−{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-baseline pt-4 mb-5">
        <span className="font-semibold text-surface-800 dark:text-white">Total</span>
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text-brand">{formatCurrency(finalTotal)}</div>
          <div className="text-[10px] text-surface-400 dark:text-surface-500">Incl. all taxes</div>
        </div>
      </div>

      {/* Checkout CTA */}
      <Link to={ROUTES.CHECKOUT} className="block no-underline">
        <Button variant="gradient" size="lg" className="w-full" iconRight={ArrowRight}>
          Proceed to Checkout
        </Button>
      </Link>

      <Link
        to={ROUTES.PRODUCTS}
        className="mt-3 block text-center text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        or Continue Shopping
      </Link>

      {/* Trust badges */}
      <div className="mt-6 pt-5 border-t border-surface-100 dark:border-surface-700 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-5 h-5 text-success" />
          <span className="text-[10px] text-surface-500 dark:text-surface-400 leading-tight">Secure<br />Payment</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-[10px] text-surface-500 dark:text-surface-400 leading-tight">Easy<br />Returns</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Truck className="w-5 h-5 text-accent-500" />
          <span className="text-[10px] text-surface-500 dark:text-surface-400 leading-tight">Fast<br />Delivery</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;