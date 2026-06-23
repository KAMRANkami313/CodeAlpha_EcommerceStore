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
    <div className="space-y-6 py-2">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-white font-display">Users</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5 flex items-center gap-2">
          <UsersIcon className="w-4 h-4 text-primary-500" />
          Manage registered users and roles · <span className="font-semibold text-surface-900 dark:text-white tabular-nums">{pagination.total}</span> total
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-sm font-medium placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-lg overflow-x-auto scrollbar-hide self-start">
          {['all', 'user', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap capitalize ${
                roleFilter === role
                  ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              {role === 'all' ? 'All Users' : role + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* User cards */}
      {loading ? (
        <Loader label="Loading users..." />
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-xl border border-dashed border-surface-200 dark:border-surface-800">
          <div className="w-16 h-16 mx-auto rounded-xl bg-surface-100 dark:bg-surface-950 flex items-center justify-center mb-4">
            <UsersIcon className="w-8 h-8 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
          </div>
          <p className="text-surface-900 dark:text-white font-medium">No users found</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting the search or role filter</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {users.map((user, i) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 hover:shadow-sm transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Avatar + name */}
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                      user.role === 'admin'
                        ? 'bg-linear-to-br from-primary-600 to-violet-600'
                        : 'bg-surface-100 dark:bg-surface-950'
                    }`}>
                      <span className={`text-sm font-semibold ${user.role === 'admin' ? 'text-white' : 'text-surface-600 dark:text-surface-300'}`}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-medium text-sm text-surface-900 dark:text-white truncate leading-snug">
                          {user.name}
                        </p>
                        {user.role === 'admin' ? (
                          <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" strokeWidth={2} />
                        ) : (
                          <Shield className="w-4 h-4 text-surface-300 dark:text-surface-700 shrink-0" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-surface-400 shrink-0" strokeWidth={1.5} />
                        <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={user.role === 'admin' ? 'primary' : 'default'}
                        size="xs"
                        className="mt-2.5 capitalize"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-800 grid grid-cols-2 gap-3">
                    <div className="text-center p-2.5 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                      <ShoppingBag className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" strokeWidth={2} />
                      <p className="text-base font-semibold text-surface-900 dark:text-white tabular-nums">
                        {user.orderCount || 0}
                      </p>
                      <p className="text-[10px] text-surface-400 mt-0.5">Orders</p>
                    </div>
                    <div className="text-center p-2.5 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                      <p className="text-base font-semibold text-surface-900 dark:text-white tabular-nums">
                        {formatCurrency(user.totalSpent || 0)}
                      </p>
                      <p className="text-[10px] text-surface-400 mt-1.5">Total Spent</p>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-4 space-y-1.5">
                  {user.phone && (
                    <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-surface-400" strokeWidth={1.5} /> {user.phone}
                    </p>
                  )}
                  <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-surface-400" strokeWidth={1.5} /> Joined {new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 px-5 py-3.5 mt-6">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Showing <span className="font-medium text-surface-900 dark:text-white tabular-nums">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-surface-900 dark:text-white tabular-nums">{Math.min(page * 10, pagination.total)}</span> of <span className="font-medium text-surface-900 dark:text-white tabular-nums">{pagination.total}</span> users
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
        </>
      )}
    </div>
  );
};

export default AdminUserManagerPage;