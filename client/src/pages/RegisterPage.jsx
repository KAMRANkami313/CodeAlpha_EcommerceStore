import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  Heart,
  ArrowRight,
} from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import ROUTES from '../constants/ROUTES.js';

/**
 * RegisterPage — Editorial Modern Redesign
 *
 * Split-screen register page. Form on the left, subtle dark brand panel
 * on the right (desktop). Same RegisterForm component, same layout.
 */
const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-surface-950 animate-fade-in">

      {/* ─── LEFT: Form Column ─── */}
      <motion.main
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-12 order-2 lg:order-1 bg-white dark:bg-surface-950"
      >
        <div className="w-full max-w-md flex flex-col justify-center min-h-[70vh]">

          {/* Mobile logo */}
          <Link to={ROUTES.HOME} className="lg:hidden inline-flex items-center gap-2.5 mb-8 no-underline text-surface-900 dark:text-white">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>

          {/* Register form */}
          <RegisterForm />

          {/* Trust footer */}
          <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-800 flex items-center justify-center gap-2 text-xs text-surface-500 dark:text-surface-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
            <span>Your data is secured with 256-bit SSL encryption</span>
          </div>

          <p className="text-center text-xs text-surface-400 dark:text-surface-500 mt-4">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
          </p>

          <Link
            to={ROUTES.LOGIN}
            className="mt-5 mx-auto w-fit inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:gap-2 transition-all no-underline link-underline"
          >
            Already have an account? Sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.main>

      {/* ─── RIGHT: Brand Panel (Desktop Only) ─── */}
      <motion.aside
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden bg-surface-900 text-white order-1 lg:order-2"
      >
        {/* Single subtle glow (replaces 3 stacked blobs) */}
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group no-underline text-white">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 border border-white/10 transition-colors">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>
        </div>

        {/* Heading + benefits */}
        <div className="relative z-10 space-y-8 my-auto">
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-balance font-display">
              Join the{' '}
              <span className="text-primary-400">ShopVerse family.</span>
            </h1>
            <p className="text-surface-300 text-sm xl:text-base leading-relaxed max-w-md">
              Create your free account today and unlock exclusive member benefits, faster checkout, and personalized recommendations.
            </p>
          </div>

          {/* Benefits list (clean cards, not glass) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="grid grid-cols-1 gap-2.5 max-w-md"
          >
            {[
              { icon: Gift, title: 'Welcome Discount', desc: 'Get 10% off your first order' },
              { icon: Heart, title: 'Save Favorites', desc: 'Build a wishlist and get deal alerts' },
              { icon: Truck, title: 'Order Tracking', desc: 'Real-time updates on every shipment' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3.5 p-3.5 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary-300" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-xs text-surface-400 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative z-10 grid grid-cols-3 gap-2"
        >
          {[
            { icon: ShieldCheck, label: 'Secure SSL' },
            { icon: RotateCcw, label: 'Easy Returns' },
            { icon: Star, label: 'Top Rated' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10"
            >
              <Icon className="w-4 h-4 text-primary-300" strokeWidth={2} />
              <span className="text-xs font-medium text-surface-200">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.aside>
    </div>
  );
};

export default RegisterPage;
