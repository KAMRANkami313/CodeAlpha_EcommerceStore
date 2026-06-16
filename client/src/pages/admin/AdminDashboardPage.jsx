import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import ROUTES from '../../constants/ROUTES.js';
import formatCurrency from '../../utils/formatCurrency.js';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-200 dark:border-surface-700 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">{label}</p>
        <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{value}</p>
        {subtext && (
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{subtext}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    processing: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    shipped: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    delivered: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-surface-100 text-surface-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

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

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  const statusCounts = stats?.ordersByStatus || {};
  const processingCount = statusCounts.processing || 0;
  const shippedCount = statusCounts.shipped || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          color="bg-green-600"
          subtext="From paid orders"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats?.totalOrders || 0}
          color="bg-primary-600"
          subtext={`${processingCount} processing, ${shippedCount} shipped`}
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={stats?.totalProducts || 0}
          color="bg-accent-500"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="bg-purple-600"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Recent Orders
            </h2>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 no-underline font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">
                      {order.user?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} &middot;{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.orderStatus} />
                    <span className="text-sm font-semibold text-surface-900 dark:text-white">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-surface-400 dark:text-surface-500">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-500" />
              Top Products
            </h2>
            <Link
              to={ROUTES.ADMIN_PRODUCTS}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 no-underline font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {stats?.topProducts?.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-600 dark:text-surface-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {product.totalSold} sold
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-surface-400 dark:text-surface-500">
                No sales data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
          Order Status Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <div
              key={status}
              className="text-center p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50"
            >
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {statusCounts[status] || 0}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400 capitalize mt-1">
                {status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;