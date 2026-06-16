import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import Badge from '../../components/common/Badge.jsx';
import formatCurrency from '../../utils/formatCurrency.js';

const STATUS_OPTIONS = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand">Orders</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            Manage and track all customer orders · {pagination.total} total
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl overflow-x-auto">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader label="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-surface-800 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-surface-300 dark:text-surface-500" />
          </div>
          <p className="text-surface-700 dark:text-surface-200 font-semibold">No orders found</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting filters</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50">
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Items</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {orders.map((order, i) => {
                  const StatusIcon = statusIcons[order.orderStatus] || Package;
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-semibold">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-surface-900 dark:text-white">
                          {order.shippingAddress?.fullName || order.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-surface-400 truncate max-w-45">{order.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-surface-600 dark:text-surface-400">
                        <span className="inline-flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-surface-400" />
                          {order.items.length}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-surface-900 dark:text-white">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === 'delivered' ? 'bg-success/10 text-success' :
                          order.orderStatus === 'cancelled' ? 'bg-danger/10 text-danger' :
                          order.orderStatus === 'shipped' ? 'bg-primary/10 text-primary-600 dark:text-primary-400' :
                          'bg-warning/10 text-warning'
                        }`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{order.orderStatus}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openOrderDetail(order)}
                            className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                            title="View Details"
                            aria-label="View order details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-700/30">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(page * 10, pagination.total)}</span> of <span className="font-semibold">{pagination.total}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      p === page
                        ? 'bg-linear-to-r from-primary-600 to-violet-600 text-white shadow-sm'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────── Order Detail Modal ───────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 sticky top-0 bg-white dark:bg-surface-800 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-surface-900 dark:text-white">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer transition-colors"
                  aria-label="Close"
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
                    <h3 className="text-xs font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Customer
                    </h3>
                    <div className="bg-surface-50 dark:bg-surface-700/40 rounded-xl p-3.5 border border-surface-100 dark:border-surface-700">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">
                        {orderDetail.shippingAddress?.fullName || orderDetail.user?.name}
                      </p>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {orderDetail.user?.email}
                        </p>
                        {orderDetail.shippingAddress?.phone && (
                          <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                            <Phone className="w-3 h-3" /> {orderDetail.shippingAddress.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-xs font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Shipping Address
                    </h3>
                    <div className="bg-surface-50 dark:bg-surface-700/40 rounded-xl p-3.5 border border-surface-100 dark:border-surface-700">
                      <p className="text-sm text-surface-700 dark:text-surface-300">{orderDetail.shippingAddress?.street}</p>
                      <p className="text-sm text-surface-700 dark:text-surface-300">
                        {orderDetail.shippingAddress?.city}, {orderDetail.shippingAddress?.state}{' '}
                        {orderDetail.shippingAddress?.zipCode}
                      </p>
                      {orderDetail.shippingAddress?.country && (
                        <p className="text-xs text-surface-500 mt-1">{orderDetail.shippingAddress.country}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-xs font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> Items ({orderDetail.items?.length})
                    </h3>
                    <div className="space-y-2">
                      {orderDetail.items?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-surface-50 dark:bg-surface-700/40 rounded-xl p-3 border border-surface-100 dark:border-surface-700"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-200 dark:bg-surface-600 shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-4 h-4 text-surface-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{item.name}</p>
                              <p className="text-xs text-surface-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-surface-900 dark:text-white shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-linear-to-r from-primary-50/50 to-violet-50/50 dark:from-primary-900/10 dark:to-violet-900/10 rounded-xl p-4 border border-primary-100 dark:border-primary-800/40 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500 dark:text-surface-400">Subtotal</span>
                      <span className="text-surface-900 dark:text-white font-medium">{formatCurrency(orderDetail.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-500 dark:text-surface-400">Shipping</span>
                      <span className="text-surface-900 dark:text-white font-medium">
                        {orderDetail.shippingPrice === 0 ? 'FREE' : formatCurrency(orderDetail.shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-primary-200/50 dark:border-primary-700/50">
                      <span className="text-surface-900 dark:text-white">Total</span>
                      <span className="gradient-text-brand">{formatCurrency(orderDetail.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Payment & Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                      <h3 className="text-[10px] font-bold text-surface-500 dark:text-surface-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Payment
                      </h3>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">
                        {orderDetail.paymentMethod === 'COD' ? 'Cash on Delivery' : orderDetail.paymentMethod}
                      </p>
                      <Badge
                        variant={orderDetail.paymentStatus === 'paid' ? 'success' : 'warning'}
                        size="xs"
                        className="mt-1.5 capitalize"
                      >
                        {orderDetail.paymentStatus}
                      </Badge>
                    </div>
                    <div className="p-3.5 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                      <h3 className="text-[10px] font-bold text-surface-500 dark:text-surface-400 mb-1.5 uppercase tracking-wider">
                        Order Status
                      </h3>
                      <Badge variant={statusColors[orderDetail.orderStatus]} size="xs" className="capitalize">
                        {orderDetail.orderStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="pt-3 border-t border-surface-200 dark:border-surface-700">
                    <h3 className="text-xs font-bold text-surface-700 dark:text-surface-300 mb-3 uppercase tracking-wider">
                      Update Order Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['processing', 'shipped', 'delivered', 'cancelled']
                        .filter((s) => s !== orderDetail.orderStatus)
                        .map((status) => {
                          const StatusIcon = statusIcons[status];
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(orderDetail._id, status)}
                              disabled={updatingStatus === orderDetail._id}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 border ${
                                status === 'delivered'
                                  ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                                  : status === 'cancelled'
                                  ? 'bg-danger/10 text-danger border-danger/30 hover:bg-danger/20'
                                  : status === 'shipped'
                                  ? 'bg-primary/10 text-primary-600 dark:text-primary-400 border-primary/30 hover:bg-primary/20'
                                  : 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20'
                              }`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          );
                        })}
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