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

// Load Stripe outside of component render to avoid recreating instance
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
  'w-full pl-11 pr-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all';
const inputClassNoIcon =
  'w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all';

const Field = ({ label, error, children, icon: Icon }) => (
  <div>
    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
      )}
      {children}
    </div>
    {error && <p className="text-danger text-xs mt-1.5 flex items-center gap-1">{error}</p>}
  </div>
);

const CheckoutForm = ({ onStepChange }) => {
  const [step, setStep] = useState(1); // 1=Shipping, 2=Payment, 3=Review
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
  });

  // Notify parent of step changes (for the progress indicator)
  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // When user selects Card, create a payment intent
  // FIX: Added !creatingIntent guard to prevent race condition
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

  // Handle COD order
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

  // Handle Card payment success — create order with stripePaymentId
  const handlePaymentSuccess = async (paymentIntentId) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please fill in all shipping details before completing payment.');
      setStep(1);
      return;
    }

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
    // For Card, the StripePaymentForm handles submission
  };

  // Step navigation
  const goToStep = async (nextStep) => {
    if (nextStep < step) {
      setStep(nextStep);
      return;
    }
    // Going forward — validate shipping fields before leaving step 1
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
      {/* ───────────────────────── STEP 1: Shipping Address ───────────────────────── */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-surface-100 dark:border-surface-700">
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-surface-800 dark:text-white">Shipping Address</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400">Where should we deliver your order?</p>
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

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="gradient"
                size="lg"
                iconRight={ChevronRight}
                onClick={() => goToStep(2)}
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
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-surface-100 dark:border-surface-700">
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-surface-800 dark:text-white">Payment Method</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400">Choose how you'd like to pay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`relative flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all text-left ${
                  paymentMethod === 'COD'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 shadow-sm'
                    : 'border-surface-200 dark:border-surface-600 hover:border-primary-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'COD'
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-500'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-surface-800 dark:text-white text-sm">Cash on Delivery</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    Pay with cash when your order arrives
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'COD' ? 'border-primary-600 bg-primary-600' : 'border-surface-300 dark:border-surface-600'
                  }`}
                >
                  {paymentMethod === 'COD' && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>

              {/* Card */}
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
                className={`relative flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all text-left ${
                  paymentMethod === 'Card'
                    ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-900/20 shadow-sm'
                    : 'border-surface-200 dark:border-surface-600 hover:border-primary-400'
                } ${!isStripeConfigured ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'Card'
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-500'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-surface-800 dark:text-white text-sm">Card Payment</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    {isStripeConfigured ? 'Pay securely with Stripe' : 'Not configured yet'}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'Card' ? 'border-primary-600 bg-primary-600' : 'border-surface-300 dark:border-surface-600'
                  }`}
                >
                  {paymentMethod === 'Card' && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            </div>

            {/* Card payment note */}
            {paymentMethod === 'Card' && (
              <div className="p-3 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/40 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <p className="text-xs text-surface-600 dark:text-surface-300">
                  {creatingIntent
                    ? 'Initializing secure payment session...'
                    : clientSecret
                    ? 'Secure session ready. Continue to review your order, then enter your card details.'
                    : 'Click retry to initialize payment, or use Cash on Delivery.'}
                  {!isStripeConfigured && ' Card payments are currently unavailable.'}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between gap-3 pt-2">
              <Button type="button" variant="ghost" size="lg" icon={ChevronLeft} onClick={() => goToStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                variant="gradient"
                size="lg"
                iconRight={ChevronRight}
                onClick={() => goToStep(3)}
                disabled={paymentMethod === 'Card' && !clientSecret && !creatingIntent}
              >
                {paymentMethod === 'Card' && creatingIntent ? 'Preparing...' : 'Continue to Review'}
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
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-surface-100 dark:border-surface-700">
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <PackageCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-surface-800 dark:text-white">Review Your Order</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400">Please confirm before placing your order</p>
              </div>
            </div>

            {/* Shipping details review */}
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-surface-800 dark:text-white">Delivery Address</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                >
                  <PencilLine className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="text-sm text-surface-700 dark:text-surface-200 space-y-0.5">
                <div className="font-semibold">{shippingData.fullName}</div>
                <div className="text-surface-500 dark:text-surface-400">{shippingData.phone}</div>
                <div>
                  {shippingData.street}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                </div>
              </div>
            </div>

            {/* Payment method review */}
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-surface-800 dark:text-white">Payment Method</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                >
                  <PencilLine className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
                {paymentMethod === 'COD' ? (
                  <>
                    <Banknote className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="font-medium">Cash on Delivery</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="font-medium">Card Payment (Stripe)</span>
                  </>
                )}
              </div>
            </div>

            {/* COD: Place Order button */}
            {paymentMethod === 'COD' && (
              <>
                <div className="p-4 rounded-xl bg-success/5 border border-success/20 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-success shrink-0" />
                  <p className="text-xs text-surface-600 dark:text-surface-300">
                    By placing this order, you agree to pay <span className="font-semibold">{formatCurrency(subtotal + shipping)}</span> in cash upon delivery.
                  </p>
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <Button type="button" variant="ghost" size="lg" icon={ChevronLeft} onClick={() => goToStep(2)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="gradient"
                    size="lg"
                    loading={loading}
                    icon={PackageCheck}
                    onClick={handleSubmit(onSubmit)}
                    className="flex-1 sm:flex-initial"
                  >
                    Place Order · {formatCurrency(subtotal + shipping)}
                  </Button>
                </div>
              </>
            )}

            {/* Card: Stripe payment form */}
            {paymentMethod === 'Card' && (
              <div className="space-y-4">
                {creatingIntent ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-surface-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Initializing payment...</span>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          borderRadius: '12px',
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
                  <div className="text-center py-4">
                    <p className="text-sm text-danger">
                      Failed to initialize payment. Please try again or use Cash on Delivery.
                    </p>
                    <button
                      type="button"
                      onClick={handleCreatePaymentIntent}
                      className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                <div className="flex justify-start">
                  <Button type="button" variant="ghost" size="md" icon={ChevronLeft} onClick={() => goToStep(2)}>
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