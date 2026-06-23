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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

// Confetti (kept — it's a nice touch for a success page)
const Confetti = () => {
  const dots = Array.from({ length: 14 });
  const colors = [
    'bg-primary-500', 'bg-violet-500', 'bg-accent-500',
    'bg-emerald-500', 'bg-amber-400', 'bg-indigo-400',
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((_, i) => {
        const left = (i * 7.5) % 100;
        const delay = (i * 0.12) % 1.8;
        const duration = 2.5 + (i % 3);
        return (
          <motion.div
            key={i}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeIn' }}
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
      desc: "Our team is preparing your package with care.",
    },
    {
      icon: Truck,
      title: 'On the Way',
      desc: 'Track your package directly from your account page.',
    },
  ];

  return (
    <div className="relative min-h-[85vh] overflow-hidden py-12 px-4 sm:px-6 flex flex-col justify-center">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-2xl mx-auto w-full"
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 mb-6 justify-center" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors no-underline">
            <HomeIcon className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-700" />
          <span className="text-surface-800 dark:text-white">Order Confirmed</span>
        </nav>

        {/* Card */}
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-8 sm:p-12 text-center shadow-sm">

          {/* Check icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 180, damping: 15 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-11 h-11 text-white" strokeWidth={2} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight text-surface-900 dark:text-white font-display"
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed max-w-md mx-auto mb-10"
          >
            Thank you for shopping with us. Your order is being processed. We'll notify you with dispatch details once your package ships.
          </motion.p>

          {/* Next steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 text-left">
            {nextSteps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-4 rounded-xl bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800"
              >
                <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mb-3">
                  <Icon className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
                </div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.PRODUCTS} className="no-underline">
              <Button variant="primary" size="md" icon={ShoppingBag} iconRight={ArrowRight} className="w-full sm:w-auto">
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

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-surface-400 dark:text-surface-500">
            Need support? Reach us at{' '}
            <a href="mailto:support@shopverse.com" className="text-primary-600 dark:text-primary-400 hover:underline">
              support@shopverse.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;