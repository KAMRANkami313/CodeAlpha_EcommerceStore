import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  ShieldCheck,
  PackageCheck,
  Banknote,
  PencilLine,
  RotateCcw, // Added missing Lucide import
} from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import orderService from '../../services/orderService.js';
import useCart from '../../hooks/useCart.js';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button.jsx';
import StripePaymentForm from './StripePaymentForm.jsx';
import formatCurrency from '../../utils/formatCurrency.js';
import ROUTES from '../../constants/ROUTES.js';

let stripePromise = null;

const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      stripePromise = loadStripe(key);
    }
  }
  return stripePromise;
};

const isStripeConfigured = !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const inputClass =
  'w-full pl-11 pr-4 py-2.5 border border-surface-150 dark:border-surface-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 text-sm font-semibold bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder-surface-400 transition-all duration-300';
const inputClassNoIcon =
  'w-full px-4 py-2.5 border border-surface-150 dark:border-surface-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 text-sm font-semibold bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder-surface-400 transition-all duration-300';

const Field = ({ label, error, children, icon: Icon }) => (
  <div className="space-y-2">
    <label className="block text-3xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest select-none">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400 pointer-events-none" />
      )}
      {children}
    </div>
    {error && <p className="text-danger text-3xs font-bold mt-1.5 flex items-center gap-1 uppercase tracking-wider select-none animate-fade-in">{error}</p>}
  </div>
);

