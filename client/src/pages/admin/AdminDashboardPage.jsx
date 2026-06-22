import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Truck,
  CheckCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import Badge from '../../components/common/Badge.jsx';
import ROUTES from '../../constants/ROUTES.js';
import formatCurrency from '../../utils/formatCurrency.js';

const statusColors = {
  processing: 'warning',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

const statusIcons = {
  processing: Clock,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const StatCard = ({ icon: Icon, label, value, gradient, subtext, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="relative bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-150 dark:border-surface-850/60 hover:shadow-premium hover:border-primary-500/20 dark:hover:border-primary-500/20 transition-all duration-300 overflow-hidden group hover:-translate-y-0.5"
  >
    {/* Subtle visual gradient glow backdrops */}
    <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full ${gradient} opacity-5 group-hover:opacity-10 transition-opacity blur-2xl`} />
    <div className="flex items-start justify-between relative z-10">
      <div className="min-w-0">
        <p className="text-2xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white mt-2.5 tabular-nums tracking-tight leading-none">{value}</p>
        {subtext && (
          <p className="text-[11px] text-surface-450 dark:text-surface-400 mt-2 font-medium truncate">{subtext}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${gradient} shadow-md group-hover:scale-105 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-white stroke-2" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader label="Loading dashboard analytics..." />;
  
  if (error) {
    return (
      <div className="text-center py-20 select-none">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-danger-soft/10 dark:bg-danger/10 flex items-center justify-center mb-5 border border-danger/15">
          <XCircle className="w-8 h-8 text-danger" />
        </div>
        <p className="text-danger text-sm font-bold uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  const statusCounts = stats?.ordersByStatus || {};
  const processingCount = statusCounts.processing || 0;
  const shippedCount = statusCounts.shipped || 0;
  const totalOrders = stats?.totalOrders || 0;
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Top Welcome Title Grid */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap select-none"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-surface-900 dark:text-white font-display">Dashboard</h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Welcome back! Here is an overview of your store.
          </p>
        </div>
      </motion.div>

      {/* Main Quantitative Stats Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          gradient="bg-gradient-to-br from-success to-emerald-600"
          subtext="From completed transactions"
          delay={0}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          gradient="bg-gradient-to-br from-primary-500 to-indigo-600"
          subtext={`${processingCount} processing · ${shippedCount} shipped`}
          delay={0.05}
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={stats?.totalProducts || 0}
          gradient="bg-gradient-to-br from-accent-400 to-orange-600"
          subtext="Catalog inventory units"
          delay={0.1}
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers || 0}
          gradient="bg-gradient-to-br from-violet-500 to-fuchsia-600"
          subtext="Registered accounts"
          delay={0.15}
        />
      </div>

      {/* Central Double Listing Layout columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Left Side: Recent Orders Module */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 overflow-hidden shadow-soft"
        >
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-surface-100 dark:border-surface-850 select-none">
            <h2 className="text-sm font-bold uppercase tracking-wider text-surface-900 dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center border border-primary-100/25 dark:border-primary-900/15">
                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Recent Orders
            </h2>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="text-2xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 flex items-center gap-1 transition-all no-underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-surface-100/80 dark:divide-surface-850">
            {stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order, i) => {
                const StatusIcon = statusIcons[order.orderStatus] || Package;
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-surface-50 dark:hover:bg-surface-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center shrink-0 border select-none ${
                        order.orderStatus === 'delivered' ? 'bg-success-soft/20 dark:bg-success/10 border-success/15' :
                        order.orderStatus === 'cancelled' ? 'bg-danger-soft/10 dark:bg-danger/10 border-danger/15' :
                        order.orderStatus === 'shipped' ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-100/30' :
                        'bg-warning-soft/20 dark:bg-warning/10 border-warning/15'
                      }`}>
                        <StatusIcon className={`w-4.5 h-4.5 ${
                          order.orderStatus === 'delivered' ? 'text-success' :
                          order.orderStatus === 'cancelled' ? 'text-danger' :
                          order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                          'text-warning'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-surface-850 dark:text-white truncate">
                          {order.user?.name || 'Anonymous User'}
                        </p>
                        <p className="text-[11px] font-medium text-surface-450 dark:text-surface-500 mt-0.5">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 pl-3">
                      <Badge variant={statusColors[order.orderStatus]} size="xs" className="capitalize text-3xs font-extrabold px-2 py-0.5 select-none">
                        {order.orderStatus}
                      </Badge>
                      <span className="text-xs sm:text-sm font-black tabular-nums text-surface-900 dark:text-white">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-5 py-14 text-center select-none">
                <Package className="w-10 h-10 text-surface-300 dark:text-surface-700 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-555">No orders found yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Side: Popular Top Selling Catalog Items */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 overflow-hidden shadow-soft"
        >
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-surface-100 dark:border-surface-850 select-none">
            <h2 className="text-sm font-bold uppercase tracking-wider text-surface-900 dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-950/40 flex items-center justify-center border border-accent-100/25 dark:border-accent-900/15">
                <TrendingUp className="w-4 h-4 text-accent-550" />
              </div>
              Top Products
            </h2>
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              className="text-2xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-750 flex items-center gap-1 transition-all no-underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-surface-100/80 dark:divide-surface-850">
            {stats?.topProducts?.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.04 }}
                  className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-surface-50 dark:hover:bg-surface-950/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 select-none ${
                      index === 0 ? 'bg-gold text-white shadow-xs' :
                      index === 1 ? 'bg-surface-350 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-surface-850 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 mt-0.5">
                        {product.totalSold} sold
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-black tabular-nums text-surface-900 dark:text-white shrink-0 pl-3">
                    {formatCurrency(product.revenue)}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="px-5 py-14 text-center select-none">
                <TrendingUp className="w-10 h-10 text-surface-300 dark:text-surface-700 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-555">No sales history yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer Grid: Analytical Status Overview Percentage Bar Widgets */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 p-5 sm:p-6 shadow-soft"
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-900 dark:text-white mb-5 select-none">Order Status Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['processing', 'shipped', 'delivered', 'cancelled'].map((status, i) => {
            const count = statusCounts[status] || 0;
            const percentage = (count / maxStatusCount) * 100;
            const StatusIcon = statusIcons[status];
            const barColor =
              status === 'delivered' ? 'bg-success' :
              status === 'cancelled' ? 'bg-danger' :
              status === 'shipped' ? 'bg-primary-600' :
              'bg-warning';
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100 dark:border-surface-850 select-none"
              >
                <div className="flex items-center justify-between mb-3">
                  <StatusIcon className={`w-4.5 h-4.5 ${
                    status === 'delivered' ? 'text-success' :
                    status === 'cancelled' ? 'text-danger' :
                    status === 'shipped' ? 'text-primary-600 dark:text-primary-450' :
                    'text-warning'
                  }`} />
                  <span className="text-xl font-black text-surface-900 dark:text-white tabular-nums">{count}</span>
                </div>
                <p className="text-3xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest mb-3">{status}</p>
                <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.7, ease: "easeOut" }}
                    className={`h-full rounded-full ${barColor}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;