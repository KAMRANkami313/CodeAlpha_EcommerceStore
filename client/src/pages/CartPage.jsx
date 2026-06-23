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

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center p-8 sm:p-10 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
        >
          <div className="relative z-10 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-white" strokeWidth={2} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Your cart awaits</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                Sign in to view your saved items, apply promo codes, and check out faster.
              </p>
            </div>

            <Link to={ROUTES.LOGIN} className="no-underline">
              <Button variant="primary" size="lg" iconRight={ArrowRight} className="w-full">
                Login to Continue
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Empty cart
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center p-8 sm:p-10 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
        >
          <div className="relative z-10 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-surface-400" strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Your cart is empty</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                Looks like you haven't added anything yet. Let's find something you'll love.
              </p>
            </div>

            <Link to={ROUTES.PRODUCTS} className="no-underline">
              <Button variant="primary" size="lg" icon={ShoppingBag} iconRight={ArrowRight} className="w-full">
                Start Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-5" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
        <span className="text-primary-600 dark:text-primary-400 font-medium">Cart</span>
      </nav>

      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-7 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors no-underline"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          <div className="space-y-3">
            {cart.items.map((item) => (
              <CartItem key={item.product._id || item.product} item={item} />
            ))}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-4">
            {[
              { icon: Lock, label: 'Secure Checkout', sub: '256-bit SSL' },
              { icon: Truck, label: 'Fast Delivery', sub: '2-5 business days' },
              { icon: RotateCcw, label: 'Easy Returns', sub: 'Within 14 days' },
              { icon: ShieldCheck, label: 'Authentic', sub: '100% genuine' },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-center"
              >
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
                <div>
                  <div className="text-xs font-medium text-surface-800 dark:text-surface-200">{label}</div>
                  <div className="text-[10px] text-surface-400 dark:text-surface-500 mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 z-10 w-full">
          <CartSummary cart={cart} />
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;