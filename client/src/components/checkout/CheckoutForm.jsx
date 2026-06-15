import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService.js';
import useCart from '../../hooks/useCart.js';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button.jsx';
import ROUTES from '../../constants/ROUTES.js';

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const { cart, emptyCart } = useCart();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await orderService.createOrder({
        shippingAddress: data,
        paymentMethod: data.paymentMethod,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="text-lg font-bold text-surface-800 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary-600" /> Shipping Address
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register('fullName', { required: 'Required' })}
              className="w-full pl-10 pr-4 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="Muhammad Kamran"
            />
          </div>
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              {...register('phone', { required: 'Required' })}
              className="w-full pl-10 pr-4 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="+92 317 5718391"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1">Street Address</label>
        <input
          {...register('street', { required: 'Required' })}
          className="w-full px-4 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          placeholder="123 Main Street"
        />
        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">City</label>
          <input
            {...register('city', { required: 'Required' })}
            className="w-full px-4 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="Rawalpindi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">State</label>
          <input
            {...register('state', { required: 'Required' })}
            className="w-full px-4 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="Punjab"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Zip Code</label>
          <input
            {...register('zipCode', { required: 'Required' })}
            className="w-full px-4 py-2.5 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            placeholder="46000"
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-surface-800 pt-4">Payment Method</h3>
      <div className="flex gap-4">
        <label className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary-600 bg-primary-50' : 'border-surface-200 hover:border-primary-400'}`}>
          <input type="radio" value="COD" {...register('paymentMethod')} onChange={() => setPaymentMethod('COD')} defaultChecked className="accent-primary-600" />
          <span className="font-medium text-surface-700">Cash on Delivery</span>
        </label>
        <label className={`flex-1 flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Card' ? 'border-primary-600 bg-primary-50' : 'border-surface-200 hover:border-primary-400'}`}>
          <input type="radio" value="Card" {...register('paymentMethod')} onChange={() => setPaymentMethod('Card')} className="accent-primary-600" />
          <span className="font-medium text-surface-700">Card Payment</span>
        </label>
      </div>

      <Button type="submit" loading={loading} variant="accent" size="lg" className="w-full mt-4">
        Place Order
      </Button>
    </form>
  );
};

export default CheckoutForm;