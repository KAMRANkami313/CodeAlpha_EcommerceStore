import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  Phone,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  Home as HomeIcon,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import orderService from '../services/orderService.js';
import Badge from '../components/common/Badge.jsx';
import Loader from '../components/common/Loader.jsx';
import Button from '../components/common/Button.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import ROUTES from '../constants/ROUTES.js';

const statusColors = {
  processing: 'warning',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

const statusSteps = [
  { key: 'processing', label: 'Order Placed', desc: 'We received your order', icon: Clock },
  { key: 'shipped', label: 'Shipped', desc: 'On the way to you', icon: Truck },
  { key: 'delivered', label: 'Delivered', desc: 'Package arrived', icon: CheckCircle },
];

const OrderDetailPage = () => {
  const { id } = useParams();

  const fetchOrder = useCallback(
    (signal) => orderService.getOrderById(id, { signal }),
    [id]
  );
  const { data: orderData, loading, error } = useFetch(fetchOrder, [fetchOrder]);

  if (loading) return <Loader label="Loading order details..." />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 mx-auto rounded-xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-5 border border-red-200 dark:border-red-900/30">
          <XCircle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2 font-display">Couldn't load order</h2>
        <p className="text-red-500 text-sm mb-8 max-w-sm mx-auto">{error}</p>
        <Link to={ROUTES.PROFILE} className="no-underline">
          <Button variant="outline" icon={ChevronLeft}>Back to Profile</Button>
        </Link>
      </div>
    );
  }

  const order = orderData?.order || orderData;
  if (!order) return null;

  const isCancelled = order.orderStatus === 'cancelled';
  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-700" />
        <Link to={ROUTES.PROFILE} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors no-underline">
          My Account
        </Link>
        <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-700" />
        <span className="text-surface-800 dark:text-white truncate font-medium">Order #{order._id?.slice(-8).toUpperCase()}</span>
      </nav>

      <Link
        to={ROUTES.PROFILE}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 no-underline transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 sm:p-7 mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isCancelled ? 'bg-red-50 dark:bg-red-950/20' :
              order.orderStatus === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-950/20' :
              order.orderStatus === 'shipped' ? 'bg-primary-50 dark:bg-primary-950/30' :
              'bg-amber-50 dark:bg-amber-950/20'
            }`}>
              <Package className={`w-6 h-6 ${
                isCancelled ? 'text-red-500' :
                order.orderStatus === 'delivered' ? 'text-emerald-500' :
                order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                'text-amber-500'
              }`} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary-500" />
                Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[order.orderStatus]} size="md" className="capitalize self-start sm:self-center">
            {order.orderStatus}
          </Badge>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div className="mt-7 pt-7 border-t border-surface-200 dark:border-surface-800">
            <div className="relative flex items-start justify-between max-w-2xl mx-auto">
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-surface-200 dark:bg-surface-800" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 80}%` }}
                transition={{ duration: 0.6 }}
                className="absolute top-5 left-[10%] h-0.5 bg-primary-600"
              />

              {statusSteps.map((step, i) => {
                const StepIcon = step.icon;
                const isComplete = i < currentStepIndex;
                const isActive = i === currentStepIndex;
                return (
                  <div key={step.key} className="relative flex flex-col items-center z-10 flex-1">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isComplete
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : isActive
                          ? 'bg-white dark:bg-surface-900 border-primary-500 text-primary-500'
                          : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800 text-surface-400'
                      }`}
                    >
                      {isComplete ? <CheckCircle className="w-5 h-5" strokeWidth={2} /> : <StepIcon className="w-5 h-5" strokeWidth={2} />}
                    </motion.div>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-medium ${isActive || isComplete ? 'text-surface-900 dark:text-white' : 'text-surface-400 dark:text-surface-500'}`}>
                        {step.label}
                      </div>
                      <div className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 hidden sm:block">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm font-medium text-red-600 dark:text-red-400">This order was cancelled.</p>
          </div>
        )}
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: items + payment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-surface-800 dark:text-white">
              Items ({order.items?.length})
            </h2>
            <span className="text-sm text-surface-500 dark:text-surface-400">
              {order.items?.reduce((sum, i) => sum + i.quantity, 0)} total units
            </span>
          </div>

          {order.items?.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 flex gap-4"
            >
              <div className="w-18 h-18 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-950 shrink-0 border border-surface-200 dark:border-surface-800">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-7 h-7 text-surface-300 dark:text-surface-600" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="font-medium text-sm text-surface-900 dark:text-white line-clamp-1 leading-snug">{item.name}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-baseline justify-between mt-1 flex-wrap gap-2">
                  <p className="font-semibold text-sm tabular-nums text-surface-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 font-mono">{formatCurrency(item.price)} each</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Payment summary */}
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-white mb-4">Payment Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-surface-500 dark:text-surface-400">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-surface-900 dark:text-white">{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-surface-500 dark:text-surface-400">
                <span>Shipping</span>
                <span className="tabular-nums font-medium text-surface-900 dark:text-white">{order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between font-semibold text-surface-900 dark:text-white pt-3 mt-2 border-t border-surface-200 dark:border-surface-800">
                <span>Total</span>
                <span className="text-base sm:text-lg tabular-nums">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: shipping + payment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Shipping address */}
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm text-surface-600 dark:text-surface-300 space-y-2">
                <p className="font-semibold text-surface-900 dark:text-white">{order.shippingAddress.fullName}</p>
                <p className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-surface-400" />
                  {order.shippingAddress.phone}
                </p>
                <p className="pt-2 border-t border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-400">
                  {order.shippingAddress.street}
                </p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                {order.shippingAddress.country && <p className="text-surface-400 font-medium">{order.shippingAddress.country}</p>}
              </div>
            ) : (
              <p className="text-sm text-surface-400">No shipping information available</p>
            )}
          </div>

          {/* Payment status */}
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-white flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Payment Status
            </h3>
            <div className="text-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-surface-500 dark:text-surface-400">Method</span>
                <span className="font-medium text-surface-900 dark:text-white">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-500 dark:text-surface-400">Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="capitalize">
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-surface-200 dark:border-surface-800 text-xs text-surface-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2} />
                <span>Secured transaction</span>
              </div>
            </div>
          </div>

          {/* Delivered badge */}
          {order.deliveredAt && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/30 p-5 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" strokeWidth={2} />
              <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">Delivered on</p>
              <p className="text-surface-900 dark:text-white font-semibold text-sm mt-1">
                {new Date(order.deliveredAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          )}

          {/* Help */}
          <div className="bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-200 dark:border-primary-900/30 p-5">
            <h3 className="font-semibold text-surface-900 dark:text-white text-sm mb-1">Need help?</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 leading-relaxed">
              Our support team is ready to assist you with any questions.
            </p>
            <a
              href="mailto:support@shopverse.com"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors no-underline"
            >
              <Mail className="w-3.5 h-3.5" />
              support@shopverse.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailPage;