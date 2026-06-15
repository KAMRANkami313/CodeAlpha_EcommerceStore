import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import orderService from '../services/orderService.js';
import Badge from '../components/common/Badge.jsx';
import Loader from '../components/common/Loader.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import Button from '../components/common/Button.jsx';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { data: ordersData, loading } = useFetch(() => orderService.getMyOrders(), []);
  const [activeTab, setActiveTab] = useState('orders');

  const orders = ordersData?.orders || [];

  const statusColors = {
    processing: 'warning',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary-600">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <h2 className="font-bold text-surface-800">{user?.name}</h2>
            <p className="text-sm text-surface-500">{user?.email}</p>
          </div>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'text-surface-600 hover:bg-surface-50'}`}>
              <Package className="w-4 h-4" /> My Orders
            </button>
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${activeTab === 'profile' ? 'bg-primary-50 text-primary-600' : 'text-surface-600 hover:bg-surface-50'}`}>
              <User className="w-4 h-4" /> Profile
            </button>
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-bold text-surface-900 mb-6">My Orders</h2>
              {loading ? <Loader /> : orders.length === 0 ? (
                <div className="text-center py-12"><p className="text-surface-400">No orders yet</p></div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl border border-surface-200 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-surface-800">Order #{order._id?.slice(-8)}</p>
                          <p className="text-xs text-surface-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={statusColors[order.orderStatus]}>{order.orderStatus}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-500">{order.items.length} item(s)</span>
                        <span className="font-bold text-surface-900">{formatCurrency(order.totalPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-surface-200 p-6">
              <h2 className="text-xl font-bold text-surface-900 mb-6">Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-surface-500">Name</label><p className="text-surface-800 font-medium mt-1">{user?.name}</p></div>
                <div><label className="text-sm font-medium text-surface-500">Email</label><p className="text-surface-800 font-medium mt-1">{user?.email}</p></div>
                <div><label className="text-sm font-medium text-surface-500">Phone</label><p className="text-surface-800 font-medium mt-1">{user?.phone || 'Not set'}</p></div>
                <div><label className="text-sm font-medium text-surface-500">Role</label><p className="text-surface-800 font-medium mt-1 capitalize">{user?.role}</p></div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;