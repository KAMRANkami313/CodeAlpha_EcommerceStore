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

// Floating confetti dots — purely cosmetic, no new dep
const Confetti = () => {
  const dots = Array.from({ length: 12 });
  const colors = ['bg-primary-500', 'bg-violet-500', 'bg-accent-500', 'bg-success', 'bg-gold', 'bg-fuchsia-500'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((_, i) => {
        const left = (i * 8.5) % 100;
        const delay = (i * 0.15) % 1.5;
        const duration = 2 + (i % 3);
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
            className={`absolute w-2 h-2 rounded-sm ${colors[i % colors.length]}`}
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
      desc: "You'll receive an email with your order details shortly.",
    },
    {
      icon: Package,
      title: 'Order Processing',
      desc: "We're preparing your items for shipment with care.",
    },
    {
      icon: Truck,
      title: 'On the Way',
      desc: 'Track your package from your account once it ships.',
    },
  ];

  return (
    <div className="relative min-h-[80vh] overflow-hidden py-10 px-4">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 mb-6 justify-center" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors">
            <HomeIcon className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-surface-800 dark:text-white font-medium">Order Confirmed</span>
        </nav>

        {/* Hero confirmation card */}
        <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-200 dark:border-surface-700 p-8 sm:p-10 text-center shadow-large">
          {/* Animated check icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-success/30 blur-2xl rounded-full" />
            <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-success to-emerald-600 flex items-center justify-center shadow-glow">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
            {/* Sparkles around the icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center"
            >
              <PartyPopper className="w-3.5 h-3.5 text-white" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold gradient-text-brand mb-3"
          >
            Order Placed Successfully!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-surface-500 dark:text-surface-400 leading-relaxed max-w-md mx-auto mb-8"
          >
            Thank you for your order! We're getting everything ready. You'll receive a confirmation email with your order details and tracking information soon.
          </motion.p>

          {/* Next steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
            {nextSteps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-2.5">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-bold text-surface-800 dark:text-white">{title}</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="gradient" size="lg" icon={ShoppingBag} iconRight={ArrowRight} className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
            <Link to={ROUTES.PROFILE}>
              <Button variant="outline" size="lg" icon={Package} className="w-full sm:w-auto">
                View My Orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-surface-400 dark:text-surface-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@shopverse.com" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              support@shopverse.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;