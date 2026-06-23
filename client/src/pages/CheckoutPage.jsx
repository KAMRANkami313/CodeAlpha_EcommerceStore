import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, PackageCheck, ChevronRight, Home as HomeIcon, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm.jsx';
import OrderSummary from '../components/checkout/OrderSummary.jsx';
import useCart from '../hooks/useCart.js';
import Loader from '../components/common/Loader.jsx';
import Button from '../components/common/Button.jsx';
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
    return <Loader label="Loading secure checkout..." />;
  }

  // Empty cart guard
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center p-8 sm:p-10 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
        >
          <div className="relative z-10 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <PackageCheck className="w-8 h-8 text-surface-400" strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Your cart is empty</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                Add some products to your cart before proceeding with checkout.
              </p>
            </div>

            <Link to={ROUTES.PRODUCTS} className="no-underline">
              <Button variant="primary" size="lg" iconRight={ChevronRight}>
                Browse Products
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-5" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
        <Link to={ROUTES.CART} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors no-underline">
          Cart
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
        <span className="text-primary-600 dark:text-primary-400 font-medium">Checkout</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Checkout</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-500" strokeWidth={2} />
            Secure checkout · Complete your order in 3 easy steps
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="mb-10">
        <div className="relative flex items-center justify-between max-w-3xl mx-auto px-2">
          {/* Track */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-200 dark:bg-surface-800 pointer-events-none" />

          {/* Active progress */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute top-5 left-0 h-0.5 bg-primary-600 pointer-events-none"
          />

          {STEPS.map((s) => {
            const isComplete = currentStep > s.id;
            const isActive = currentStep === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isComplete
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isActive
                      ? 'bg-white dark:bg-surface-900 border-primary-500 text-primary-500'
                      : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 text-surface-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium ${isActive || isComplete ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-surface-500'}`}>
                    {s.label}
                  </div>
                  <div className="text-xs text-surface-400 dark:text-surface-500 hidden sm:block mt-0.5">
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

        {/* Form */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 sm:p-7">
          <CheckoutForm onStepChange={setCurrentStep} />
        </div>

        {/* Summary */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 z-10 w-full">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;