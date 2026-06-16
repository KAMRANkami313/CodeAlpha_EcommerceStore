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

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center py-16"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 mx-auto rounded-3xl bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold gradient-text-brand mb-2">Your Cart Awaits</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Sign in to view your saved items, apply promo codes, and check out faster.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant="gradient" size="lg" iconRight={ArrowRight}>Login to Continue</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Empty cart state
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center py-16"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-surface-400/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 mx-auto rounded-3xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-surface-400 dark:text-surface-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-surface-800 dark:text-white mb-2">Your cart is empty</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-8">
            Looks like you haven't added anything yet. Let's find something you'll love.
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="gradient" size="lg" icon={ShoppingBag} iconRight={ArrowRight}>
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 mb-4" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-surface-800 dark:text-white font-medium">Cart</span>
      </nav>

      {/* Page header */}
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand mb-1">Shopping Cart</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Items list (left, 2/3) */}
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <CartItem key={item.product._id || item.product} item={item} />
          ))}

          {/* Trust badges row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            {[
              { icon: Lock, label: 'Secure Checkout', sub: '256-bit SSL' },
              { icon: Truck, label: 'Fast Delivery', sub: '2-5 days' },
              { icon: RotateCcw, label: 'Easy Returns', sub: 'Within 7 days' },
              { icon: ShieldCheck, label: 'Authentic', sub: '100% genuine' },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-700 text-center"
              >
                <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <div>
                  <div className="text-xs font-semibold text-surface-700 dark:text-surface-200">{label}</div>
                  <div className="text-[10px] text-surface-400 dark:text-surface-500">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary (right, 1/3, sticky) */}
        <div className="lg:col-span-1">
          <CartSummary cart={cart} />
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;