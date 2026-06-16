import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, LogOut, Pencil, X, Save, ChevronRight } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <h2 className="font-bold text-surface-800 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">{user?.email}</p>
          </div>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${activeTab === 'orders' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'}`}>
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${activeTab === 'profile' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'}`}>
              <User className="w-4 h-4" /> Profile
            </button>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">My Orders</h2>
              {loading ? <Loader /> : orders.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700">
                  <Package className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                  <p className="text-surface-500 dark:text-surface-400 font-medium">No orders yet</p>
                  <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Start shopping to see your orders here</p>
                  <Link to={ROUTES.PRODUCTS} className="mt-4 inline-block">
                    <Button variant="primary" size="md">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/orders/${order._id}`}
                      className="block bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all no-underline"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-surface-800 dark:text-white">Order #{order._id?.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-surface-400 dark:text-surface-500">{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <Badge variant={statusColors[order.orderStatus]}>{order.orderStatus}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-500 dark:text-surface-400">{order.items.length} item(s)</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-surface-900 dark:text-white">{formatCurrency(order.totalPrice)}</span>
                          <ChevronRight className="w-4 h-4 text-surface-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-surface-900 dark:text-white">Profile Details</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Full Name</label>
                        <input
                          {...register('name', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                          })}
                          className="w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Phone</label>
                        <input
                          {...register('phone')}
                          className="w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                          placeholder="+92 317 5718391"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl bg-surface-50 dark:bg-surface-900 text-surface-400 text-sm"
                      />
                      <p className="text-xs text-surface-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" loading={savingProfile} icon={Save} size="md">
                        Save Changes
                      </Button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-surface-200 dark:border-surface-600 text-surface-600 dark:text-surface-400 rounded-xl font-medium hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer text-sm"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-surface-500 dark:text-surface-400">Name</label>
                        <p className="text-surface-800 dark:text-white font-medium mt-1">{user?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-surface-500 dark:text-surface-400">Email</label>
                        <p className="text-surface-800 dark:text-white font-medium mt-1">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-surface-500 dark:text-surface-400">Phone</label>
                        <p className="text-surface-800 dark:text-white font-medium mt-1">{user?.phone || 'Not set'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-surface-500 dark:text-surface-400">Role</label>
                        <p className="text-surface-800 dark:text-white font-medium mt-1 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    {user?.address && (user.address.street || user.address.city) && (
                      <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                        <label className="text-sm font-medium text-surface-500 dark:text-surface-400 block mb-2">Address</label>
                        <p className="text-surface-800 dark:text-white">
                          {user.address.street}{user.address.street && user.address.city ? ', ' : ''}{user.address.city}
                          {user.address.state ? `, ${user.address.state}` : ''} {user.address.zipCode}
                        </p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                      <label className="text-sm font-medium text-surface-500 dark:text-surface-400 block mb-2">Member Since</label>
                      <p className="text-surface-800 dark:text-white font-medium">
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
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;