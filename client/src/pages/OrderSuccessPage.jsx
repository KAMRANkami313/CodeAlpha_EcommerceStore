import { motion } from 'framer-motion';
import {
  CheckCircle,
  ShoppingBag,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Home as HomeIcon,
  ChevronRight,
  Sparkles,
  PartyPopper,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

// Premium floating confetti dots — cosmetic fallback
const Confetti = () => {
  const dots = Array.from({ length: 14 });
  const colors = [
    'bg-primary-500',
    'bg-violet-500',
    'bg-accent-500',
    'bg-success',
    'bg-gold',
    'bg-indigo-400',
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {dots.map((_, i) => {
        const left = (i * 7.5) % 100;
        const delay = (i * 0.12) % 1.8;
        const duration = 2.5 + (i % 3);
        return (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeIn',
            }}
            className={`absolute w-1.5 h-1.5 rounded-sm ${colors[i % colors.length]}`}
            style={{ left: `${left}%`, top: '-5%' }}
          />
        );
      })}
    </div>
  );
};

const OrderSuccessPage = () => {
  const nextSteps = [
    {
      icon: Mail,
      title: 'Confirmation Email',
      desc: "You'll receive an email with your receipt and order details shortly.",
    },
    {
      icon: Package,
      title: 'Order Processing',
      desc: "Our team is preparing your package with precision and care.",
    },
    {
      icon: Truck,
      title: 'On the Way',
      desc: 'Track your package location directly from your account page.',
    },
  ];

  return (
    <div className="relative min-h-[85vh] overflow-hidden py-12 px-4 sm:px-6 flex flex-col justify-center">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl mx-auto w-full"
      >
        {/* Breadcrumb (Sleek Tactical Stack) */}
        <nav className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-surface-450 dark:text-surface-555 mb-6 justify-center select-none" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-450 flex items-center gap-1 transition-colors no-underline">
            <HomeIcon className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-700" />
          <span className="text-surface-805 dark:text-white">Order Confirmed</span>
        </nav>

        {/* Hero Confirmation Card */}
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 p-8 sm:p-12 text-center shadow-premium relative overflow-hidden">
          
          {/* Animated check icon badge block */}
          <motion.div
            initial={{ scale: 0.8, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 180, damping: 15 }}
            className="relative inline-block mb-8 select-none"
          >
            <div className="absolute inset-0 bg-success/20 blur-3xl rounded-full" />
            <div className="relative w-22 h-22 rounded-full bg-linear-to-br from-success to-emerald-600 flex items-center justify-center shadow-glow border border-white/10">
              <CheckCircle className="w-12 h-12 text-white stroke-2" />
            </div>

            {/* Micro badges */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-gold flex items-center justify-center shadow-xs border border-white/20 dark:border-surface-900"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
              className="absolute -bottom-1 -left-1.5 w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center shadow-xs border border-white/20 dark:border-surface-900"
            >
              <PartyPopper className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-4xl font-black mb-3 tracking-tight text-surface-900 dark:text-white font-display"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs sm:text-sm font-medium text-surface-450 dark:text-surface-400 leading-relaxed max-w-md mx-auto mb-10"
          >
            Thank you for shopping with us. Your processing dispatch has begun. We will notify you with the dispatch metadata immediately upon courier pickup.
          </motion.p>

          {/* Clean Next Steps Tracker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            {nextSteps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                className="p-4 rounded-xl bg-surface-50 dark:bg-surface-950/40 border border-surface-150/60 dark:border-surface-850/40 hover:border-primary-500/20 dark:hover:border-primary-400/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center mb-3 border border-primary-100/30 dark:border-primary-900/10 select-none">
                  <Icon className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider">{title}</h3>
                <p className="text-2xs font-medium text-surface-450 dark:text-surface-450 mt-1 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center select-none">
            <Link to={ROUTES.PRODUCTS} className="no-underline">
              <Button variant="gradient" size="md" icon={ShoppingBag} iconRight={ArrowRight} className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link to={ROUTES.PROFILE} className="no-underline">
              <Button variant="outline" size="md" icon={Package} className="w-full sm:w-auto">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Support block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center select-none"
        >
          <p className="text-2xs font-extrabold uppercase tracking-widest text-surface-400 dark:text-surface-500">
            Need Support? Reach us at{' '}
            <a href="mailto:support@shopverse.com" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors underline font-bold">
              support@shopverse.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;