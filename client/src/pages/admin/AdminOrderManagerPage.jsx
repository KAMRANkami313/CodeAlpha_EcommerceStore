import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import formatCurrency from '../../utils/formatCurrency.js';

const STATUS_OPTIONS = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];

const StatusBadge = ({ status }) => {
  const styles = {
    processing: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    shipped: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    delivered: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    cancelled: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-surface-100 text-surface-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const styles = {
    paid: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
    failed: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[status] || 'bg-surface-100 text-surface-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminOrderManagerPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Status update
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;
      const response = await adminService.getAllOrders(params);
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const openOrderDetail = async (order) => {
    setSelectedOrder(order);
    setDetailLoading(true);
    try {
      const response = await adminService.getOrderById(order._id);
      setOrderDetail(response.data);
    } catch (err) {
      toast.error('Failed to load order details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setOrderDetail((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Orders</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Manage and track all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-surface-400" />
          <div className="flex gap-1">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700">
          <Package className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600" />
          <p className="mt-3 text-surface-500 dark:text-surface-400">No orders found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50">
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300">Order ID</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300">Items</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300">Total</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-surface-600 dark:text-surface-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-primary-600 dark:text-primary-400">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-surface-900 dark:text-white">
                        {order.shippingAddress?.fullName || order.user?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-surface-400">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-surface-600 dark:text-surface-400">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3 font-medium text-surface-900 dark:text-white">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-5 py-3 text-surface-500 dark:text-surface-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openOrderDetail(order)}
                          className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 hover:text-primary-600 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-surface-200 dark:border-surface-700">
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        p === page
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 sticky top-0 bg-white dark:bg-surface-800 z-10">
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-sm text-surface-500">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer"
                >
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-8"><Loader /></div>
              ) : orderDetail ? (
                <div className="p-5 space-y-5">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">Customer</h3>
                    <div className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-3">
                      <p className="text-sm text-surface-900 dark:text-white font-medium">
                        {orderDetail.shippingAddress?.fullName || orderDetail.user?.name}
                      </p>
                      <p className="text-sm text-surface-500">{orderDetail.user?.email}</p>
                      {orderDetail.shippingAddress?.phone && (
                        <p className="text-sm text-surface-500">{orderDetail.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">Shipping Address</h3>
                    <div className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-3">
                      <p className="text-sm text-surface-700 dark:text-surface-300">
                        {orderDetail.shippingAddress?.street}
                      </p>
                      <p className="text-sm text-surface-700 dark:text-surface-300">
                        {orderDetail.shippingAddress?.city}, {orderDetail.shippingAddress?.state}{' '}
                        {orderDetail.shippingAddress?.zipCode}
                      </p>
                      <p className="text-sm text-surface-500">{orderDetail.shippingAddress?.country}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">Items</h3>
                    <div className="space-y-2">
                      {orderDetail.items?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-surface-50 dark:bg-surface-700/50 rounded-xl p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-200 dark:bg-surface-600 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-surface-900 dark:text-white">{item.name}</p>
                              <p className="text-xs text-surface-500">Qty: {item.quantity} &times; {formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-surface-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Subtotal</span>
                      <span className="text-surface-900 dark:text-white">{formatCurrency(orderDetail.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500">Shipping</span>
                      <span className="text-surface-900 dark:text-white">
                        {orderDetail.shippingPrice === 0 ? 'Free' : formatCurrency(orderDetail.shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-surface-200 dark:border-surface-600">
                      <span className="text-surface-900 dark:text-white">Total</span>
                      <span className="text-surface-900 dark:text-white">{formatCurrency(orderDetail.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Payment & Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">Payment</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-surface-600 dark:text-surface-400">
                          {orderDetail.paymentMethod}
                        </span>
                        <PaymentBadge status={orderDetail.paymentStatus} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">Status</h3>
                      <StatusBadge status={orderDetail.orderStatus} />
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="pt-3 border-t border-surface-200 dark:border-surface-700">
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Update Order Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {['processing', 'shipped', 'delivered', 'cancelled']
                        .filter((s) => s !== orderDetail.orderStatus)
                        .map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(orderDetail._id, status)}
                            disabled={updatingStatus === orderDetail._id}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                              status === 'delivered'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                                : status === 'cancelled'
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                : status === 'shipped'
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                            }`}
                          >
                            Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrderManagerPage;