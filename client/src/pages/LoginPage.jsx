import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Quote,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  ArrowRight,
} from 'lucide-react';
import LoginForm from '../components/auth/LoginForm.jsx';
import ROUTES from '../constants/ROUTES.js';

/**
 * LoginPage — Editorial Modern Redesign
 *
 * Split-screen auth page. Subtle dark brand panel on the left (desktop),
 * clean form on the right. Same LoginForm component, same layout.
 */
const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-surface-950 animate-fade-in">

      {/* ─── LEFT: Brand Panel (Desktop Only) ─── */}
      <motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden bg-surface-900 text-white"
      >
        {/* Single subtle glow (replaces 3 stacked blobs) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group no-underline text-white">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 border border-white/10 transition-colors">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>
        </div>

        {/* Heading + testimonial */}
        <div className="relative z-10 space-y-8 my-auto">
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-balance font-display">
              Welcome back to{' '}
              <span className="text-primary-400">premium shopping.</span>
            </h1>
            <p className="text-surface-300 text-sm xl:text-base leading-relaxed max-w-md">
              Sign in to access your wishlist, track orders, and unlock exclusive member-only deals.
            </p>
          </div>

          {/* Testimonial card (clean, not glass-premium) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="p-5 rounded-xl bg-white/5 border border-white/10"
          >
            <Quote className="w-6 h-6 text-primary-400 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-surface-200 leading-relaxed mb-4 font-display">
              "ShopVerse has completely changed how I shop online. The product quality, fast delivery, and easy returns are unmatched."
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-sm">
                  SK
                </div>
                <div>
                  <div className="text-sm font-semibold">Sarah Khan</div>
                  <div className="text-[11px] text-surface-400">Verified Shopper</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
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
            { icon: Truck, label: 'Fast Delivery' },
            { icon: RotateCcw, label: 'Easy Returns' },
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

      {/* ─── RIGHT: Form Column ─── */}
      <motion.main
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white dark:bg-surface-950"
      >
        <div className="w-full max-w-md flex flex-col justify-center min-h-[70vh]">

          {/* Mobile logo (hidden on desktop) */}
          <Link to={ROUTES.HOME} className="lg:hidden inline-flex items-center gap-2.5 mb-8 no-underline text-surface-900 dark:text-white">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>

          {/* Login form */}
          <LoginForm />

          {/* Trust footer */}
          <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-800 flex items-center justify-center gap-2 text-xs text-surface-500 dark:text-surface-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
            <span>Encrypted with 256-bit SSL protection</span>
          </div>

          <p className="text-center text-xs text-surface-400 dark:text-surface-500 mt-4">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
          </p>

          <Link
            to={ROUTES.REGISTER}
            className="mt-5 mx-auto w-fit inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:gap-2 transition-all no-underline link-underline"
          >
            New here? Create an account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.main>
    </div>
  );
};

export default LoginPage;