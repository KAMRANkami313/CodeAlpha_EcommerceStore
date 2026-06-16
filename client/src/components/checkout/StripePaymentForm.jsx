import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const StripePaymentForm = ({ onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
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
        redirect: 'if_required',
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
      {/* Brand header */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 border border-primary-100 dark:border-primary-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-800 flex items-center justify-center shadow-sm">
            <CreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-surface-800 dark:text-white">Stripe</div>
            <div className="text-[10px] text-surface-500 dark:text-surface-400">Secure card payment</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-success font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Payment element wrapper */}
      <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error message */}
      {message && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
        </div>
      )}

      {/* Pay button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 text-white rounded-xl transition-all font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay Securely Now
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Your payment information is secured with Stripe. We never store your card details.</span>
      </div>
    </form>
  );
};

export default StripePaymentForm;