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

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
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
    <div className="space-y-6 py-2">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-white font-display">Orders</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary-500" />
          Manage and track customer orders · <span className="font-semibold text-surface-900 dark:text-white tabular-nums">{pagination.total}</span> total
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-sm font-medium placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-lg overflow-x-auto scrollbar-hide self-start">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap capitalize ${
                statusFilter === status
                  ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader label="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-xl border border-dashed border-surface-200 dark:border-surface-800">
          <div className="w-16 h-16 mx-auto rounded-xl bg-surface-100 dark:bg-surface-950 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
          </div>
          <p className="text-surface-900 dark:text-white font-medium">No orders found</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting the search or status filter</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/30">
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Order ID</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Customer</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Items</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Total</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Status</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Date</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                {orders.map((order, i) => {
                  const StatusIcon = statusIcons[order.orderStatus] || Package;
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-950/20 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-primary-600 dark:text-primary-400 font-medium select-all">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-sm text-surface-900 dark:text-white leading-snug">
                          {order.shippingAddress?.fullName || order.user?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 truncate max-w-48">{order.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-surface-600 dark:text-surface-400">
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <Package className="w-3.5 h-3.5 text-surface-400" strokeWidth={1.5} />
                          {order.items.length}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold tabular-nums text-surface-900 dark:text-white text-sm">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          order.orderStatus === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' :
                          order.orderStatus === 'cancelled' ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400' :
                          order.orderStatus === 'shipped' ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400' :
                          'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          <StatusIcon className="w-3 h-3" strokeWidth={2} />
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400 text-xs tabular-nums">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => openOrderDetail(order)}
                            className="p-2 rounded-md hover:bg-primary-50 dark:hover:bg-primary-950/30 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                            title="View Details"
                            aria-label="View order details"
                          >
                            <Eye className="w-4 h-4" strokeWidth={2} />
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
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/20">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Showing <span className="font-medium text-surface-900 dark:text-white tabular-nums">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-surface-900 dark:text-white tabular-nums">{Math.min(page * 10, pagination.total)}</span> of <span className="font-medium text-surface-900 dark:text-white tabular-nums">{pagination.total}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-8 h-8 px-2 rounded-md text-sm font-medium transition-colors cursor-pointer tabular-nums ${
                      p === page
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-surface-900 rounded-xl shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-surface-200 dark:border-surface-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-white dark:bg-surface-900 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                    <ShoppingBag className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-surface-900 dark:text-white font-display">
                      Order #{selectedOrder._id.slice(-8).toUpperCase()}
                    </h2>
                    <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedOrder(null); setOrderDetail(null); }}
                  className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors text-surface-400 hover:text-surface-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-12"><Loader /></div>
              ) : orderDetail ? (
                <div className="p-5 space-y-5">

                  {/* Customer info */}
                  <div>
                    <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary-500" /> Customer Information
                    </h3>
                    <div className="bg-surface-50 dark:bg-surface-950/30 rounded-lg p-4 border border-surface-200 dark:border-surface-800">
                      <p className="text-sm font-medium text-surface-900 dark:text-white">
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

                  {/* Shipping address */}
                  <div>
                    <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" /> Shipping Address
                    </h3>
                    <div className="bg-surface-50 dark:bg-surface-950/30 rounded-lg p-4 border border-surface-200 dark:border-surface-800">
                      <p className="text-sm text-surface-700 dark:text-surface-300">{orderDetail.shippingAddress?.street}</p>
                      <p className="text-sm text-surface-700 dark:text-surface-300 mt-1">
                        {orderDetail.shippingAddress?.city}, {orderDetail.shippingAddress?.state}{' '}
                        {orderDetail.shippingAddress?.zipCode}
                      </p>
                      {orderDetail.shippingAddress?.country && (
                        <p className="text-xs text-surface-400 mt-2">{orderDetail.shippingAddress.country}</p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-primary-500" /> Items ({orderDetail.items?.length})
                    </h3>
                    <div className="space-y-2">
                      {orderDetail.items?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-surface-50 dark:bg-surface-950/30 rounded-lg p-3 border border-surface-200 dark:border-surface-800"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-200 dark:bg-surface-950 shrink-0 border border-surface-200 dark:border-surface-800">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-4 h-4 text-surface-400" strokeWidth={1.5} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-surface-900 dark:text-white truncate leading-snug">{item.name}</p>
                              <p className="text-xs text-surface-400 mt-0.5">Qty: {item.quantity} · {formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-white shrink-0 pl-3">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="bg-surface-50 dark:bg-surface-950/30 rounded-lg p-4 border border-surface-200 dark:border-surface-800 space-y-2">
                    <div className="flex justify-between text-sm text-surface-500 dark:text-surface-400">
                      <span>Subtotal</span>
                      <span className="tabular-nums text-surface-900 dark:text-white font-medium">{formatCurrency(orderDetail.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-surface-500 dark:text-surface-400">
                      <span>Shipping</span>
                      <span className="tabular-nums text-surface-900 dark:text-white font-medium">
                        {orderDetail.shippingPrice === 0 ? 'FREE' : formatCurrency(orderDetail.shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-surface-900 dark:text-white pt-3 mt-1 border-t border-surface-200 dark:border-surface-800">
                      <span>Total</span>
                      <span className="tabular-nums">{formatCurrency(orderDetail.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Payment & status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                      <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-primary-500" /> Payment
                      </h3>
                      <p className="text-sm font-medium text-surface-900 dark:text-white leading-snug">
                        {orderDetail.paymentMethod === 'COD' ? 'Cash on Delivery' : orderDetail.paymentMethod}
                      </p>
                      <Badge
                        variant={orderDetail.paymentStatus === 'paid' ? 'success' : 'warning'}
                        size="xs"
                        className="mt-2.5 capitalize"
                      >
                        {orderDetail.paymentStatus}
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                      <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">
                        Order Status
                      </h3>
                      <p className="text-sm font-medium text-surface-900 dark:text-white leading-snug capitalize">
                        {orderDetail.orderStatus}
                      </p>
                      <Badge variant={statusColors[orderDetail.orderStatus]} size="xs" className="mt-2.5 capitalize">
                        {orderDetail.orderStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Status update */}
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-800">
                    <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-3 uppercase tracking-wider">
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
                              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 border capitalize ${
                                status === 'delivered'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
                                  : status === 'cancelled'
                                  ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                                  : status === 'shipped'
                                  ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-950/50'
                                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-950/50'
                              }`}
                            >
                              <StatusIcon className="w-4 h-4" strokeWidth={2} />
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