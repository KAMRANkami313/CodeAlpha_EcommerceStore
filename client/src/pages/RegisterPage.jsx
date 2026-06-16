import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Quote,
  Star,
  Gift,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm.jsx';
import ROUTES from '../constants/ROUTES.js';

const benefits = [
  { icon: Gift, title: 'Exclusive member deals', desc: 'Unlock prices only members see' },
  { icon: Truck, title: 'Free shipping perks', desc: 'Free shipping on orders over PKR 5,000' },
  { icon: ShieldCheck, title: 'Buyer protection', desc: '7-day easy returns on every order' },
];

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
          {/* Mobile logo */}
          <Link to={ROUTES.HOME} className="lg:hidden inline-flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">ShopVerse</span>
          </Link>

          <RegisterForm />

          <Link
            to={ROUTES.LOGIN}
            className="mt-6 mx-auto w-fit inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-2.5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Already a member? Sign in
          </Link>
        </div>
      </motion.main>

      {/* ─────────────────────────  RIGHT: Brand panel  ───────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-linear-to-br from-violet-700 via-primary-700 to-primary-800 text-white order-1 lg:order-2"
      >
        {/* Mesh gradient background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-400/30 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-fuchsia-400/25 blur-3xl" />
        <div className="absolute top-[35%] right-[25%] w-[28%] h-[28%] rounded-full bg-primary-300/20 blur-3xl" />

        {/* Top: logo + heading */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-colors">
              <ShoppingBag className="w-5 h-5 text-white" />
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Join 50,000+ happy shoppers</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
              Start your <br />
              <span className="bg-linear-to-r from-white to-primary-200 bg-clip-text text-transparent">
                shopping journey
              </span>{' '}
              today.
            </h1>
            <p className="text-primary-100 text-base leading-relaxed max-w-md">
              Create a free account to unlock member-only deals, save your wishlist, and check out faster.
            </p>
          </motion.div>

          {/* Benefits list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/10 backdrop-blur border border-white/10"
              >
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-xs text-primary-100">{desc}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
          >
            <Quote className="absolute -top-2 -left-2 w-6 h-6 text-white/40" />
            <p className="text-sm text-primary-50 leading-relaxed mb-2">
              "Signed up last month and already saved thousands on member deals. Highly recommend!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-semibold text-xs">
                AH
              </div>
              <div>
                <div className="text-xs font-semibold">Ali Hassan</div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-primary-100">
          © {new Date().getFullYear()} ShopVerse. All rights reserved.
        </div>
      </motion.aside>
    </div>
  );
};

export default RegisterPage;
