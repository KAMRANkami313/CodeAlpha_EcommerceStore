import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  RotateCcw,
  Truck,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

const CartPage = () => {
  const { cart, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  // Not authenticated state panel
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl bg-white dark:bg-surface-900 border border-surface-150 dark:border-surface-850 shadow-premium relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none z-0" />
          
          <div className="relative z-10 space-y-6">
            <div className="relative inline-block select-none">
              <div className="relative w-20 h-24 mx-auto rounded-2xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-brand overflow-hidden">
                <ShoppingBag className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Your Cart Awaits</h1>
              <p className="text-xs sm:text-sm font-semibold text-surface-555 dark:text-surface-400 leading-relaxed">
                Sign in to view your saved items, apply promo codes, and check out faster.
              </p>
            </div>
            
            <div className="pt-2">
              <Link to={ROUTES.LOGIN} className="no-underline">
                <Button variant="gradient" size="lg" iconRight={ArrowRight} className="w-full font-extrabold uppercase tracking-widest py-3.5 shadow-brand">
                  Login to Continue
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Empty cart state panel
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl bg-white dark:bg-surface-900 border border-surface-150 dark:border-surface-850 shadow-premium relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-surface-500/10 rounded-full blur-3xl pointer-events-none z-0" />
          
          <div className="relative z-10 space-y-6">
            <div className="relative inline-block select-none">
              <div className="relative w-20 h-24 mx-auto rounded-2xl bg-surface-50 dark:bg-surface-950 flex items-center justify-center border border-surface-150 dark:border-surface-850">
                <ShoppingBag className="w-10 h-10 text-surface-400 dark:text-surface-500" strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Your Cart is Empty</h1>
              <p className="text-xs sm:text-sm font-semibold text-surface-555 dark:text-surface-400 leading-relaxed">
                Looks like you haven't added anything yet. Let's find something you'll love.
              </p>
            </div>
            
            <div className="pt-2">
              <Link to={ROUTES.PRODUCTS} className="no-underline">
                <Button variant="gradient" size="lg" icon={ShoppingBag} iconRight={ArrowRight} className="w-full font-extrabold uppercase tracking-widest py-3.5 shadow-brand">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-2xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-5 select-none" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-750" />
        <span className="text-primary-600 dark:text-primary-400 font-extrabold">Cart</span>
      </nav>

      {/* Page Header */}
      <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Shopping Cart</h1>
          <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-2 select-none">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 transition-colors no-underline"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Strict 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start relative">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3.5">
            {cart.items.map((item) => (
              <CartItem key={item.product._id || item.product} item={item} />
            ))}
          </div>

          {/* Premium Frosted Trust Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 select-none">
            {[
              { icon: Lock, label: 'Secure Checkout', sub: '256-bit SSL' },
              { icon: Truck, label: 'Fast Delivery', sub: '2-5 business days' },
              { icon: RotateCcw, label: 'Easy Returns', sub: 'Within 14 days' },
              { icon: ShieldCheck, label: 'Authentic Gear', sub: '100% genuine' },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-150 dark:border-surface-850 text-center shadow-xs"
              >
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <div className="text-[10px] font-extrabold text-surface-800 dark:text-surface-200 uppercase tracking-wider leading-tight">{label}</div>
                  <div className="text-[9px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest leading-none mt-1.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary Column Wrapper */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 z-10 w-full">
          <CartSummary cart={cart} />
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;