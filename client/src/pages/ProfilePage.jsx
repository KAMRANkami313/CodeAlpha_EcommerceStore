import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Package,
  LogOut,
  Pencil,
  X,
  Save,
  ChevronRight,
  Heart,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import orderService from '../services/orderService.js';
import authService from '../services/authService.js';
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

const statusIcons = {
  processing: Clock,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: X,
};

const inputClass =
  'w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all';

const navItems = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'profile', label: 'Profile Details', icon: User },
];

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const { data: ordersData, loading } = useFetch(() => orderService.getMyOrders(), []);
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const orders = ordersData?.orders || [];

  // Compute order stats
  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.orderStatus === 'processing').length,
    shipped: orders.filter((o) => o.orderStatus === 'shipped').length,
    delivered: orders.filter((o) => o.orderStatus === 'delivered').length,
  };

  const onProfileSubmit = async (data) => {
    setSavingProfile(true);
    try {
      const response = await authService.updateProfile(data);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <nav className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 mb-3" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-surface-800 dark:text-white font-medium">My Account</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand">
          Hello, {user?.name?.split(' ')[0] || 'Shopper'}!
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Manage your orders, profile, and preferences
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package, color: 'primary' },
          { label: 'Processing', value: stats.processing, icon: Clock, color: 'warning' },
          { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'primary' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'success' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-4 hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${color}-50 dark:bg-${color}-900/30`}>
                <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
              </div>
              <span className="text-2xl font-bold text-surface-900 dark:text-white tabular-nums">{value}</span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-2 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ─────────────────────────  Sidebar  ───────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 lg:sticky lg:top-24 lg:h-fit"
        >
          {/* User card */}
          <div className="text-center pb-5 mb-5 border-b border-surface-100 dark:border-surface-700">
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-glow">
                <span className="text-2xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-2 border-white dark:border-surface-800 flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <h2 className="font-bold text-surface-800 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 truncate">{user?.email}</p>
            <Badge variant="gradient" size="xs" className="mt-2 capitalize">
              {user?.role || 'Customer'}
            </Badge>
          </div>

          {/* Nav */}
          <nav className="space-y-1.5">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                  activeTab === id
                    ? 'bg-linear-to-r from-primary-600 to-violet-600 text-white shadow-md'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{label}</span>
                {activeTab === id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}

            <Link
              to={ROUTES.WISHLIST}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-all no-underline"
            >
              <Heart className="w-4 h-4" />
              <span className="flex-1 text-left">My Wishlist</span>
              <ChevronRight className="w-4 h-4 text-surface-400" />
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="flex-1 text-left">Logout</span>
            </button>
          </nav>
        </motion.aside>

        {/* ─────────────────────────  Content  ───────────────────────── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">My Orders</h2>
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Browse Products
                  </Link>
                </div>

                {loading ? (
                  <Loader label="Loading your orders..." />
                ) : orders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white dark:bg-surface-800 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700"
                  >
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
                      <Package className="w-10 h-10 text-surface-300 dark:text-surface-500" />
                    </div>
                    <p className="text-surface-700 dark:text-surface-200 font-semibold">No orders yet</p>
                    <p className="text-sm text-surface-400 dark:text-surface-500 mt-1 mb-5">
                      Start shopping to see your orders here
                    </p>
                    <Link to={ROUTES.PRODUCTS}>
                      <Button variant="gradient" size="md" icon={ShoppingBag}>Start Shopping</Button>
                    </Link>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, i) => {
                      const StatusIcon = statusIcons[order.orderStatus] || Package;
                      return (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Link
                            to={`/orders/${order._id}`}
                            className="group block bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-soft transition-all no-underline"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  order.orderStatus === 'delivered' ? 'bg-success/10' :
                                  order.orderStatus === 'cancelled' ? 'bg-danger/10' :
                                  order.orderStatus === 'shipped' ? 'bg-primary/10' :
                                  'bg-warning/10'
                                }`}>
                                  <StatusIcon className={`w-5 h-5 ${
                                    order.orderStatus === 'delivered' ? 'text-success' :
                                    order.orderStatus === 'cancelled' ? 'text-danger' :
                                    order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                                    'text-warning'
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-bold text-surface-800 dark:text-white">
                                    Order #{order._id?.slice(-8).toUpperCase()}
                                  </p>
                                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={statusColors[order.orderStatus]} className="capitalize">
                                {order.orderStatus}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-dashed border-surface-100 dark:border-surface-700">
                              <span className="text-sm text-surface-500 dark:text-surface-400">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-surface-900 dark:text-white">
                                  {formatCurrency(order.totalPrice)}
                                </span>
                                <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-surface-900 dark:text-white">Profile Details</h2>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Manage your personal information</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">Full Name</label>
                          <input
                            {...register('name', {
                              required: 'Name is required',
                              minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            })}
                            className={inputClass}
                          />
                          {errors.name && <p className="text-danger text-xs mt-1.5">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">Phone</label>
                          <input
                            {...register('phone')}
                            className={inputClass}
                            placeholder="+92 317 5718391"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">Email (locked)</label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className={`${inputClass} opacity-60 cursor-not-allowed`}
                        />
                        <p className="text-xs text-surface-400 mt-1.5">Email cannot be changed</p>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" loading={savingProfile} variant="gradient" icon={Save}>
                          Save Changes
                        </Button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-200 dark:border-surface-600 text-surface-600 dark:text-surface-400 rounded-xl font-medium hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer text-sm"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-1.5 font-semibold uppercase tracking-wide">
                            <User className="w-3.5 h-3.5" /> Full Name
                          </div>
                          <p className="text-surface-800 dark:text-white font-semibold">{user?.name}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-1.5 font-semibold uppercase tracking-wide">
                            <Mail className="w-3.5 h-3.5" /> Email
                          </div>
                          <p className="text-surface-800 dark:text-white font-semibold truncate">{user?.email}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-1.5 font-semibold uppercase tracking-wide">
                            <Phone className="w-3.5 h-3.5" /> Phone
                          </div>
                          <p className="text-surface-800 dark:text-white font-semibold">{user?.phone || 'Not set'}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-1.5 font-semibold uppercase tracking-wide">
                            <Shield className="w-3.5 h-3.5" /> Role
                          </div>
                          <p className="text-surface-800 dark:text-white font-semibold capitalize">{user?.role}</p>
                        </div>
                      </div>

                      {user?.address && (user.address.street || user.address.city) && (
                        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                          <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-1.5 font-semibold uppercase tracking-wide">
                            <MapPin className="w-3.5 h-3.5" /> Address
                          </div>
                          <p className="text-surface-800 dark:text-white">
                            {user.address.street}{user.address.street && user.address.city ? ', ' : ''}{user.address.city}
                            {user.address.state ? `, ${user.address.state}` : ''} {user.address.zipCode}
                          </p>
                        </div>
                      )}

                      <div className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/40">
                        <div className="flex items-center gap-2 text-xs text-primary-700 dark:text-primary-300 mb-1.5 font-semibold uppercase tracking-wide">
                          <Calendar className="w-3.5 h-3.5" /> Member Since
                        </div>
                        <p className="text-surface-800 dark:text-white font-semibold">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
