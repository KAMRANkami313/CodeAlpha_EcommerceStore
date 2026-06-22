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
  AlertTriangle,
  Gift,
  X,
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850 p-6 shadow-premium overflow-hidden relative"
    >
      {/* Premium subtle top gradient border highlight */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary-500/30 to-transparent" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 select-none">
        <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/20">
          <ShoppingBag className="w-4.5 h-4.5 text-primary-600 dark:text-primary-450" />
        </div>
        <h3 className="text-sm font-black text-surface-900 dark:text-white uppercase tracking-wider font-display">Order Summary</h3>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="mb-6 p-4 rounded-2xl bg-surface-50 dark:bg-surface-950/40 border border-surface-150 dark:border-surface-850 select-none">
        <div className="flex items-center gap-2 text-2xs font-extrabold text-surface-500 uppercase tracking-widest mb-2.5">
          <Truck className={`w-4 h-4 shrink-0 ${remaining === 0 ? 'text-success' : 'text-primary-550'}`} />
          {remaining === 0 ? (
            <span className="text-success flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-3" /> FREE Shipping unlocked!
            </span>
          ) : (
            <span>
              Add <span className="font-black text-surface-800 dark:text-white font-mono">{formatCurrency(remaining)}</span> for free delivery
            </span>
          )}
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full ${
              remaining === 0 
                ? 'bg-success' 
                : 'bg-linear-to-r from-primary-500 to-indigo-600'
            }`}
          />
        </div>
      </div>

      {/* Promo Warning Banner */}
      {appliedPromo && (
        <div className="mb-4 p-3 rounded-xl bg-warning-soft/20 text-warning border border-warning/15 flex items-start gap-2 select-none">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 stroke-[2.2]" />
          <p className="text-[10px] font-bold uppercase tracking-wide leading-snug">
            Promo verified — applies on payment.
          </p>
        </div>
      )}

      {/* Promo Code Input Fields */}
      <div className="mb-6">
        <label className="text-3xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 select-none">
          <Tag className="w-3.5 h-3.5 text-surface-400" /> Promo Code
        </label>
        
        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-success-soft/20 text-success border border-success/15">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center">
                <Check className="w-3 h-3 stroke-3" />
              </div>
              <div>
                <div className="text-2xs font-extrabold font-mono uppercase tracking-wider">{appliedPromo.code}</div>
                <div className="text-[9px] font-bold text-surface-400 uppercase mt-0.5">{appliedPromo.label} Discount applied</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemovePromo}
              className="p-1 rounded-lg text-surface-400 hover:text-danger hover:bg-danger-soft/10 transition-colors cursor-pointer"
              aria-label="Remove promo code"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoStatus(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                placeholder="WELCOME10"
                className="w-full px-3.5 py-2.5 border border-surface-150 dark:border-surface-850 rounded-xl bg-surface-50 dark:bg-surface-950 text-2xs font-black font-mono uppercase tracking-wider text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyPromo}
              className="px-4 py-2.5 text-2xs font-black rounded-xl uppercase tracking-wider bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-150 dark:hover:bg-surface-750 transition-colors cursor-pointer select-none"
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
              className="text-3xs font-extrabold text-danger mt-1.5 uppercase tracking-wide"
            >
              Invalid promo code. Try WELCOME10 or SAVE15.
            </motion.p>
          )}
        </AnimatePresence>
        
        <p className="text-[9px] font-bold text-surface-400 dark:text-surface-500 mt-2 select-none uppercase tracking-wider">
          Valid Codes: <span className="font-mono text-primary-500">WELCOME10</span>, <span className="font-mono text-primary-500">SAVE15</span>
        </p>
      </div>

      {/* Pricing breakdown summary */}
      <div className="space-y-3.5 text-xs pb-4 border-b border-dashed border-surface-150 dark:border-surface-850">
        <div className="flex justify-between items-center font-semibold text-surface-500 dark:text-surface-455">
          <span>Subtotal ({cart.totalQuantity} items)</span>
          <span className="font-black tabular-nums font-mono text-surface-800 dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center font-semibold text-surface-500 dark:text-surface-455">
          <span>Delivery Fee</span>
          {effectiveShipping === 0 ? (
            <span className="font-extrabold text-[10px] text-success bg-success-soft/20 px-2 py-0.5 rounded-md uppercase tracking-wider select-none">FREE</span>
          ) : (
            <span className="font-black tabular-nums font-mono text-surface-800 dark:text-white">{formatCurrency(effectiveShipping)}</span>
          )}
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-success animate-fade-in font-bold">
            <span className="flex items-center gap-1.5 text-3xs uppercase tracking-widest">
              <Gift className="w-3.5 h-3.5" /> Discount ({appliedPromo?.code})
            </span>
            <span className="tabular-nums font-mono">−{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      {/* Invoice total elements */}
      <div className="flex justify-between items-center pt-5 mb-6">
        <span className="font-bold text-surface-900 dark:text-white font-display text-sm uppercase tracking-wider">Total Invoice</span>
        <div className="text-right">
          <div className="text-xl sm:text-2xl font-black gradient-text-brand tabular-nums font-display">{formatCurrency(finalTotal)}</div>
          <div className="text-[10px] font-bold text-surface-400 dark:text-surface-555 uppercase tracking-widest mt-0.5">VAT Included</div>
        </div>
      </div>

      {/* Checkout Actions Buttons */}
      <Link to={ROUTES.CHECKOUT} className="block no-underline">
        <Button variant="shine" size="lg" className="w-full font-extrabold uppercase tracking-widest py-3.5 shadow-brand" iconRight={ArrowRight}>
          Proceed to Checkout
        </Button>
      </Link>

      <Link
        to={ROUTES.PRODUCTS}
        className="mt-4 block text-center text-2xs font-bold uppercase tracking-widest text-surface-400 hover:text-primary-650 transition-colors no-underline"
      >
        or Continue Shopping
      </Link>

      {/* Trust Badge Indicators Container */}
      <div className="mt-6 pt-5 border-t border-surface-150 dark:border-surface-850 grid grid-cols-3 gap-2 text-center select-none">
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100/50 dark:border-surface-850">
          <ShieldCheck className="w-4.5 h-4.5 text-success stroke-[2.2]" />
          <span className="text-[9px] font-bold text-surface-500 uppercase tracking-wide leading-tight">Secure<br />Checkout</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100/50 dark:border-surface-850">
          <RotateCcw className="w-4.5 h-4.5 text-primary-500 stroke-[2.2]" />
          <span className="text-[9px] font-bold text-surface-500 uppercase tracking-wide leading-tight">14-Day<br />Returns</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100/50 dark:border-surface-850">
          <Truck className="w-4.5 h-4.5 text-accent-500 stroke-[2.2]" />
          <span className="text-[9px] font-bold text-surface-500 uppercase tracking-wide leading-tight">Express<br />Shipping</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;