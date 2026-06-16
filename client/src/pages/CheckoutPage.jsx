import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, PackageCheck, ChevronRight, Home as HomeIcon, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm.jsx';
import OrderSummary from '../components/checkout/OrderSummary.jsx';
import useCart from '../hooks/useCart.js';
import Loader from '../components/common/Loader.jsx';
import ROUTES from '../constants/ROUTES.js';

const STEPS = [
  { id: 1, label: 'Shipping', icon: Truck, desc: 'Delivery details' },
  { id: 2, label: 'Payment', icon: CreditCard, desc: 'Choose method' },
  { id: 3, label: 'Review', icon: PackageCheck, desc: 'Confirm order' },
];

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setInitialLoading(false);
    };
    loadCart();
  }, [fetchCart]);

  if (initialLoading) {
    return <Loader label="Loading your checkout..." />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center py-16"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-5">
            <PackageCheck className="w-10 h-10 text-surface-400 dark:text-surface-500" />
          </div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-white mb-2">Your cart is empty</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            Add some products to your cart before checking out.
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-primary-600 to-violet-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            Browse Products <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 mb-4" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={ROUTES.CART} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Cart
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-surface-800 dark:text-white font-medium">Checkout</span>
      </nav>

      {/* Page header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand mb-1">Checkout</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-success" />
            Secure checkout · Complete your order in 3 easy steps
          </p>
        </div>
      </div>

      {/* 3-step progress indicator */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between max-w-3xl mx-auto">
          {/* Background line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-200 dark:bg-surface-700" />
          {/* Progress line */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute top-5 left-0 h-0.5 bg-linear-to-r from-primary-500 to-violet-500"
          />

          {STEPS.map((s) => {
            const isComplete = currentStep > s.id;
            const isActive = currentStep === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isComplete
                      ? 'bg-primary-600 border-primary-600 text-white shadow-glow'
                      : isActive
                      ? 'bg-white dark:bg-surface-800 border-primary-600 text-primary-600 dark:text-primary-400 shadow-md scale-110'
                      : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-600 text-surface-400'
                  }`}
                >
                  {isComplete ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Icon className="w-5 h-5" /></motion.span> : <Icon className="w-5 h-5" />}
                </div>
                <div className="text-center">
                  <div
                    className={`text-xs font-bold ${
                      isActive || isComplete ? 'text-surface-800 dark:text-white' : 'text-surface-400 dark:text-surface-500'
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-[10px] text-surface-400 dark:text-surface-500 hidden sm:block">
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form area (left, 2/3) */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 sm:p-7 shadow-soft">
          <CheckoutForm onStepChange={setCurrentStep} />
        </div>

        {/* Order summary (right, 1/3, sticky) */}
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;