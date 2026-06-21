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

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-surface-950">
      {/* ─────────────────────────  LEFT: Brand panel  ───────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-linear-to-br from-primary-600 via-primary-700 to-violet-800 text-white"
      >
        {/* Aurora-style animated background */}
        <div className="absolute inset-0 aurora-bg" />
        {/* Mesh linear blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-primary-400/30 blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-fuchsia-400/20 blur-3xl pointer-events-none" />

        {/* Content (z-10 above blobs) */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group no-underline">
            <div className="relative w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-all overflow-hidden">
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ShoppingBag className="w-5 h-5 text-white relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight">ShopVerse</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4 text-balance font-display tracking-tight">
              Welcome back to <br />
              <span className="bg-linear-to-r from-white to-primary-200 bg-clip-text text-transparent">
                premium shopping.
              </span>
            </h1>
            <p className="text-primary-100 text-base leading-relaxed max-w-md">
              Sign in to access your wishlist, track orders, and unlock exclusive member-only deals curated just for you.
            </p>
          </motion.div>

          {/* Testimonial card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative p-5 rounded-2xl glass-card border border-white/20"
          >
            <Quote className="absolute -top-2 -left-2 w-7 h-7 text-white/40" />
            <p className="text-sm text-primary-50 leading-relaxed mb-3">
              "ShopVerse has completely changed how I shop online. The product quality, fast delivery, and easy returns are unmatched in Pakistan."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
                SK
              </div>
              <div>
                <div className="text-sm font-semibold">Sarah Khan</div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 grid grid-cols-3 gap-3"
        >
          {[
            { icon: ShieldCheck, label: 'Secure' },
            { icon: Truck, label: 'Fast Delivery' },
            { icon: RotateCcw, label: 'Easy Returns' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10 transition-transform hover:-translate-y-0.5"
            >
              <Icon className="w-4 h-4 text-primary-100" />
              <span className="text-xs font-medium text-primary-50">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.aside>

      {/* ─────────────────────────  RIGHT: Form  ───────────────────────── */}
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop) */}
          <Link to={ROUTES.HOME} className="lg:hidden inline-flex items-center gap-2.5 mb-8 no-underline">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">ShopVerse</span>
          </Link>

          <LoginForm />

          {/* Trust footer */}
          <div className="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800 flex items-center justify-center gap-2 text-xs text-surface-400 dark:text-surface-500">
            <Lock className="w-3.5 h-3.5 text-success" />
            <span>Your data is protected with 256-bit SSL encryption</span>
          </div>

          <p className="text-center text-xs text-surface-400 dark:text-surface-500 mt-6">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
          </p>

          <Link
            to={ROUTES.REGISTER}
            className="mt-6 mx-auto w-fit inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all no-underline"
          >
            New here? Create an account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.main>
    </div>
  );
};

export default LoginPage;