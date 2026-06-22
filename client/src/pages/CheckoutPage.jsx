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

  // Empty cart checkout guard view
  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl bg-white dark:bg-surface-900 border border-surface-150 dark:border-surface-850 shadow-premium relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-surface-500/10 rounded-full blur-3xl pointer-events-none z-0" />
          
          <div className="relative z-10 space-y-6">
            <div className="relative inline-block select-none">
              <div className="relative w-20 h-24 mx-auto rounded-2xl bg-surface-50 dark:bg-surface-950 flex items-center justify-center border border-surface-150 dark:border-surface-850">
                <PackageCheck className="w-10 h-10 text-surface-400 dark:text-surface-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Your Cart is Empty</h1>
              <p className="text-xs sm:text-sm font-semibold text-surface-555 dark:text-surface-400 leading-relaxed">
                Add some products to your cart before proceeding with checkout.
              </p>
            </div>
            
            <div className="pt-2">
              <Link to={ROUTES.PRODUCTS} className="no-underline">
                <Button variant="accent" size="lg" iconRight={ChevronRight} className="font-extrabold uppercase tracking-widest py-3 shadow-brand">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Breadcrumb Navigation Capsule */}
      <nav className="flex items-center gap-2 text-2xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-5 select-none" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-750" />
        <Link to={ROUTES.CART} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors no-underline">
          Cart
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-750" />
        <span className="text-primary-600 dark:text-primary-400 font-extrabold">Checkout</span>
      </nav>

      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Checkout</h1>
          <p className="text-xs sm:text-sm font-semibold text-surface-500 dark:text-surface-400 mt-2.5 select-none flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-success stroke-[2.5]" />
            Secure Payment Gateway · Complete your order in 3 easy steps
          </p>
        </div>
      </div>

      {/* Modern 3-Step Progress Timeline */}
      <div className="mb-10 select-none">
        <div className="relative flex items-center justify-between max-w-3xl mx-auto px-2">
          {/* Background tracking rail */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-surface-200 dark:bg-surface-800 pointer-events-none" />
          
          {/* Active progress tracking line */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute top-5 left-0 h-0.5 bg-linear-to-r from-primary-500 to-violet-500 shadow-glow pointer-events-none"
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
                      ? 'bg-primary-600 border-primary-600 text-white shadow-brand'
                      : isActive
                      ? 'bg-white dark:bg-surface-900 border-primary-500 text-primary-500 dark:text-primary-455 shadow-premium scale-110'
                      : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 text-surface-400 dark:text-surface-600'
                  }`}
                >
                  {isComplete ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
                      <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
                    </motion.span>
                  ) : (
                    <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
                  )}
                </div>
                <div className="text-center">
                  <div
                    className={`text-[11px] font-extrabold uppercase tracking-wider ${
                      isActive || isComplete ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-surface-500'
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-[9px] font-bold text-surface-450 dark:text-surface-550 uppercase tracking-widest hidden sm:block mt-0.5">
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strict 2-Column Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start relative">
        
        {/* Left Column: Checkout Multi-step Form Card */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850 p-5 sm:p-8 shadow-premium relative">
          <CheckoutForm onStepChange={setCurrentStep} />
        </div>

        {/* Right Column: Order Summary Column Wrapper */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 z-10 w-full">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;