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

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-surface-950">
      {/* ─────────────────────────  LEFT: Form  ───────────────────────── */}
      <motion.main
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-12 order-2 lg:order-1"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop) */}
          <Link to={ROUTES.HOME} className="lg:hidden inline-flex items-center gap-2.5 mb-8 no-underline">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">ShopVerse</span>
          </Link>

          <RegisterForm />

          {/* Trust footer */}
          <div className="mt-8 pt-6 border-t border-surface-100 dark:border-surface-800 flex items-center justify-center gap-2 text-xs text-surface-400 dark:text-surface-500">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Your data is protected with 256-bit SSL encryption</span>
          </div>

          <p className="text-center text-xs text-surface-400 dark:text-surface-500 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
          </p>

          <Link
            to={ROUTES.LOGIN}
            className="mt-6 mx-auto w-fit inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all no-underline"
          >
            Already have an account? Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.main>

      {/* ─────────────────────────  RIGHT: Brand panel  ───────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-linear-to-br from-violet-600 via-primary-700 to-primary-800 text-white order-1 lg:order-2"
      >
        {/* Aurora-style animated background */}
        <div className="absolute inset-0 aurora-bg" />
        {/* Mesh linear blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-400/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-violet-400/30 blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-fuchsia-400/20 blur-3xl pointer-events-none" />

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
              Join the <br />
              <span className="bg-linear-to-r from-white to-primary-200 bg-clip-text text-transparent">
                ShopVerse family.
              </span>
            </h1>
            <p className="text-primary-100 text-base leading-relaxed max-w-md">
              Create your free account today and unlock exclusive member benefits, faster checkout, and personalized recommendations.
            </p>
          </motion.div>

          {/* Benefits grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="grid grid-cols-1 gap-3"
          >
            {[
              { icon: Gift, title: 'Welcome Discount', desc: 'Get 10% off your first order' },
              { icon: Heart, title: 'Save Favorites', desc: 'Build your wishlist and get deal alerts' },
              { icon: Truck, title: 'Order Tracking', desc: 'Real-time updates on every shipment' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 transition-transform hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-xs text-primary-100">{desc}</div>
                </div>
              </div>
            ))}
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
            { icon: RotateCcw, label: 'Easy Returns' },
            { icon: Star, label: 'Top Rated' },
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
    </div>
  );
};

export default RegisterPage;
