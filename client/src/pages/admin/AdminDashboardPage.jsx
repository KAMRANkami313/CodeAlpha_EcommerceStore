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
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 hover:shadow-soft transition-all duration-300 overflow-hidden group"
  >
    {/* Decorative gradient blob */}
    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />
    <div className="flex items-start justify-between relative">
      <div>
        <p className="text-xs text-surface-500 dark:text-surface-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-surface-900 dark:text-white mt-2 tabular-nums">{value}</p>
        {subtext && (
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1.5">{subtext}</p>
        )}
      </div>
      <div className={`p-3 rounded-2xl ${gradient} shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
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

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-danger/10 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-danger" />
        </div>
        <p className="text-danger text-lg font-semibold">{error}</p>
      </div>
    );
  }

  const statusCounts = stats?.ordersByStatus || {};
  const processingCount = statusCounts.processing || 0;
  const shippedCount = statusCounts.shipped || 0;
  const totalOrders = stats?.totalOrders || 0;
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand">Dashboard</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Welcome back! Here's an overview of your store.
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          gradient="bg-gradient-to-br from-success to-emerald-600"
          subtext="From paid orders"
          delay={0}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          gradient="bg-gradient-to-br from-primary-600 to-violet-600"
          subtext={`${processingCount} processing · ${shippedCount} shipped`}
          delay={0.05}
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={stats?.totalProducts || 0}
          gradient="bg-gradient-to-br from-accent-500 to-amber-600"
          subtext="In catalog"
          delay={0.1}
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers || 0}
          gradient="bg-gradient-to-br from-fuchsia-600 to-pink-600"
          subtext="Registered customers"
          delay={0.15}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              Recent Orders
            </h2>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:gap-2 flex items-center gap-1 no-underline transition-all"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order, i) => {
                const StatusIcon = statusIcons[order.orderStatus] || Package;
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-700/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        order.orderStatus === 'delivered' ? 'bg-success/10' :
                        order.orderStatus === 'cancelled' ? 'bg-danger/10' :
                        order.orderStatus === 'shipped' ? 'bg-primary/10' :
                        'bg-warning/10'
                      }`}>
                        <StatusIcon className={`w-4 h-4 ${
                          order.orderStatus === 'delivered' ? 'text-success' :
                          order.orderStatus === 'cancelled' ? 'text-danger' :
                          order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                          'text-warning'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                          {order.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={statusColors[order.orderStatus]} size="xs" className="capitalize">
                        {order.orderStatus}
                      </Badge>
                      <span className="text-sm font-bold text-surface-900 dark:text-white">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-5 py-12 text-center">
                <Package className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
                <p className="text-sm text-surface-400 dark:text-surface-500">No orders yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent-500" />
              </div>
              Top Products
            </h2>
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:gap-2 flex items-center gap-1 no-underline transition-all"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {stats?.topProducts?.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.04 }}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-700/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      index === 0 ? 'bg-gold text-white' :
                      index === 1 ? 'bg-surface-400 text-white' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {product.totalSold} sold
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-surface-900 dark:text-white shrink-0">
                    {formatCurrency(product.revenue)}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="px-5 py-12 text-center">
                <TrendingUp className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
                <p className="text-sm text-surface-400 dark:text-surface-500">No sales data yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Order Status Overview — chart-like bars */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5"
      >
        <h2 className="text-base font-bold text-surface-900 dark:text-white mb-5">Order Status Overview</h2>
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
                className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <StatusIcon className={`w-4 h-4 ${
                    status === 'delivered' ? 'text-success' :
                    status === 'cancelled' ? 'text-danger' :
                    status === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                    'text-warning'
                  }`} />
                  <span className="text-2xl font-bold text-surface-900 dark:text-white tabular-nums">{count}</span>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 capitalize mb-2">{status}</p>
                <div className="h-1.5 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.6 }}
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