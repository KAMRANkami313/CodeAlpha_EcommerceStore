import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Mail,
  Shield,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  ShoppingBag,
  Calendar,
  Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import Badge from '../../components/common/Badge.jsx';
import formatCurrency from '../../utils/formatCurrency.js';

const AdminUserManagerPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter !== 'all') params.role = roleFilter;
      const response = await adminService.getAllUsers(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="select-none"
      >
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-surface-900 dark:text-white font-display">Users</h1>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1.5 flex items-center gap-2 font-medium">
          <UsersIcon className="w-3.5 h-3.5 text-primary-500" />
          Manage registered users and their roles · <span className="font-bold text-surface-900 dark:text-white tabular-nums">{pagination.total}</span> total
        </p>
      </motion.div>

      {/* Control Filters Block */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Search Bar Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-surface-150 dark:border-surface-850 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-xs font-medium placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-xs"
          />
        </div>

        {/* Role Filters Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-950 rounded-2xl overflow-x-auto scrollbar-hide select-none border border-surface-150/45 dark:border-surface-850/50 self-start xl:self-center">
          {['all', 'user', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === role
                  ? 'bg-white dark:bg-surface-850 text-primary-600 dark:text-primary-400 shadow-sm border border-surface-200/50 dark:border-surface-750/30'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-850 dark:hover:text-white'
              }`}
            >
              {role === 'all' ? 'All Users' : role + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Grid */}
      {loading ? (
        <Loader label="Loading registered accounts..." />
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-3xl border border-dashed border-surface-200 dark:border-surface-800 select-none">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-100 dark:bg-surface-950 flex items-center justify-center mb-4 border border-surface-150 dark:border-surface-850">
            <UsersIcon className="w-7 h-7 text-surface-300 dark:text-surface-700" />
          </div>
          <p className="text-surface-800 dark:text-surface-200 font-bold uppercase tracking-wider text-xs">No users found</p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">Try adjusting the search criteria or filter role tabs</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {users.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 p-5.5 hover:shadow-premium hover:border-primary-500/20 dark:hover:border-primary-500/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Avatar & Role Header */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border select-none ${
                      user.role === 'admin'
                        ? 'bg-linear-to-br from-primary-600 to-indigo-600 border-primary-500/25 shadow-glow'
                        : 'bg-surface-50 dark:bg-surface-950/40 border-surface-100 dark:border-surface-850'
                    }`}>
                      <span className={`text-sm font-black ${user.role === 'admin' ? 'text-white' : 'text-surface-650 dark:text-surface-300'}`}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-extrabold text-sm text-surface-850 dark:text-white truncate leading-snug">
                          {user.name}
                        </p>
                        {user.role === 'admin' ? (
                          <ShieldCheck className="w-4 h-4 text-primary-650 dark:text-primary-400 shrink-0" />
                        ) : (
                          <Shield className="w-4 h-4 text-surface-300 dark:text-surface-700 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-surface-350 dark:text-surface-600 shrink-0" />
                        <p className="text-2xs font-semibold text-surface-500 dark:text-surface-450 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={user.role === 'admin' ? 'gradient' : 'default'}
                        size="xs"
                        className="mt-2.5 capitalize text-3xs font-extrabold select-none"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  {/* Quantitative Stats Grid Block */}
                  <div className="mt-5 pt-5 border-t border-dashed border-surface-100 dark:border-surface-850 grid grid-cols-2 gap-3.5">
                    <div className="text-center p-3 rounded-2xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100/50 dark:border-surface-850 select-none">
                      <ShoppingBag className="w-4.5 h-4.5 text-primary-550 dark:text-primary-400 mx-auto mb-1 stroke-2" />
                      <p className="text-base font-black text-surface-900 dark:text-white tabular-nums">
                        {user.orderCount || 0}
                      </p>
                      <p className="text-[10px] text-surface-400 uppercase tracking-widest font-extrabold mt-1">Orders</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100/50 dark:border-surface-850 select-none">
                      <p className="text-base font-black gradient-text-brand tabular-nums">
                        {formatCurrency(user.totalSpent || 0)}
                      </p>
                      <p className="text-[10px] text-surface-400 uppercase tracking-widest font-extrabold mt-1.75">Total Spent</p>
                    </div>
                  </div>
                </div>

                {/* Meta Details Footer */}
                <div className="mt-5 space-y-1.5">
                  {user.phone && (
                    <p className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" /> {user.phone}
                    </p>
                  )}
                  <p className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 flex items-center gap-2 select-none">
                    <Calendar className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" /> Joined {new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Grid Layout Pagination Bar */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 px-6 py-4 shadow-soft select-none mt-6">
              <p className="text-2xs font-bold uppercase tracking-wider text-surface-450 dark:text-surface-555">
                Showing <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{(page - 1) * 10 + 1}</span> to <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{Math.min(page * 10, pagination.total)}</span> of <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{pagination.total}</span> users
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
        </>
      )}
    </div>
  );
};

export default AdminUserManagerPage;