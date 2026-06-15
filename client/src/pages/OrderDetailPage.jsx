import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, MapPin, CreditCard, Phone } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import orderService from '../services/orderService.js';
import Badge from '../components/common/Badge.jsx';
import Loader from '../components/common/Loader.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import ROUTES from '../constants/ROUTES.js';

const statusColors = {
  processing: 'warning',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

const statusSteps = ['processing', 'shipped', 'delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: orderData, loading, error } = useFetch(() => orderService.getOrderById(id), [id]);

  if (loading) return <Loader />;
  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <p className="text-red-500">{error}</p>
      <Link to={ROUTES.PROFILE} className="text-primary-600 hover:underline mt-4 inline-block">Back to Profile</Link>
    </div>
  );

  const order = orderData?.order || orderData;
  if (!order) return null;

  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to={ROUTES.PROFILE} className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-primary-600 mb-6 no-underline">
        <ChevronLeft className="w-4 h-4" /> Back to Profile
      </Link>

      {/* Order Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-surface-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Order #{order._id?.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <Badge variant={statusColors[order.orderStatus]} className="text-sm">
            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
          </Badge>
        </div>

        {/* Status Tracker (only for non-cancelled orders) */}
        {order.orderStatus !== 'cancelled' && (
          <div className="mt-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-surface-200">
                <div
                  className="h-full bg-primary-600 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              {statusSteps.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    i <= currentStepIndex
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-surface-300 text-surface-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs mt-2 capitalize ${i <= currentStepIndex ? 'text-primary-600 font-semibold' : 'text-surface-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-surface-800">Items ({order.items?.length})</h2>
          {order.items?.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-surface-200 p-4 flex gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-surface-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-800 truncate">{item.name}</p>
                <p className="text-sm text-surface-500 mt-0.5">Qty: {item.quantity}</p>
                <p className="font-bold text-surface-900 mt-1">{formatCurrency(item.price * item.quantity)}</p>
              </div>
              <p className="text-sm text-surface-400 shrink-0">{formatCurrency(item.price)} each</p>
            </div>
          ))}

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-surface-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-surface-500">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-surface-900 text-base pt-2 border-t border-surface-200">
                <span>Total</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar — Shipping & Payment */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 className="font-semibold text-surface-800 flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary-600" /> Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm text-surface-600 space-y-1">
                <p className="font-medium text-surface-800">{order.shippingAddress.fullName}</p>
                <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className="text-sm text-surface-400">No shipping info</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 className="font-semibold text-surface-800 flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary-600" /> Payment
            </h3>
            <div className="text-sm space-y-1">
              <p className="text-surface-600">Method: <span className="font-medium text-surface-800">{order.paymentMethod}</span></p>
              <p className="text-surface-600">Status: <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>{order.paymentStatus}</Badge></p>
            </div>
          </div>

          {/* Delivered Date */}
          {order.deliveredAt && (
            <div className="bg-green-50 rounded-2xl border border-green-200 p-5 text-center">
              <p className="text-green-700 font-medium text-sm">Delivered on</p>
              <p className="text-green-800 font-bold">{new Date(order.deliveredAt).toLocaleDateString('en-PK', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailPage;