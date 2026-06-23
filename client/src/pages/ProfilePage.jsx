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
  ShieldCheck,
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
  'w-full px-3.5 py-2.5 border border-surface-200 dark:border-surface-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 text-sm font-medium bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all hover:border-surface-300 dark:hover:border-surface-700';

const navItems = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'profile', label: 'Profile Details', icon: User },
];

/**
 * ProfilePage — Editorial Modern Redesign
 */
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <nav className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-4" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
          <span className="text-primary-600 dark:text-primary-400 font-medium">My Account</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
          Hello, {user?.name?.split(' ')[0] || 'Shopper'}!
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">
          Manage your orders, profile, and personal preferences
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package },
          { label: 'Processing', value: stats.processing, icon: Clock },
          { label: 'Shipped', value: stats.shipped, icon: Truck },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-950 flex items-center justify-center border border-surface-200 dark:border-surface-800">
                <Icon className="w-4.5 h-4.5 text-surface-600 dark:text-surface-300" strokeWidth={2} />
              </div>
              <span className="text-2xl font-bold text-surface-900 dark:text-white tabular-nums font-mono">{value}</span>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-3">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 lg:sticky lg:top-24"
        >
          {/* User card */}
          <div className="text-center pb-5 mb-5 border-b border-surface-200 dark:border-surface-800">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white font-display">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-surface-900 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="font-semibold text-surface-900 dark:text-white tracking-tight">{user?.name}</h2>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1 truncate">{user?.email}</p>
            <Badge variant="primary" size="sm" className="mt-3 capitalize">
              {user?.role || 'Customer'}
            </Badge>
          </div>

          {/* Tabs */}
          <nav className="space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors border border-transparent ${
                  activeTab === id
                    ? 'bg-primary-600 text-white'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                <span className="flex-1 text-left">{label}</span>
                {activeTab === id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}

            <Link
              to={ROUTES.WISHLIST}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white cursor-pointer transition-colors no-underline border border-transparent"
            >
              <Heart className="w-4.5 h-4.5 text-surface-400" strokeWidth={2} />
              <span className="flex-1 text-left">My Wishlist</span>
              <ChevronRight className="w-4 h-4 text-surface-400" />
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors border border-transparent"
            >
              <LogOut className="w-4.5 h-4.5" strokeWidth={2} />
              <span className="flex-1 text-left">Logout</span>
            </button>
          </nav>
        </motion.aside>

        {/* Content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-white font-display tracking-tight">My Orders</h2>
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline no-underline"
                  >
                    Browse Products
                  </Link>
                </div>

                {loading ? (
                  <Loader label="Loading your orders..." />
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-surface-900 rounded-xl border border-dashed border-surface-200 dark:border-surface-800">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-surface-50 dark:bg-surface-950 flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
                    </div>
                    <p className="text-surface-900 dark:text-white font-semibold">No orders yet</p>
                    <p className="text-sm text-surface-400 dark:text-surface-500 mt-1 mb-5">
                      Start shopping to see your orders here
                    </p>
                    <Link to={ROUTES.PRODUCTS} className="no-underline">
                      <Button variant="primary" size="md" icon={ShoppingBag}>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order, i) => {
                      const StatusIcon = statusIcons[order.orderStatus] || Package;
                      return (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <Link
                            to={`/orders/${order._id}`}
                            className="group block bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all no-underline"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3.5">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  order.orderStatus === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-950/20' :
                                  order.orderStatus === 'cancelled' ? 'bg-red-50 dark:bg-red-950/20' :
                                  order.orderStatus === 'shipped' ? 'bg-primary-50 dark:bg-primary-950/30' :
                                  'bg-amber-50 dark:bg-amber-950/20'
                                }`}>
                                  <StatusIcon className={`w-5 h-5 ${
                                    order.orderStatus === 'delivered' ? 'text-emerald-500' :
                                    order.orderStatus === 'cancelled' ? 'text-red-500' :
                                    order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400' :
                                    'text-amber-500'
                                  }`} strokeWidth={2} />
                                </div>
                                <div>
                                  <p className="font-semibold text-surface-900 dark:text-white leading-none">
                                    Order #{order._id?.slice(-8).toUpperCase()}
                                  </p>
                                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-2 flex items-center gap-1.5 font-mono">
                                    <Calendar className="w-3.5 h-3.5 text-surface-400" />
                                    {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={statusColors[order.orderStatus]} className="capitalize">
                                {order.orderStatus}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-surface-200 dark:border-surface-800">
                              <span className="text-sm text-surface-500 dark:text-surface-400">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-lg text-surface-900 dark:text-white font-mono tabular-nums leading-none">
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

            {/* Profile tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6 sm:p-7">

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-surface-900 dark:text-white font-display tracking-tight">Profile Details</h2>
                      <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Manage your personal information</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors cursor-pointer border border-primary-200 dark:border-primary-900/30"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Full Name</label>
                          <input
                            {...register('name', {
                              required: 'Name is required',
                              minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            })}
                            className={inputClass}
                          />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Phone</label>
                          <input
                            {...register('phone')}
                            className={inputClass}
                            placeholder="+92 317 5718391"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Email (locked)</label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className={`${inputClass} opacity-50 cursor-not-allowed`}
                        />
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-1.5">Email addresses cannot be changed</p>
                      </div>

                      <div className="flex gap-2.5 pt-1">
                        <Button type="submit" loading={savingProfile} variant="primary" icon={Save}>
                          Save Changes
                        </Button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg font-medium text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                          <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500 mb-1.5">
                            <User className="w-3.5 h-3.5" /> Full Name
                          </div>
                          <p className="text-surface-900 dark:text-white font-medium text-sm">{user?.name}</p>
                        </div>

                        <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                          <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500 mb-1.5">
                            <Mail className="w-3.5 h-3.5" /> Email
                          </div>
                          <p className="text-surface-900 dark:text-white font-medium text-sm truncate">{user?.email}</p>
                        </div>

                        <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                          <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500 mb-1.5">
                            <Phone className="w-3.5 h-3.5" /> Phone
                          </div>
                          <p className="text-surface-900 dark:text-white font-medium text-sm font-mono">{user?.phone || 'Not set'}</p>
                        </div>

                        <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                          <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500 mb-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Role
                          </div>
                          <p className="text-surface-900 dark:text-white font-medium text-sm capitalize">{user?.role}</p>
                        </div>
                      </div>

                      {user?.address && (user.address.street || user.address.city) && (
                        <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                          <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500 mb-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Address
                          </div>
                          <p className="text-surface-700 dark:text-surface-200 font-medium text-sm leading-relaxed">
                            {user.address.street}{user.address.street && user.address.city ? ', ' : ''}{user.address.city}
                            {user.address.state ? `, ${user.address.state}` : ''} {user.address.zipCode}
                          </p>
                        </div>
                      )}

                      <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/30">
                        <div className="flex items-center gap-2 text-xs text-primary-700 dark:text-primary-400 mb-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Member Since
                        </div>
                        <p className="text-surface-900 dark:text-white font-medium text-sm">
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
