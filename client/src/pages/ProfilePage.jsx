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
  'w-full px-4 py-2.5 border-1.5 border-surface-200 dark:border-surface-850 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 text-sm font-semibold bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-300 hover:border-surface-300 dark:hover:border-surface-700';

const navItems = [
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'profile', label: 'Profile Details', icon: User },
];

/**
 * ProfilePage — Premium Redesign
 *
 * A modern e-commerce user cockpit containing tactile account statistics,
 * glassmorphic navigator tabs, and structured form dashboards.
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

  // Compute order stats (original calculations)
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
      {/* Page Header Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <nav className="flex items-center gap-2 text-2xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-4 select-none" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-750" />
          <span className="text-primary-600 dark:text-primary-400 font-extrabold">My Account</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">
          Hello, {user?.name?.split(' ')[0] || 'Shopper'}!
        </h1>
        <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-2 select-none">
          Manage your orders, profile, and personal preferences
        </p>
      </motion.div>

      {/* Styled Stat Cards Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7 select-none">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package, glowColor: 'rgba(99,102,241,0.08)' },
          { label: 'Processing', value: stats.processing, icon: Clock, glowColor: 'rgba(245,158,11,0.08)' },
          { label: 'Shipped', value: stats.shipped, icon: Truck, glowColor: 'rgba(79,70,229,0.08)' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle, glowColor: 'rgba(16,185,129,0.08)' },
        ].map(({ label, value, icon: Icon, glowColor }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="relative bg-white dark:bg-surface-900 rounded-2xl border border-surface-200/60 dark:border-surface-800/40 p-4 shadow-premium overflow-hidden card-gleam"
          >
            {/* Ambient Background Glow for Stat Card */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(at 0% 0%, ${glowColor} 0px, transparent 65%)` }} />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="w-9 h-9 rounded-xl bg-surface-50 dark:bg-surface-950 flex items-center justify-center border border-surface-200/20 dark:border-surface-800/10">
                <Icon className="w-4.5 h-4.5 text-surface-600 dark:text-surface-300" />
              </div>
              <span className="text-2xl font-black text-surface-900 dark:text-white tabular-nums font-mono">{value}</span>
            </div>
            <p className="text-[10px] font-bold text-surface-450 dark:text-surface-500 uppercase tracking-widest mt-3.5 relative z-10">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* ───────────────────────── Sidebar Navigator ───────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/60 dark:border-surface-800/50 p-5 lg:sticky lg:top-24 shadow-premium card-gleam"
        >
          {/* User Card Frame */}
          <div className="text-center pb-5 mb-5 border-b border-surface-150 dark:border-surface-850 select-none">
            <div className="relative inline-block mb-3">
              <div className="w-18 h-18 bg-linear-to-br from-primary-500 to-violet-650 rounded-2xl flex items-center justify-center mx-auto shadow-brand overflow-hidden">
                <span className="text-2xl font-black text-white font-display">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-2 border-white dark:border-surface-900 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h2 className="font-extrabold text-surface-900 dark:text-white tracking-tight">{user?.name}</h2>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1 truncate">{user?.email}</p>
            <Badge variant="gradient" size="xs" className="mt-3 capitalize font-bold tracking-wider">
              {user?.role || 'Customer'}
            </Badge>
          </div>

          {/* Sidebar Tabs */}
          <nav className="space-y-1 select-none">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 border border-transparent ${
                  activeTab === id
                    ? 'bg-linear-to-r from-primary-600 to-violet-600 text-white shadow-brand'
                    : 'text-surface-650 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-850 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="flex-1 text-left">{label}</span>
                {activeTab === id && <ChevronRight className="w-4.5 h-4.5" />}
              </button>
            ))}

            <Link
              to={ROUTES.WISHLIST}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-surface-650 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-850 hover:text-surface-900 dark:hover:text-white cursor-pointer transition-all no-underline border border-transparent"
            >
              <Heart className="w-4.5 h-4.5 text-surface-400" />
              <span className="flex-1 text-left">My Wishlist</span>
              <ChevronRight className="w-4.5 h-4.5 text-surface-450" />
            </Link>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-danger hover:bg-red-500/10 cursor-pointer transition-all border border-transparent"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span className="flex-1 text-left">Logout</span>
            </button>
          </nav>
        </motion.aside>

        {/* ───────────────────────── Content Panels Area ───────────────────────── */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* My Orders Panel View */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="flex items-center justify-between mb-5 select-none">
                  <h2 className="text-lg font-black text-surface-900 dark:text-white font-display tracking-tight">My Orders</h2>
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:underline no-underline link-underline"
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
                    className="text-center py-16 bg-white dark:bg-surface-900 rounded-3xl border border-dashed border-surface-200/60 dark:border-surface-800/40 shadow-premium"
                  >
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-50 dark:bg-surface-950 flex items-center justify-center mb-4">
                      <Package className="w-10 h-10 text-surface-300 dark:text-surface-700" strokeWidth={1} />
                    </div>
                    <p className="text-surface-800 dark:text-white font-extrabold tracking-tight">No orders yet</p>
                    <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 mt-1 mb-5">
                      Start shopping to see your orders list here
                    </p>
                    <Link to={ROUTES.PRODUCTS} className="no-underline">
                      <Button variant="gradient" size="md" icon={ShoppingBag} className="font-bold uppercase tracking-wider px-5 shadow-brand">Start Shopping</Button>
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
                            className="group block bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/60 dark:border-surface-800/50 p-5 hover:border-primary-300/80 dark:hover:border-primary-800/80 hover:shadow-premium transition-all no-underline card-gleam"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3.5 select-none">
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
                                    order.orderStatus === 'shipped' ? 'text-primary-600 dark:text-primary-400 animate-pulse' :
                                    'text-warning animate-bounce-subtle'
                                  }`} />
                                </div>
                                <div>
                                  <p className="font-extrabold text-surface-900 dark:text-white leading-none">
                                    Order #{order._id?.slice(-8).toUpperCase()}
                                  </p>
                                  <p className="text-2xs font-bold text-surface-400 dark:text-surface-500 mt-2 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                                    <Calendar className="w-3.5 h-3.5 text-surface-400" />
                                    {new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={statusColors[order.orderStatus]} className="capitalize font-bold tracking-wider">
                                {order.orderStatus}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between pt-3.5 border-t border-dashed border-surface-150 dark:border-surface-850">
                              <span className="text-xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-lg text-surface-900 dark:text-white font-mono tabular-nums leading-none">
                                  {formatCurrency(order.totalPrice)}
                                </span>
                                <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-300" />
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

            {/* Profile Tab details / Edit details view */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/60 dark:border-surface-800/50 p-6 sm:p-7 shadow-premium card-gleam relative">
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Profile Details</h2>
                      <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 mt-2 select-none">Manage your personal account metrics</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-950/60 transition-colors cursor-pointer border border-primary-100/10 select-none"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-5 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest mb-2 select-none">Full Name</label>
                          <input
                            {...register('name', {
                              required: 'Name is required',
                              minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            })}
                            className={inputClass}
                          />
                          {errors.name && <p className="text-danger text-2xs font-bold mt-1.5 select-none uppercase tracking-wider animate-fade-in">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest mb-2 select-none">Phone</label>
                          <input
                            {...register('phone')}
                            className={inputClass}
                            placeholder="+92 317 5718391"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest mb-2 select-none">Email Address (Locked)</label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className={`${inputClass} opacity-50 cursor-not-allowed`}
                        />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 mt-2 select-none">Registrations addresses cannot be modified</p>
                      </div>
                      
                      <div className="flex gap-2.5 pt-2 select-none">
                        <Button type="submit" loading={savingProfile} variant="gradient" icon={Save} className="font-bold uppercase tracking-wider py-3 shadow-brand">
                          Save Changes
                        </Button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-650 dark:text-surface-400 rounded-xl font-bold uppercase tracking-wider hover:bg-surface-50 dark:hover:bg-surface-850 transition-colors cursor-pointer text-xs"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4 animate-fade-in select-none">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-950/20 border border-surface-200/30 dark:border-surface-800/20 hover:-translate-y-0.5 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 mb-1.5 uppercase tracking-widest">
                            <User className="w-3.5 h-3.5" /> Full Name
                          </div>
                          <p className="text-surface-800 dark:text-white font-bold text-sm leading-none">{user?.name}</p>
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-950/20 border border-surface-200/30 dark:border-surface-800/20 hover:-translate-y-0.5 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 mb-1.5 uppercase tracking-widest">
                            <Mail className="w-3.5 h-3.5" /> Email
                          </div>
                          <p className="text-surface-800 dark:text-white font-bold text-sm leading-none truncate">{user?.email}</p>
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-950/20 border border-surface-200/30 dark:border-surface-800/20 hover:-translate-y-0.5 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 mb-1.5 uppercase tracking-widest">
                            <Phone className="w-3.5 h-3.5" /> Phone
                          </div>
                          <p className="text-surface-800 dark:text-white font-bold text-sm leading-none font-mono">{user?.phone || 'Not configured'}</p>
                        </div>
                        
                        <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-950/20 border border-surface-200/30 dark:border-surface-800/20 hover:-translate-y-0.5 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 mb-1.5 uppercase tracking-widest">
                            <Shield className="w-3.5 h-3.5" /> Account Role
                          </div>
                          <p className="text-surface-800 dark:text-white font-bold text-sm leading-none capitalize">{user?.role}</p>
                        </div>
                      </div>

                      {user?.address && (user.address.street || user.address.city) && (
                        <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-950/20 border border-surface-200/30 dark:border-surface-800/20 animate-fade-in hover:-translate-y-0.5 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 mb-1.5 uppercase tracking-widest">
                            <MapPin className="w-3.5 h-3.5" /> Base Address
                          </div>
                          <p className="text-surface-850 dark:text-surface-200 font-semibold text-xs leading-relaxed">
                            {user.address.street}{user.address.street && user.address.city ? ', ' : ''}{user.address.city}
                            {user.address.state ? `, ${user.address.state}` : ''} {user.address.zipCode}
                          </p>
                        </div>
                      )}

                      <div className="p-4 rounded-2xl bg-primary-500/5 dark:bg-primary-500/10 border border-primary-500/10 hover:-translate-y-0.5 transition-transform duration-300">
                        <div className="flex items-center gap-2 text-2xs font-extrabold text-primary-700 dark:text-primary-300 mb-1.5 uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" /> Member Since
                        </div>
                        <p className="text-surface-900 dark:text-white font-bold text-sm leading-none">
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
