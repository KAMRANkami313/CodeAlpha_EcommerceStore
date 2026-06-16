import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StripePaymentForm = ({ onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
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
      <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          'Pay Now'
        )}
      </button>

      <p className="text-xs text-center text-surface-400 dark:text-surface-500">
        Your payment information is secured with Stripe. We never store your card details.
      </p>
    </form>
  );
};

export default StripePaymentForm;