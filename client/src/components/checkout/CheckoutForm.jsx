import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  ShieldCheck,
  PackageCheck,
  Banknote,
  PencilLine,
  RotateCcw,
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

// Shared input classes
const inputClass =
  'w-full pl-10 pr-3 py-2.5 border border-surface-200 dark:border-surface-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 text-sm font-medium bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all';
const inputClassNoIcon =
  'w-full px-3.5 py-2.5 border border-surface-200 dark:border-surface-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 text-sm font-medium bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all';

const Field = ({ label, error, children, icon: Icon }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-surface-600 dark:text-surface-300">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" strokeWidth={2} />
      )}
      {children}
    </div>
    {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5"><span className="w-1 h-1 bg-red-500 rounded-full" />{error}</p>}
  </div>
);

/**
 * CheckoutForm — Editorial Modern Redesign
 *
 * Same 3-step flow (Shipping → Payment → Review), same Stripe + COD logic,
 * same validation. Refined inputs, sentence case labels.
 *
 * Props (unchanged): onStepChange
 */
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
    shouldUnregister: false,
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
    <div className="space-y-5">
      <AnimatePresence mode="wait">

        {/* ─── STEP 1: Shipping Address ─── */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-800">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                <MapPin className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white font-display">Shipping Address</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Where should we deliver your order?</p>
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

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                iconRight={ChevronRight}
                onClick={() => goToStep(2)}
              >
                Continue to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── STEP 2: Payment Method ─── */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-800">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                <CreditCard className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white font-display">Payment Method</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Choose how you would like to pay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* COD option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`relative flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors text-left ${
                  paymentMethod === 'COD'
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                    : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === 'COD'
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-400'
                  }`}
                >
                  <Banknote className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-surface-900 dark:text-white text-sm">Cash on Delivery</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    Pay with cash upon receipt
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === 'COD' ? 'border-primary-600 bg-primary-600' : 'border-surface-300 dark:border-surface-700'
                  }`}
                >
                  {paymentMethod === 'COD' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </button>

              {/* Card option */}
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
                className={`relative flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors text-left ${
                  paymentMethod === 'Card'
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                    : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700'
                } ${!isStripeConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === 'Card'
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-surface-900 dark:text-white text-sm">Credit / Debit Card</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    {isStripeConfigured ? 'Pay securely with Stripe' : 'Unavailable'}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    paymentMethod === 'Card' ? 'border-primary-600 bg-primary-600' : 'border-surface-300 dark:border-surface-700'
                  }`}
                >
                  {paymentMethod === 'Card' && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </button>
            </div>

            {paymentMethod === 'Card' && (
              <div className="p-3.5 rounded-lg bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/30 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                  {creatingIntent
                    ? 'Initializing secure payment session...'
                    : clientSecret
                    ? 'Secure session ready. Continue to review your order.'
                    : 'Stripe session failed. Retry or use Cash on Delivery.'}
                  {!isStripeConfigured && ' Stripe publishable key missing.'}
                </p>
              </div>
            )}

            <div className="flex justify-between gap-3 pt-2">
              <Button type="button" variant="ghost" size="lg" icon={ChevronLeft} onClick={() => goToStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
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

        {/* ─── STEP 3: Review & Place Order ─── */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-800">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                <PackageCheck className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white font-display">Review Your Order</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Please confirm before placing your order</p>
              </div>
            </div>

            {/* Delivery address review */}
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Delivery Address</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors cursor-pointer"
                >
                  <PencilLine className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="text-sm text-surface-700 dark:text-surface-200 space-y-0.5">
                <div className="font-medium text-surface-900 dark:text-white">{shippingData.fullName}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400 font-mono mt-1">{shippingData.phone}</div>
                <div className="text-sm text-surface-600 dark:text-surface-300 mt-1.5">
                  {shippingData.street}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                </div>
              </div>
            </div>

            {/* Payment method review */}
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Payment Method</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors cursor-pointer"
                >
                  <PencilLine className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-surface-900 dark:text-white">
                {paymentMethod === 'COD' ? (
                  <>
                    <Banknote className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
                    <span>Cash on Delivery</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
                    <span>Secure Card Payment (Stripe)</span>
                  </>
                )}
              </div>
            </div>

            {/* COD flow */}
            {paymentMethod === 'COD' && (
              <>
                <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                    By placing this order, you agree to pay <span className="font-semibold text-surface-900 dark:text-white font-mono">{formatCurrency(subtotal + shipping)}</span> in cash upon delivery.
                  </p>
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <Button type="button" variant="ghost" size="lg" icon={ChevronLeft} onClick={() => goToStep(2)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
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

            {/* Card flow */}
            {paymentMethod === 'Card' && (
              <div className="space-y-4">
                {creatingIntent ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-surface-500">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" strokeWidth={2} />
                    <span className="text-sm">Initializing secure gateway...</span>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={getStripe()}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          borderRadius: '8px',
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
                  <div className="text-center py-6 space-y-3">
                    <p className="text-sm text-red-500">
                      Failed to initialize payment. Use Cash on Delivery or retry.
                    </p>
                    <button
                      type="button"
                      onClick={handleCreatePaymentIntent}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retry Connection
                    </button>
                  </div>
                )}

                <div className="flex justify-start pt-2">
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