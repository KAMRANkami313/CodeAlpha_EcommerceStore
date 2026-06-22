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
 * RegisterPage — Premium Redesign
 *
 * A modern, split-screen registration canvas featuring custom animated backdrops,
 * frosted value-proposition lists, and sleek typography alignments.
 */
const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-surface-950 animate-fade-in">
      
      {/* ─────────────────────────  LEFT: Form Column  ───────────────────────── */}
      <motion.main
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-12 order-2 lg:order-1 bg-white dark:bg-surface-950"
      >
        <div className="w-full max-w-md flex flex-col justify-center min-h-[70vh]">
          
          {/* Mobile responsive Logo (hidden on desktop viewports) */}
          <Link to={ROUTES.HOME} className="lg:hidden inline-flex items-center gap-2.5 mb-10 no-underline text-surface-900 dark:text-white select-none">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>

          {/* Redesigned Register Form Component */}
          <RegisterForm />

          {/* Secure Trust Footer Panel */}
          <div className="mt-8 pt-6 border-t border-surface-150 dark:border-surface-850 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-success stroke-[2.5]" />
            <span>Your transaction metrics are secured with 256-Bit SSL</span>
          </div>

          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 mt-5 select-none">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline">Privacy Policies</a>.
          </p>

          <Link
            to={ROUTES.LOGIN}
            className="mt-6 mx-auto w-fit inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:gap-2.5 transition-all no-underline link-underline"
          >
            Already have an account? Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.main>

      {/* ─────────────────────────  RIGHT: Brand Panel (Desktop Only)  ───────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden bg-linear-to-br from-primary-950 via-surface-950 to-violet-950 text-white order-1 lg:order-2 select-none"
      >
        {/* Animated Aurora Background */}
        <div className="absolute inset-0 aurora-bg opacity-30 z-0 pointer-events-none" />
        
        {/* Technical Mesh Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-fuchsia-400/10 blur-3xl pointer-events-none" />

        {/* Brand Logo Header */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group no-underline text-white">
            <div className="relative w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 border border-white/10 transition-all duration-300 overflow-hidden">
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ShoppingBag className="w-4.5 h-4.5 text-white relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">ShopVerse</span>
          </Link>
        </div>

        {/* Text Area & Value Propositions List */}
        <div className="relative z-10 space-y-10 my-auto">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-balance font-display">
              Join the <br />
              <span className="bg-linear-to-r from-white via-primary-100 to-primary-300 bg-clip-text text-transparent">
                ShopVerse family.
              </span>
            </h1>
            <p className="text-primary-100/80 text-sm xl:text-base leading-relaxed max-w-md font-semibold">
              Create your free account today and unlock exclusive member benefits, faster checkout, and personalized recommendations.
            </p>
          </div>

          {/* Redesigned Account Benefits List (Frosted Glass Panel Row) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="grid grid-cols-1 gap-3.5 max-w-md"
          >
            {[
              { icon: Gift, title: 'Welcome Discount', desc: 'Get 10% off your first luxury order' },
              { icon: Heart, title: 'Save Favorites', desc: 'Build your wishlist and get custom deal alerts' },
              { icon: Truck, title: 'Order Tracking', desc: 'Real-time updates on every nationwide shipment' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-0.5 transition-all duration-300 shadow-premium card-gleam"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold tracking-tight">{title}</div>
                  <div className="text-[10px] font-semibold text-primary-200/80 mt-1 select-none">{desc}</div>
                </div>
              </div>
            ))}
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
            { icon: RotateCcw, label: 'Easy Returns' },
            { icon: Star, label: 'Top Rated' },
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
    </div>
  );
};

export default RegisterPage;
