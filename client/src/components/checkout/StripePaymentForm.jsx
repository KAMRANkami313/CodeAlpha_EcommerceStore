import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * StripePaymentForm — Editorial Modern Redesign
 *
 * Clean header, sentence case, solid primary pay button.
 * Same Stripe hooks, confirmPayment logic, and error handling.
 *
 * Props (unchanged):
 *   onSuccess    — callback(paymentIntentId) on successful payment
 *   clientSecret — Stripe client secret (used to confirm we have a valid session)
 */
const StripePaymentForm = ({ onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    // Prevent standard browser submission AND bubbling to parent forms
    e.preventDefault();
    e.stopPropagation();

    if (!stripe || !elements || !isReady) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: 'ifRequired',
      });

      if (error) {
        setMessage(error.message || 'Payment failed. Please try again.');
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess(paymentIntent.id);
      } else {
        setMessage('Payment processing. Please wait...');
      }
    } catch (err) {
      setMessage('An unexpected error occurred.');
      toast.error('Payment error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-50 dark:bg-surface-950/40 border border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-900 flex items-center justify-center border border-surface-200 dark:border-surface-800">
            <CreditCard className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm font-semibold text-surface-900 dark:text-white leading-none">Stripe Checkout</div>
            <div className="text-[11px] text-surface-500 dark:text-surface-400 mt-1">Secure payment gateway</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-md">
          <Lock className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Payment element */}
      <div className="p-4 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 relative">
        {!isReady && (
          <div className="absolute inset-0 bg-white dark:bg-surface-950 rounded-lg flex items-center justify-center gap-2 z-10">
            <Loader2 className="w-5 h-5 animate-spin text-primary-500" strokeWidth={2} />
            <span className="text-sm text-surface-500">Loading secure terminal...</span>
          </div>
        )}
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error message */}
      {message && (
        <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
          <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
        </div>
      )}

      {/* Pay button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements || !isReady}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" strokeWidth={2} />
            Pay Securely Now
          </>
        )}
      </button>

      {/* Trust footnote */}
      <div className="flex items-start justify-center gap-2 text-xs text-surface-400 dark:text-surface-500 leading-snug text-center max-w-sm mx-auto">
        <ShieldCheck className="w-4 h-4 text-surface-400 shrink-0 mt-0.5" strokeWidth={2} />
        <span>Your payment details are encrypted. We never store credit card information.</span>
      </div>
    </form>
  );
};

export default StripePaymentForm;