const CheckoutForm = ({ onStepChange }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [clientSecret, setClientSecret] = useState(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const { cart, emptyCart } = useCart();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm({
    mode: 'onTouched',
    shouldUnregister: false, // Prevents values from being deleted when steps unmount
  });

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (paymentMethod === 'Card' && isStripeConfigured && !clientSecret && !creatingIntent) {
      handleCreatePaymentIntent();
    }
  }, [paymentMethod]);

  const handleCreatePaymentIntent = async () => {
    setCreatingIntent(true);
    try {
      const response = await orderService.createPaymentIntent();
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment. Please use COD.');
      setPaymentMethod('COD');
    } finally {
      setCreatingIntent(false);
    }
  };

  const handleCODOrder = async (data) => {
    setLoading(true);
    try {
      await orderService.createOrder({
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
        },
        paymentMethod: 'COD',
      });
      await emptyCart();
      toast.success('Order placed successfully!');
      navigate(ROUTES.ORDER_SUCCESS);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    // Shipping validation was already completed at Step 1 ➔ Step 2.
    // Reading values directly from memory now avoids conditional unmounting bugs.
    const shippingData = getValues();
    setLoading(true);
    try {
      await orderService.createOrder({
        shippingAddress: {
          fullName: shippingData.fullName,
          phone: shippingData.phone,
          street: shippingData.street,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
        },
        paymentMethod: 'Card',
        stripePaymentId: paymentIntentId,
      });
      await emptyCart();
      toast.success('Order placed successfully!');
      navigate(ROUTES.ORDER_SUCCESS);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Payment succeeded but order creation failed. Please contact support.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (paymentMethod === 'COD') {
      await handleCODOrder(data);
    }
  };

  const goToStep = async (nextStep) => {
    if (nextStep < step) {
      setStep(nextStep);
      return;
    }
    if (step === 1 && nextStep === 2) {
      const valid = await trigger(['fullName', 'phone', 'street', 'city', 'state', 'zipCode']);
      if (!valid) {
        toast.error('Please complete all shipping fields before continuing.');
        return;
      }
    }
    setStep(nextStep);
  };

  const shippingData = getValues();
  const subtotal = cart.totalPrice;
  const shipping = subtotal > 5000 ? 0 : 150;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        
        {/* ───────────────────────── STEP 1: Shipping Address ───────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-surface-150 dark:border-surface-800 select-none">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/20">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-450" />
              </div>
              <div>
                <h3 className="text-sm font-black text-surface-900 dark:text-white uppercase tracking-wider font-display">Shipping Address</h3>
                <p className="text-2xs font-extrabold text-surface-450 uppercase tracking-widest mt-1">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name" error={errors.fullName?.message} icon={User}>
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  className={inputClass}
                  placeholder="Muhammad Kamran"
                />
              </Field>

              <Field label="Phone Number" error={errors.phone?.message} icon={Phone}>
                <input
                  {...register('phone', { required: 'Phone number is required' })}
                  className={inputClass}
                  placeholder="+92 317 5718391"
                />
              </Field>
            </div>

            <Field label="Street Address" error={errors.street?.message} icon={MapPin}>
              <input
                {...register('street', { required: 'Street address is required' })}
                className={inputClass}
                placeholder="House #, Street, Area"
              />
            </Field>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="City" error={errors.city?.message}>
                <input
                  {...register('city', { required: 'City is required' })}
                  className={inputClassNoIcon}
                  placeholder="Rawalpindi"
                />
              </Field>
              <Field label="State / Province" error={errors.state?.message}>
                <input
                  {...register('state', { required: 'State is required' })}
                  className={inputClassNoIcon}
                  placeholder="Punjab"
                />
              </Field>
              <Field label="Zip Code" error={errors.zipCode?.message}>
                <input
                  {...register('zipCode', { required: 'Zip code is required' })}
                  className={inputClassNoIcon}
                  placeholder="46000"
                />
              </Field>
            </div>

            <div className="flex justify-end pt-4 select-none">
              <Button
                type="button"
                variant="gradient"
                size="lg"
                iconRight={ChevronRight}
                onClick={() => goToStep(2)}
                className="font-extrabold uppercase tracking-widest py-3 shadow-brand"
              >
                Continue to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* ───────────────────────── STEP 2: Payment Method ───────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-surface-150 dark:border-surface-800 select-none">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/20">
                <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-450" />
              </div>
              <div>
                <h3 className="text-sm font-black text-surface-900 dark:text-white uppercase tracking-wider font-display">Payment Method</h3>
                <p className="text-2xs font-extrabold text-surface-450 uppercase tracking-widest mt-1">Choose how you would like to pay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`relative flex items-start gap-4.5 p-5 border rounded-2xl cursor-pointer transition-all duration-300 text-left ${
                  paymentMethod === 'COD'
                    ? 'border-primary-600 bg-primary-500/5 dark:bg-primary-500/10'
                    : 'border-surface-200 dark:border-surface-800 hover:border-primary-500/30'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    paymentMethod === 'COD'
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-950 text-surface-400 dark:text-surface-555'
                  }`}
                >
                  <Banknote className="w-5.5 h-5.5 stroke-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-surface-900 dark:text-white text-xs uppercase tracking-wider">Cash on Delivery</div>
                  <div className="text-3xs font-extrabold uppercase tracking-widest text-surface-450 mt-1 leading-normal">
                    Pay with cash upon package receipt
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === 'COD' ? 'border-primary-600 bg-primary-600' : 'border-surface-300 dark:border-surface-700'
                  }`}
                >
                  {paymentMethod === 'COD' && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                </div>
              </button>

              <button
                type="button"
                disabled={!isStripeConfigured}
                onClick={() => {
                  if (isStripeConfigured) {
                    setPaymentMethod('Card');
                  } else {
                    toast.error('Card payment is not available. Please use Cash on Delivery.');
                  }
                }}
                className={`relative flex items-start gap-4.5 p-5 border rounded-2xl cursor-pointer transition-all duration-300 text-left ${
                  paymentMethod === 'Card'
                    ? 'border-primary-600 bg-primary-500/5 dark:bg-primary-500/10'
                    : 'border-surface-200 dark:border-surface-800 hover:border-primary-500/30'
                } ${!isStripeConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    paymentMethod === 'Card'
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-950 text-surface-450 dark:text-surface-555'
                  }`}
                >
                  <CreditCard className="w-5.5 h-5.5 stroke-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-surface-900 dark:text-white text-xs uppercase tracking-wider">Credit/Debit Card</div>
                  <div className="text-3xs font-extrabold uppercase tracking-widest text-surface-450 mt-1 leading-normal">
                    {isStripeConfigured ? 'Pay securely with Stripe' : 'Unavailable'}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === 'Card' ? 'border-primary-600 bg-primary-600' : 'border-surface-300 dark:border-surface-700'
                  }`}
                >
                  {paymentMethod === 'Card' && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                </div>
              </button>
            </div>

            {paymentMethod === 'Card' && (
              <div className="p-4 rounded-2xl bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/10 flex items-start gap-2.5 animate-fade-in">
                <Lock className="w-4.5 h-4.5 text-primary-500 shrink-0 mt-0.5" />
                <p className="text-2xs font-extrabold uppercase tracking-wider leading-relaxed text-surface-500 dark:text-surface-400">
                  {creatingIntent
                    ? 'Initializing secure payment session...'
                    : clientSecret
                    ? 'Secure session initialized. Review your order details to proceed with stripe payment.'
                    : 'Stripe gateway session failed. Select retry or fall back to cash.'}
                  {!isStripeConfigured && ' Stripe publishable API credential missing.'}
                </p>
              </div>
            )}

            <div className="flex justify-between gap-3 pt-4 select-none">
              <Button type="button" variant="ghost" size="lg" icon={ChevronLeft} onClick={() => goToStep(1)} className="font-extrabold uppercase tracking-widest py-3">
                Back
              </Button>
              <Button
                type="button"
                variant="gradient"
                size="lg"
                iconRight={ChevronRight}
                onClick={() => goToStep(3)}
                disabled={paymentMethod === 'Card' && !clientSecret && !creatingIntent}
                className="font-extrabold uppercase tracking-widest py-3 shadow-brand"
              >
                {paymentMethod === 'Card' && creatingIntent ? 'Preparing Gateway...' : 'Continue to Review'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ───────────────────────── STEP 3: Review & Place Order ───────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-surface-150 dark:border-surface-800 select-none">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/20">
                <PackageCheck className="w-5 h-5 text-primary-600 dark:text-primary-450" />
              </div>
              <div>
                <h3 className="text-sm font-black text-surface-900 dark:text-white uppercase tracking-wider font-display">Review Your Order</h3>
                <p className="text-2xs font-extrabold text-surface-455 uppercase tracking-widest mt-1">Please confirm your metrics before checkout</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-50/50 dark:bg-surface-950/30 border border-surface-150 dark:border-surface-850">
              <div className="flex items-center justify-between mb-3.5 select-none">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-primary-500" />
                  <span className="text-2xs font-extrabold uppercase tracking-widest text-surface-400 dark:text-surface-500">Delivery Address</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 transition-colors cursor-pointer"
                >
                  <PencilLine className="w-4 h-4" /> Edit
                </button>
              </div>
              <div className="text-sm text-surface-700 dark:text-surface-200 space-y-0.5">
                <div className="font-bold text-surface-900 dark:text-white">{shippingData.fullName}</div>
                <div className="text-xs font-semibold text-surface-500 dark:text-surface-400 font-mono mt-1">{shippingData.phone}</div>
                <div className="font-medium text-surface-600 dark:text-surface-300 mt-2 text-xs">
                  {shippingData.street}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-50/50 dark:bg-surface-950/30 border border-surface-150 dark:border-surface-850">
              <div className="flex items-center justify-between mb-3.5 select-none">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4.5 h-4.5 text-primary-500" />
                  <span className="text-2xs font-extrabold uppercase tracking-widest text-surface-400 dark:text-surface-500">Selected Payment</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 transition-colors cursor-pointer"
                >
                  <PencilLine className="w-4 h-4" /> Edit
                </button>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-surface-800 dark:text-white">
                {paymentMethod === 'COD' ? (
                  <>
                    <Banknote className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Cash on Delivery</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span>Secure Card Payment (Stripe)</span>
                  </>
                )}
              </div>
            </div>

            {paymentMethod === 'COD' && (
              <>
                <div className="p-4 rounded-2xl bg-success-soft/20 text-success border border-success/15 flex items-center gap-3.5 select-none animate-fade-in">
                  <ShieldCheck className="w-5.5 h-5.5 shrink-0 stroke-[2.5]" />
                  <p className="text-2xs font-extrabold uppercase tracking-widest leading-relaxed text-surface-500 dark:text-surface-400">
                    By submitting this transaction, you authorize payment of <span className="font-black text-surface-850 dark:text-white font-mono">{formatCurrency(subtotal + shipping)}</span> in cash upon delivery.
                  </p>
                </div>

                <div className="flex justify-between gap-3 pt-4 select-none">
                  <Button type="button" variant="ghost" size="lg" icon={ChevronLeft} onClick={() => goToStep(2)} className="font-extrabold uppercase tracking-widest py-3">
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    size="lg"
                    loading={loading}
                    icon={PackageCheck}
                    onClick={handleSubmit(onSubmit)}
                    className="flex-1 sm:flex-initial font-extrabold uppercase tracking-widest py-3 shadow-brand"
                  >
                    Place Order · {formatCurrency(subtotal + shipping)}
                  </Button>
                </div>
              </>
            )}

            {paymentMethod === 'Card' && (
              <div className="space-y-4">
                {creatingIntent ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-surface-500 select-none animate-fade-in">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-550 stroke-2" />
                    <span className="text-2xs font-extrabold uppercase tracking-widest">Initializing Secure Gateway...</span>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          borderRadius: '14px',
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      onSuccess={handlePaymentSuccess}
                      clientSecret={clientSecret}
                      orderLoading={loading}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-6 select-none animate-fade-in space-y-3">
                    <p className="text-2xs font-extrabold uppercase tracking-wider text-danger">
                      Failed to configure payment session. Select Cash on Delivery or retry.
                    </p>
                    <button
                      type="button"
                      onClick={handleCreatePaymentIntent}
                      className="inline-flex items-center gap-1.5 text-2xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retry Connection
                    </button>
                  </div>
                )}

                <div className="flex justify-start select-none pt-2">
                  <Button type="button" variant="ghost" size="md" icon={ChevronLeft} onClick={() => goToStep(2)} className="font-extrabold uppercase tracking-widest">
                    Back to Payment
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutForm;