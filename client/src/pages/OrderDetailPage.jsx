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
  const { data: orderData, loading, error } = useFetch(() => orderService.getOrderById(id), [id]);

  if (loading) return <Loader label="Loading order details..." />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-danger/10 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-xl font-bold text-surface-800 dark:text-white mb-2">Couldn't load order</h2>
        <p className="text-danger text-sm mb-6">{error}</p>
        <Link to={ROUTES.PROFILE}>
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 mb-4 flex-wrap" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 transition-colors">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={ROUTES.PROFILE} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          My Account
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-surface-800 dark:text-white font-medium truncate">Order #{order._id?.slice(-8).toUpperCase()}</span>
      </nav>

      <Link
        to={ROUTES.PROFILE}
        className="inline-flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 mb-5 no-underline transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Order Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 mb-6 shadow-soft"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isCancelled ? 'bg-danger/10' :
              order.orderStatus === 'delivered' ? 'bg-success/10' :
              order.orderStatus === 'shipped' ? 'bg-primary/10' :
              'bg-warning/10'
            }`}>
              <Package className={`w-6 h-6 ${
                isCancelled ? 'text-danger' :
                order.orderStatus === 'delivered' ? 'text-success' :
                order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                'text-warning'
              }`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900 dark:text-white">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[order.orderStatus]} size="md" className="capitalize self-start sm:self-center">
            {order.orderStatus}
          </Badge>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="mt-7 pt-6 border-t border-surface-100 dark:border-surface-700">
            <div className="relative flex items-start justify-between max-w-2xl mx-auto">
              {/* Background line */}
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-surface-200 dark:bg-surface-700" />
              {/* Progress line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 80}%` }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="absolute top-5 left-[10%] h-0.5 bg-linear-to-r from-primary-500 to-violet-500"
              />

              {statusSteps.map((step, i) => {
                const StepIcon = step.icon;
                const isComplete = i < currentStepIndex;
                const isActive = i === currentStepIndex;
                return (
                  <div key={step.key} className="relative flex flex-col items-center z-10 flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.15, type: 'spring' }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isComplete
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : isActive
                          ? 'bg-white dark:bg-surface-800 border-primary-600 text-primary-600 dark:text-primary-400 shadow-md scale-110'
                          : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-600 text-surface-400'
                      }`}
                    >
                      {isComplete ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </motion.div>
                    <div className="text-center mt-2.5">
                      <div className={`text-xs font-bold ${isActive || isComplete ? 'text-surface-800 dark:text-white' : 'text-surface-400 dark:text-surface-500'}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] text-surface-400 dark:text-surface-500 mt-0.5 hidden sm:block">
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
          <div className="mt-6 p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-danger shrink-0" />
            <p className="text-sm text-danger font-medium">This order was cancelled.</p>
          </div>
        )}
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items list (left, 2/3) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-surface-800 dark:text-white">
              Items ({order.items?.length})
            </h2>
            <span className="text-xs text-surface-400 dark:text-surface-500">
              {order.items?.reduce((sum, i) => sum + i.quantity, 0)} total units
            </span>
          </div>

          {order.items?.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-4 flex gap-4 hover:shadow-soft transition-shadow"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-700 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-surface-300 dark:text-surface-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-800 dark:text-white line-clamp-2">{item.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Qty: {item.quantity}</p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <p className="font-bold text-surface-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500">{formatCurrency(item.price)} each</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Order total summary */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
            <h3 className="font-semibold text-surface-800 dark:text-white mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-surface-500 dark:text-surface-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-surface-500 dark:text-surface-400">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-surface-900 dark:text-white text-base pt-3 mt-1 border-t border-dashed border-surface-200 dark:border-surface-700">
                <span>Total</span>
                <span className="gradient-text-brand text-lg">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar (right, 1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Shipping address */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
            <h3 className="font-semibold text-surface-800 dark:text-white flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm text-surface-600 dark:text-surface-300 space-y-1.5">
                <p className="font-semibold text-surface-800 dark:text-white">{order.shippingAddress.fullName}</p>
                <p className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {order.shippingAddress.phone}
                </p>
                <p className="pt-1.5 border-t border-dashed border-surface-100 dark:border-surface-700">
                  {order.shippingAddress.street}
                </p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
              </div>
            ) : (
              <p className="text-sm text-surface-400">No shipping info</p>
            )}
          </div>

          {/* Payment info */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
            <h3 className="font-semibold text-surface-800 dark:text-white flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Payment
            </h3>
            <div className="text-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-surface-500 dark:text-surface-400">Method</span>
                <span className="font-medium text-surface-800 dark:text-white">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-500 dark:text-surface-400">Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="capitalize">
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-dashed border-surface-100 dark:border-surface-700 text-xs text-surface-400 dark:text-surface-500">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Secured transaction</span>
              </div>
            </div>
          </div>

          {/* Delivery confirmation */}
          {order.deliveredAt && (
            <div className="bg-success/10 dark:bg-success/900/20 rounded-2xl border border-success/30 p-5 text-center">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-success font-semibold text-sm">Delivered on</p>
              <p className="text-surface-800 dark:text-white font-bold mt-0.5">
                {new Date(order.deliveredAt).toLocaleDateString('en-PK', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Help / Support */}
          <div className="bg-linear-to-br from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/40 p-5">
            <h3 className="font-semibold text-surface-800 dark:text-white text-sm mb-1">Need help with this order?</h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
              Our support team is here for you 24/7
            </p>
            <a
              href="mailto:support@shopverse.com"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
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