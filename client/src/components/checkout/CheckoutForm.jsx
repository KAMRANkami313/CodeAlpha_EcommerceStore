import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin, CreditCard, Truck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import orderService from '../../services/orderService.js';
import useCart from '../../hooks/useCart.js';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button.jsx';
import StripePaymentForm from './StripePaymentForm.jsx';
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

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [clientSecret, setClientSecret] = useState(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const { cart, emptyCart } = useCart();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues, trigger } = useForm();

  // When user selects Card, create a payment intent
  useEffect(() => {
    if (paymentMethod === 'Card' && isStripeConfigured && !clientSecret) {
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
    // Validate shipping fields BEFORE creating the order
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please fill in all shipping details before completing payment.');
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
      toast.error(error.response?.data?.message || 'Payment succeeded but order creation failed. Please contact support.');
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-surface-800 dark:text-white flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" /> Shipping Address
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full pl-10 pr-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
              placeholder="Muhammad Kamran"
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full pl-10 pr-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
              placeholder="+92 317 5718391"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Street Address</label>
        <input
          {...register('street', { required: 'Street address is required' })}
          className="w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
          placeholder="123 Main Street"
        />
        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">City</label>
          <input
            {...register('city', { required: 'City is required' })}
            className="w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
            placeholder="Rawalpindi"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">State</label>
          <input
            {...register('state', { required: 'State is required' })}
            className="w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
            placeholder="Punjab"
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Zip Code</label>
          <input
            {...register('zipCode', { required: 'Zip code is required' })}
            className="w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
            placeholder="46000"
          />
          {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
        </div>
      </div>

      {/* Payment Method Selection */}
      <h3 className="text-lg font-bold text-surface-800 dark:text-white pt-4">Payment Method</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
          paymentMethod === 'COD'
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
            : 'border-surface-200 dark:border-surface-600 hover:border-primary-400'
        }`}>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === 'COD'}
            onChange={() => setPaymentMethod('COD')}
            className="accent-primary-600"
          />
          <Truck className="w-5 h-5 text-primary-600 shrink-0" />
          <div>
            <span className="font-medium text-surface-700 dark:text-surface-300 block">Cash on Delivery</span>
            <span className="text-xs text-surface-500 dark:text-surface-400">Pay when you receive</span>
          </div>
        </label>

        <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
          paymentMethod === 'Card'
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
            : 'border-surface-200 dark:border-surface-600 hover:border-primary-400'
        } ${!isStripeConfigured ? 'opacity-60' : ''}`}>
          <input
            type="radio"
            value="Card"
            checked={paymentMethod === 'Card'}
            onChange={() => {
              if (isStripeConfigured) {
                setPaymentMethod('Card');
              } else {
                toast.error('Card payment is not available. Please use Cash on Delivery.');
              }
            }}
            className="accent-primary-600"
            disabled={!isStripeConfigured}
          />
          <CreditCard className="w-5 h-5 text-primary-600 shrink-0" />
          <div>
            <span className="font-medium text-surface-700 dark:text-surface-300 block">Card Payment</span>
            <span className="text-xs text-surface-500 dark:text-surface-400">
              {isStripeConfigured ? 'Pay securely with Stripe' : 'Not configured yet'}
            </span>
          </div>
        </label>
      </div>

      {/* Stripe Payment Form */}
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
              <p className="text-sm text-red-500 dark:text-red-400">
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
        </div>
      )}

      {/* COD Submit Button */}
      {paymentMethod === 'COD' && (
        <Button 
          type="button" 
          onClick={handleSubmit(onSubmit)} 
          loading={loading} 
          variant="accent" 
          size="lg" 
          className="w-full mt-4"
        >
          Place Order (Cash on Delivery)
        </Button>
      )}

      {/* Card payment note */}
      {paymentMethod === 'Card' && clientSecret && (
        <p className="text-xs text-center text-surface-400 dark:text-surface-500 mt-2">
          Your shipping details above will be used when you complete payment.
        </p>
      )}
    </div>
  );
};

export default CheckoutForm;