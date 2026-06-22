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
 * LoginPage — Premium Redesign
 *
 * A breathtaking split-screen authentication canvas featuring ambient aurora panels,
 * glassmorphic quote cards, and fine-line layout modules.
 */
const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-surface-950 animate-fade-in">
      
      {/* ─────────────────────────  LEFT: Brand Panel (Desktop Only)  ───────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden bg-linear-to-br from-primary-950 via-surface-950 to-violet-950 text-white select-none"
      >
        {/* Animated Aurora Background */}
        <div className="absolute inset-0 aurora-bg opacity-30 z-0 pointer-events-none" />
        
        {/* Technical Mesh Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-primary-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-fuchsia-400/10 blur-3xl pointer-events-none" />

        {/* Brand Logo Header (z-10 above background blobs) */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group no-underline text-white">
            <div className="relative w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 border border-white/10 transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ShoppingBag className="w-4.5 h-4.5 text-white relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>
        </div>

        {/* Text Area & Sarah Khan Testimonial Card */}
        <div className="relative z-10 space-y-10 my-auto">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-balance font-display">
              Welcome back to <br />
              <span className="bg-linear-to-r from-white via-primary-100 to-primary-300 bg-clip-text text-transparent">
                premium shopping.
              </span>
            </h1>
            <p className="text-primary-100/80 text-sm xl:text-base leading-relaxed max-w-md font-semibold">
              Sign in to access your wishlist, track orders, and unlock exclusive member-only deals curated just for you.
            </p>
          </div>

          {/* Redesigned Testimonial Card (High-Blur Glass) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative p-6 rounded-3xl glass-premium border border-white/15 shadow-premium card-gleam"
          >
            <Quote className="absolute -top-3.5 -left-2.5 w-8 h-8 text-white/25 stroke-[2.5]" />
            <p className="text-xs sm:text-sm font-bold text-primary-50 leading-relaxed mb-4 font-display">
              "ShopVerse has completely changed how I shop online. The product quality, fast delivery, and easy returns are unmatched in Pakistan."
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center font-black text-xs border border-white/10">
                  SK
                </div>
                <div>
                  <div className="text-xs font-black">Sarah Khan</div>
                  <div className="text-[10px] font-bold text-primary-200/80 uppercase tracking-widest mt-0.5">Verified Shopper</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 grid grid-cols-3 gap-3"
        >
          {[
            { icon: ShieldCheck, label: 'Secure SSL' },
            { icon: Truck, label: 'Fast Delivery' },
            { icon: RotateCcw, label: 'Easy Returns' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-0.5 transition-transform duration-350"
            >
              <Icon className="w-4 h-4 text-primary-100" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-50">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.aside>

      {/* ─────────────────────────  RIGHT: Form Column  ───────────────────────── */}
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white dark:bg-surface-950"
      >
        <div className="w-full max-w-md flex flex-col justify-center min-h-[70vh]">
          
          {/* Mobile responsive Logo (hidden on desktop viewports) */}
          <Link to={ROUTES.HOME} className="lg:hidden inline-flex items-center gap-2.5 mb-10 no-underline text-surface-900 dark:text-white select-none">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>

          {/* Redesigned Login Form Component */}
          <LoginForm />

          {/* Secure Trust Footer Panel */}
          <div className="mt-8 pt-6 border-t border-surface-150 dark:border-surface-850 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 select-none">
            <Lock className="w-3.5 h-3.5 text-success stroke-[2.5]" />
            <span>Encrypted with 256-Bit SSL protection</span>
          </div>

          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 mt-5 select-none">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline">Privacy Policies</a>.
          </p>

          <Link
            to={ROUTES.REGISTER}
            className="mt-6 mx-auto w-fit inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:gap-2.5 transition-all no-underline link-underline"
          >
            New here? Create an account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.main>
    </div>
  );
};

export default LoginPage;