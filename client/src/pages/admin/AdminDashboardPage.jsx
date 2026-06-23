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

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor, subtext, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    className="bg-white dark:bg-surface-900 rounded-xl p-5 border border-surface-200 dark:border-surface-800 hover:shadow-sm transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className="min-w-0">
        <p className="text-xs text-surface-500 dark:text-surface-400">{label}</p>
        <p className="text-2xl font-bold text-surface-900 dark:text-white mt-2 tabular-nums tracking-tight leading-none">{value}</p>
        {subtext && (
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-2 truncate">{subtext}</p>
        )}
      </div>
      <div className={`p-2.5 rounded-lg ${iconBg} shrink-0`}>
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
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
      <div className="text-center py-20">
        <div className="w-14 h-14 mx-auto rounded-xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-5 border border-red-200 dark:border-red-900/30">
          <XCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    );
  }

  const statusCounts = stats?.ordersByStatus || {};
  const processingCount = statusCounts.processing || 0;
  const shippedCount = statusCounts.shipped || 0;
  const totalOrders = stats?.totalOrders || 0;
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  return (
    <div className="space-y-6 py-2">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-white font-display">Dashboard</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Welcome back! Here's an overview of your store.
          </p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          iconBg="bg-emerald-50 dark:bg-emerald-950/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
          subtext="From completed orders"
          delay={0}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={totalOrders}
          iconBg="bg-primary-50 dark:bg-primary-950/30"
          iconColor="text-primary-600 dark:text-primary-400"
          subtext={`${processingCount} processing · ${shippedCount} shipped`}
          delay={0.05}
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={stats?.totalProducts || 0}
          iconBg="bg-amber-50 dark:bg-amber-950/30"
          iconColor="text-amber-600 dark:text-amber-400"
          subtext="In catalog"
          delay={0.1}
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers || 0}
          iconBg="bg-violet-50 dark:bg-violet-950/30"
          iconColor="text-violet-600 dark:text-violet-400"
          subtext="Registered accounts"
          delay={0.15}
        />
      </div>

      {/* Recent orders + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-800">
            <h2 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" strokeWidth={2} />
              </div>
              Recent Orders
            </h2>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 transition-colors no-underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order, i) => {
                const StatusIcon = statusIcons[order.orderStatus] || Package;
                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.04 }}
                    className="flex items-center justify-between px-5 py-4 hover:bg-surface-50 dark:hover:bg-surface-950/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        order.orderStatus === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-950/20' :
                        order.orderStatus === 'cancelled' ? 'bg-red-50 dark:bg-red-950/20' :
                        order.orderStatus === 'shipped' ? 'bg-primary-50 dark:bg-primary-950/30' :
                        'bg-amber-50 dark:bg-amber-950/20'
                      }`}>
                        <StatusIcon className={`w-4 h-4 ${
                          order.orderStatus === 'delivered' ? 'text-emerald-500' :
                          order.orderStatus === 'cancelled' ? 'text-red-500' :
                          order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                          'text-amber-500'
                        }`} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                          {order.user?.name || 'Anonymous User'}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 pl-3">
                      <Badge variant={statusColors[order.orderStatus]} size="xs" className="capitalize">
                        {order.orderStatus}
                      </Badge>
                      <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-white">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-5 py-14 text-center">
                <Package className="w-10 h-10 text-surface-300 dark:text-surface-700 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-surface-400">No orders found yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-800">
            <h2 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2} />
              </div>
              Top Products
            </h2>
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 transition-colors no-underline"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {stats?.topProducts?.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.04 }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-surface-50 dark:hover:bg-surface-950/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      index === 0 ? 'bg-amber-400 text-white' :
                      index === 1 ? 'bg-surface-400 text-white' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                        {product.totalSold} sold
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-white shrink-0 pl-3">
                    {formatCurrency(product.revenue)}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="px-5 py-14 text-center">
                <TrendingUp className="w-10 h-10 text-surface-300 dark:text-surface-700 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-surface-400">No sales history yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Order status overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5"
      >
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white mb-5">Order Status Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['processing', 'shipped', 'delivered', 'cancelled'].map((status, i) => {
            const count = statusCounts[status] || 0;
            const percentage = (count / maxStatusCount) * 100;
            const StatusIcon = statusIcons[status];
            const barColor =
              status === 'delivered' ? 'bg-emerald-500' :
              status === 'cancelled' ? 'bg-red-500' :
              status === 'shipped' ? 'bg-primary-600' :
              'bg-amber-500';
            const iconColor =
              status === 'delivered' ? 'text-emerald-500' :
              status === 'cancelled' ? 'text-red-500' :
              status === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
              'text-amber-500';
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <StatusIcon className={`w-4.5 h-4.5 ${iconColor}`} strokeWidth={2} />
                  <span className="text-xl font-bold text-surface-900 dark:text-white tabular-nums">{count}</span>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 capitalize">{status}</p>
                <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.6, ease: "easeOut" }}
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