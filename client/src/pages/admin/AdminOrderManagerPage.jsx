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
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-surface-900 dark:text-white font-display">Orders</h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1.5 flex items-center gap-2 font-medium">
            <ShoppingBag className="w-3.5 h-3.5 text-primary-500" />
            Manage and track customer orders · <span className="font-bold text-surface-900 dark:text-white tabular-nums">{pagination.total}</span> total
          </p>
        </div>
      </motion.div>

      {/* Control Filters Block */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Search Input Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-surface-150 dark:border-surface-850 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-xs font-medium placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-xs"
          />
        </div>
        
        {/* Status Capsule Filters */}
        <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-950 rounded-2xl overflow-x-auto scrollbar-hide select-none border border-surface-150/45 dark:border-surface-850/50 self-start xl:self-center">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white dark:bg-surface-850 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-200/50 dark:border-surface-750/30'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-850 dark:hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Order Workspace */}
      {loading ? (
        <Loader label="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-3xl border border-dashed border-surface-200 dark:border-surface-800 select-none">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-100 dark:bg-surface-950 flex items-center justify-center mb-4 border border-surface-150 dark:border-surface-850">
            <Package className="w-7 h-7 text-surface-300 dark:text-surface-700" />
          </div>
          <p className="text-surface-800 dark:text-surface-200 font-bold uppercase tracking-wider text-xs">No orders found</p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Try adjusting the search criteria or status filter tabs</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-850 bg-surface-50/50 dark:bg-surface-950/20 select-none">
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Items</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-850">
                {orders.map((order, i) => {
                  const StatusIcon = statusIcons[order.orderStatus] || Package;
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-surface-50/60 dark:hover:bg-surface-950/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-2xs text-primary-600 dark:text-primary-400 font-bold tracking-wider select-all">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-surface-850 dark:text-white leading-snug">
                          {order.shippingAddress?.fullName || order.user?.name || 'Anonymous User'}
                        </p>
                        <p className="text-2xs font-semibold text-surface-400 dark:text-surface-500 mt-0.5 truncate max-w-48">{order.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-surface-600 dark:text-surface-400">
                        <span className="inline-flex items-center gap-1.5 font-bold text-2xs select-none">
                          <Package className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
                          {order.items.length} units
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black tabular-nums text-surface-900 dark:text-white text-xs sm:text-sm">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase tracking-wider select-none ${
                          order.orderStatus === 'delivered' ? 'bg-success-soft/20 text-success border border-success/10' :
                          order.orderStatus === 'cancelled' ? 'bg-danger-soft/10 text-danger border border-danger/10' :
                          order.orderStatus === 'shipped' ? 'bg-primary-50 text-primary-600 dark:text-primary-400 border border-primary-100/20 dark:border-primary-900/10' :
                          'bg-warning-soft/20 text-warning border border-warning/10'
                        }`}>
                          <StatusIcon className="w-3 h-3 stroke-[2.2]" />
                          <span className="capitalize">{order.orderStatus}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-surface-500 dark:text-surface-500 text-2xs font-bold tabular-nums">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => openOrderDetail(order)}
                            className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/40 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer border border-transparent hover:border-primary-100/30 dark:hover:border-primary-900/10"
                            title="View Details"
                            aria-label="View order details"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-surface-100 dark:border-surface-850 bg-surface-50/30 dark:bg-surface-950/10 select-none">
              <p className="text-2xs font-bold uppercase tracking-wider text-surface-450 dark:text-surface-555">
                Showing <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{(page - 1) * 10 + 1}</span> to <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{Math.min(page * 10, pagination.total)}</span> of <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{pagination.total}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4.5 h-4.5 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      p === page
                        ? 'bg-linear-to-r from-primary-600 to-violet-600 text-white shadow-xs'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4.5 h-4.5 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────── Order Detail Inspection Modal ───────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-surface-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-surface-150 dark:border-surface-850"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-surface-100 dark:border-surface-850 sticky top-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-sm z-10 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center border border-primary-400/20">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-surface-900 dark:text-white uppercase tracking-wider font-display">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-surface-400 mt-1">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
                  className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors text-surface-400 hover:text-surface-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-12"><Loader /></div>
              ) : orderDetail ? (
                <div className="p-6 space-y-6">
                  
                  {/* Customer Information Panel */}
                  <div>
                    <h3 className="text-3xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 select-none">
                      <Mail className="w-3.5 h-3.5 text-primary-500" /> Customer Information
                    </h3>
                    <div className="bg-surface-50 dark:bg-surface-950/20 rounded-2xl p-4 border border-surface-100 dark:border-surface-850/60">
                      <p className="text-sm font-bold text-surface-850 dark:text-white">
                        {orderDetail.shippingAddress?.fullName || orderDetail.user?.name}
                      </p>
                      <div className="flex flex-col gap-1.5 mt-2.5">
                        <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-surface-400" /> {orderDetail.user?.email}
                        </p>
                        {orderDetail.shippingAddress?.phone && (
                          <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-surface-400" /> {orderDetail.shippingAddress.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Panel */}
                  <div>
                    <h3 className="text-3xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 select-none">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" /> Shipping Address
                    </h3>
                    <div className="bg-surface-50 dark:bg-surface-950/20 rounded-2xl p-4 border border-surface-100 dark:border-surface-850/60">
                      <p className="text-xs sm:text-sm font-semibold text-surface-700 dark:text-surface-300">{orderDetail.shippingAddress?.street}</p>
                      <p className="text-xs sm:text-sm font-semibold text-surface-700 dark:text-surface-300 mt-1">
                        {orderDetail.shippingAddress?.city}, {orderDetail.shippingAddress?.state}{' '}
                        {orderDetail.shippingAddress?.zipCode}
                      </p>
                      {orderDetail.shippingAddress?.country && (
                        <p className="text-3xs font-extrabold uppercase tracking-widest text-surface-400 mt-3">{orderDetail.shippingAddress.country}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items Catalog Loop */}
                  <div>
                    <h3 className="text-3xs font-extrabold text-surface-450 dark:text-surface-500 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 select-none">
                      <Package className="w-3.5 h-3.5 text-primary-500" /> Items ({orderDetail.items?.length})
                    </h3>
                    <div className="space-y-2.5">
                      {orderDetail.items?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-surface-50/60 dark:bg-surface-950/10 rounded-2xl p-3 border border-surface-100 dark:border-surface-850"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-200 dark:bg-surface-950 shrink-0 border border-surface-100 dark:border-surface-800">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-4 h-4 text-surface-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-surface-850 dark:text-white truncate leading-snug">{item.name}</p>
                              <p className="text-2xs font-semibold text-surface-450 mt-1">Qty: {item.quantity} · {formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm font-extrabold tabular-nums text-surface-900 dark:text-white shrink-0 pl-3">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals Summary Panel */}
                  <div className="bg-linear-to-r from-primary-50/30 to-violet-50/30 dark:from-primary-950/10 dark:to-violet-950/10 rounded-2xl p-4.5 border border-primary-100/30 dark:border-primary-900/10 space-y-2.5">
                    <div className="flex justify-between text-xs font-semibold text-surface-500 dark:text-surface-450">
                      <span>Subtotal</span>
                      <span className="tabular-nums text-surface-900 dark:text-white font-bold">{formatCurrency(orderDetail.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-surface-500 dark:text-surface-450">
                      <span>Shipping Fee</span>
                      <span className="tabular-nums text-surface-900 dark:text-white font-bold">
                        {orderDetail.shippingPrice === 0 ? 'FREE' : formatCurrency(orderDetail.shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-black pt-3.5 mt-1 border-t border-dashed border-primary-100 dark:border-primary-900/30">
                      <span className="text-surface-900 dark:text-white">Total</span>
                      <span className="gradient-text-brand tabular-nums">{formatCurrency(orderDetail.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Payment & Status Blocks */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100 dark:border-surface-850">
                      <h3 className="text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest flex items-center gap-1.5 select-none">
                        <CreditCard className="w-3.5 h-3.5 text-primary-500" /> Payment
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-surface-850 dark:text-white leading-snug">
                        {orderDetail.paymentMethod === 'COD' ? 'Cash on Delivery' : orderDetail.paymentMethod}
                      </p>
                      <Badge
                        variant={orderDetail.paymentStatus === 'paid' ? 'success' : 'warning'}
                        size="xs"
                        className="mt-2.5 capitalize text-3xs font-black select-none"
                      >
                        {orderDetail.paymentStatus}
                      </Badge>
                    </div>
                    <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100 dark:border-surface-850">
                      <h3 className="text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                        Order Status
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-surface-850 dark:text-white leading-snug capitalize">
                        {orderDetail.orderStatus}
                      </p>
                      <Badge variant={statusColors[orderDetail.orderStatus]} size="xs" className="mt-2.5 capitalize text-3xs font-black select-none">
                        {orderDetail.orderStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Status Transition Updates Actions */}
                  <div className="pt-4 border-t border-surface-100 dark:border-surface-850">
                    <h3 className="text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-3.5 uppercase tracking-widest select-none">
                      Update Order Status
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {['processing', 'shipped', 'delivered', 'cancelled']
                        .filter((s) => s !== orderDetail.orderStatus)
                        .map((status) => {
                          const StatusIcon = statusIcons[status];
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(orderDetail._id, status)}
                              disabled={updatingStatus === orderDetail._id}
                              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 border select-none ${
                                status === 'delivered'
                                  ? 'bg-success-soft/20 text-success border-success/15 hover:bg-success-soft/30'
                                  : status === 'cancelled'
                                  ? 'bg-danger-soft/10 text-danger border-danger/15 hover:bg-danger-soft/20'
                                  : status === 'shipped'
                                  ? 'bg-primary-50 text-primary-600 dark:text-primary-450 border-primary-100/20 dark:border-primary-900/10 hover:bg-primary-100/20'
                                  : 'bg-warning-soft/20 text-warning border-warning/15 hover:bg-warning-soft/30'
                              }`}
                            >
                              <StatusIcon className="w-4 h-4 stroke-[2.2]" />
                              {status}
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