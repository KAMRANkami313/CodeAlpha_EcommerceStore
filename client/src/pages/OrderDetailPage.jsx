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

  // Stable function reference prevents infinite re-fetch loops
  const fetchOrder = useCallback(
    (signal) => orderService.getOrderById(id, { signal }),
    [id]
  );
  const { data: orderData, loading, error } = useFetch(fetchOrder, [fetchOrder]);

  if (loading) return <Loader label="Loading order details..." />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center select-none">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-danger/10 flex items-center justify-center mb-5 border border-danger/20">
          <XCircle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2 font-display">Couldn't load order</h2>
        <p className="text-danger text-xs font-semibold mb-8 max-w-sm mx-auto leading-relaxed">{error}</p>
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
      
      {/* Breadcrumb (Sleek Tactical Link Stack) */}
      <nav className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-surface-450 dark:text-surface-555 mb-5 flex-wrap select-none" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-450 flex items-center gap-1 transition-colors no-underline">
          <HomeIcon className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-750" />
        <Link to={ROUTES.PROFILE} className="hover:text-primary-600 dark:hover:text-primary-450 transition-colors no-underline">
          My Account
        </Link>
        <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-750" />
        <span className="text-surface-800 dark:text-white truncate font-extrabold">Order #{order._id?.slice(-8).toUpperCase()}</span>
      </nav>

      <Link
        to={ROUTES.PROFILE}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-surface-450 dark:text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 mb-6 no-underline transition-colors select-none"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Order Main Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 p-6 sm:p-8 mb-8 shadow-premium"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border select-none ${
              isCancelled ? 'bg-danger-soft/10 dark:bg-danger/10 border-danger/15' :
              order.orderStatus === 'delivered' ? 'bg-success-soft/20 dark:bg-success/10 border-success/15' :
              order.orderStatus === 'shipped' ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-100/30' :
              'bg-warning-soft/20 dark:bg-warning/10 border-warning/15'
            }`}>
              <Package className={`w-6.5 h-6.5 ${
                isCancelled ? 'text-danger' :
                order.orderStatus === 'delivered' ? 'text-success' :
                order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                'text-warning'
              }`} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">
                Order #{order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-2xs font-extrabold uppercase tracking-wider text-surface-450 dark:text-surface-500 mt-2 flex items-center gap-1.5 select-none">
                <Calendar className="w-3.5 h-3.5 text-primary-500" />
                Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[order.orderStatus]} size="md" className="capitalize self-start sm:self-center font-bold px-3 py-1 text-2xs select-none">
            {order.orderStatus}
          </Badge>
        </div>

        {/* Dynamic Timeline Component */}
        {!isCancelled && (
          <div className="mt-8 pt-8 border-t border-surface-100 dark:border-surface-850">
            <div className="relative flex items-start justify-between max-w-2xl mx-auto select-none">
              
              {/* Background Connection Bar */}
              <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-surface-150 dark:bg-surface-800" />
              
              {/* Animated Completed Connection Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 80}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-5 left-[10%] h-0.5 bg-linear-to-r from-primary-500 to-violet-500"
              />

              {statusSteps.map((step, i) => {
                const StepIcon = step.icon;
                const isComplete = i < currentStepIndex;
                const isActive = i === currentStepIndex;
                return (
                  <div key={step.key} className="relative flex flex-col items-center z-10 flex-1">
                    <motion.div
                      initial={{ scale: 0.85 }}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isComplete
                          ? 'bg-primary-600 border-primary-600 text-white shadow-xs'
                          : isActive
                          ? 'bg-white dark:bg-surface-900 border-primary-500 text-primary-500 dark:text-primary-400 shadow-md'
                          : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-750 text-surface-400'
                      }`}
                    >
                      {isComplete ? <CheckCircle className="w-5 h-5 stroke-[2.2]" /> : <StepIcon className="w-5 h-5 stroke-2" />}
                    </motion.div>
                    <div className="text-center mt-3">
                      <div className={`text-2xs font-extrabold uppercase tracking-wider ${isActive || isComplete ? 'text-surface-850 dark:text-white' : 'text-surface-400 dark:text-surface-555'}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] text-surface-400 dark:text-surface-500 mt-1 font-medium hidden sm:block">
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
          <div className="mt-6 p-4.5 rounded-xl bg-danger-soft/10 dark:bg-danger/10 border border-danger/20 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-danger shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider text-danger">This order was cancelled.</p>
          </div>
        )}
      </motion.div>

      {/* Main Double Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Items & Payments (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-5"
        >
          <div className="flex items-center justify-between select-none">
            <h2 className="text-base font-bold uppercase tracking-wider text-surface-800 dark:text-white">
              Items ({order.items?.length})
            </h2>
            <span className="text-2xs font-extrabold uppercase tracking-wider text-surface-450 dark:text-surface-500">
              {order.items?.reduce((sum, i) => sum + i.quantity, 0)} total units
            </span>
          </div>

          {/* Cart Items Loop */}
          {order.items?.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-150 dark:border-surface-850/60 p-4 flex gap-4 hover:shadow-soft transition-shadow"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-950 shrink-0 border border-surface-150 dark:border-surface-850/40 select-none">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-surface-300 dark:text-surface-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <p className="font-semibold text-sm text-surface-850 dark:text-white line-clamp-1 leading-snug">{item.name}</p>
                  <p className="text-2xs font-bold uppercase tracking-wider text-surface-450 dark:text-surface-500 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-baseline justify-between mt-1 flex-wrap gap-2">
                  <p className="font-extrabold text-sm tabular-nums text-surface-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                  <p className="text-2xs font-bold uppercase tracking-wider text-surface-450 dark:text-surface-500">{formatCurrency(item.price)} each</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Subtotal & Totals Billing Card */}
          <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-800 dark:text-white mb-4">Payment Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-medium text-surface-500 dark:text-surface-450">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold">{formatCurrency(order.itemsPrice)}</span>
              </div>
              <div className="flex justify-between font-medium text-surface-500 dark:text-surface-450">
                <span>Shipping</span>
                <span className="tabular-nums font-semibold">{order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between font-black text-surface-900 dark:text-white text-sm pt-4 mt-2 border-t border-dashed border-surface-150 dark:border-surface-800">
                <span>Total Amount</span>
                <span className="gradient-text-brand text-base sm:text-lg tabular-nums">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Shipping & Sidebar meta (1/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          {/* Deliveries Address Information Card */}
          <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-850 dark:text-white flex items-center gap-2 mb-4 select-none">
              <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/20 dark:border-primary-900/15">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs text-surface-600 dark:text-surface-355 space-y-2 font-medium">
                <p className="font-bold text-sm text-surface-850 dark:text-white">{order.shippingAddress.fullName}</p>
                <p className="flex items-center gap-1.5 text-surface-500 dark:text-surface-450 select-none">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-surface-400" />
                  {order.shippingAddress.phone}
                </p>
                <p className="pt-2 border-t border-dashed border-surface-100 dark:border-surface-850 text-surface-600 dark:text-surface-400">
                  {order.shippingAddress.street}
                </p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                {order.shippingAddress.country && <p className="uppercase text-surface-400 font-bold">{order.shippingAddress.country}</p>}
              </div>
            ) : (
              <p className="text-xs text-surface-400 select-none">No shipping information available</p>
            )}
          </div>

          {/* Secure Payments Details Card */}
          <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-850 dark:text-white flex items-center gap-2 mb-4 select-none">
              <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/20 dark:border-primary-900/15">
                <CreditCard className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Payment Status
            </h3>
            <div className="text-xs space-y-3 font-medium">
              <div className="flex items-center justify-between">
                <span className="text-surface-500 dark:text-surface-455">Method</span>
                <span className="font-bold text-surface-850 dark:text-white">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-500 dark:text-surface-455">Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="capitalize font-bold text-3xs select-none">
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-dashed border-surface-100 dark:border-surface-850 text-3xs text-surface-400 select-none font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Secured transaction</span>
              </div>
            </div>
          </div>

          {/* Confirmed Delivery Badge Banner */}
          {order.deliveredAt && (
            <div className="bg-success-soft/20 dark:bg-success/10 rounded-2xl border border-success/15 p-5 text-center select-none">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <p className="text-success font-bold text-xs uppercase tracking-wider">Delivered on</p>
              <p className="text-surface-850 dark:text-white font-black text-sm mt-1">
                {new Date(order.deliveredAt).toLocaleDateString('en-PK', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Integrated Dynamic Support Help Box */}
          <div className="bg-linear-to-br from-primary-50 to-violet-50 dark:from-primary-950/20 dark:to-violet-950/20 rounded-3xl border border-primary-100/40 dark:border-primary-900/10 p-6 select-none">
            <h3 className="font-extrabold text-surface-850 dark:text-white text-xs uppercase tracking-wider mb-1">Need help?</h3>
            <p className="text-2xs font-semibold text-surface-500 dark:text-surface-400 mb-4 leading-relaxed">
              Our professional checkout & dispatch support team is ready to assist you.
            </p>
            <a
              href="mailto:support@shopverse.com"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-750 transition-colors no-underline"
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