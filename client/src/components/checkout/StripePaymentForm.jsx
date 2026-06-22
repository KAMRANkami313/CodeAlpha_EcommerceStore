import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const StripePaymentForm = ({ onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    // 1. Prevent standard browser submission
    e.preventDefault();
    
    // 2. Prevent the click event from bubbling up to any parent <form> tags!
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
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      
      {/* Redesigned Glass Header Panel */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-linear-to-r from-primary-50 to-violet-50 dark:from-primary-950/20 dark:to-violet-950/20 border border-primary-500/10 dark:border-primary-500/15 shadow-inner select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-surface-900 flex items-center justify-center border border-surface-200/40 dark:border-surface-800/30">
            <CreditCard className="w-5.5 h-5.5 text-primary-600 dark:text-primary-455" />
          </div>
          <div>
            <div className="text-sm font-black text-surface-900 dark:text-white leading-none">Stripe Checkout</div>
            <div className="text-[10px] font-bold text-surface-450 dark:text-surface-500 uppercase tracking-widest mt-1.5">Secure payment gateway</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-2xs font-extrabold text-success uppercase tracking-widest bg-success-soft/20 px-2.5 py-1 rounded-md border border-success/15 select-none">
          <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Encrypted</span>
        </div>
      </div>

      {/* Styled Payment Element Wrapper */}
      <div className="p-4 rounded-2xl border border-surface-150 dark:border-surface-850 bg-white dark:bg-surface-950 shadow-xs relative">
        {!isReady && (
          <div className="absolute inset-0 bg-white dark:bg-surface-950 rounded-2xl flex items-center justify-center gap-2 select-none z-10">
            <Loader2 className="w-5 h-5 animate-spin text-primary-550" />
            <span className="text-2xs font-extrabold uppercase tracking-widest text-surface-450">Loading secure terminal...</span>
          </div>
        )}
        <PaymentElement
          onReady={() => setIsReady(true)}
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message Panel */}
      {message && (
        <div className="p-4 rounded-xl bg-danger-soft/10 text-danger border border-danger/15 select-none animate-fade-in">
          <p className="text-xs font-bold leading-snug">{message}</p>
        </div>
      )}

      {/* Pay CTA Button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements || !isReady}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-750 text-white rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-brand hover:shadow-lg select-none"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white stroke-[2.5]" />
            Processing Transaction...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay Securely Now
          </>
        )}
      </button>

      {/* Trust Footnote */}
      <div className="flex items-start justify-center gap-2 text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest leading-snug select-none text-center max-w-sm mx-auto">
        <ShieldCheck className="w-4 h-4 text-surface-400 shrink-0 stroke-2" />
        <span>Your payment details are encrypted. We never store credit cards on our databases.</span>
      </div>
    </form>
  );
};

export default StripePaymentForm;