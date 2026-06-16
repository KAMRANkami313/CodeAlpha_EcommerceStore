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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand">Users</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
          <UsersIcon className="w-3.5 h-3.5" />
          Manage registered users and their roles · {pagination.total} total
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
          {['all', 'user', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                roleFilter === role
                  ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <Loader label="Loading users..." />
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-surface-800 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
            <UsersIcon className="w-10 h-10 text-surface-300 dark:text-surface-500" />
          </div>
          <p className="text-surface-700 dark:text-surface-200 font-semibold">No users found</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting filters</p>
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
                className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 hover:shadow-soft hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300"
              >
                {/* Top: avatar + name + role */}
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    user.role === 'admin'
                      ? 'bg-linear-to-br from-primary-600 to-violet-600 shadow-glow'
                      : 'bg-surface-100 dark:bg-surface-700'
                  }`}>
                    <span className={`text-base font-bold ${user.role === 'admin' ? 'text-white' : 'text-surface-600 dark:text-surface-300'}`}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-surface-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      {user.role === 'admin' ? (
                        <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                      ) : (
                        <Shield className="w-4 h-4 text-surface-300 dark:text-surface-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-surface-400 shrink-0" />
                      <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Badge
                      variant={user.role === 'admin' ? 'gradient' : 'default'}
                      size="xs"
                      className="mt-2 capitalize"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="mt-4 pt-4 border-t border-dashed border-surface-100 dark:border-surface-700 grid grid-cols-2 gap-3">
                  <div className="text-center p-2.5 rounded-xl bg-surface-50 dark:bg-surface-700/40">
                    <ShoppingBag className="w-4 h-4 text-primary-600 dark:text-primary-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-surface-900 dark:text-white tabular-nums">
                      {user.orderCount || 0}
                    </p>
                    <p className="text-[10px] text-surface-400 uppercase tracking-wider font-semibold">Orders</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-surface-50 dark:bg-surface-700/40">
                    <p className="text-lg font-bold gradient-text-brand tabular-nums">
                      {formatCurrency(user.totalSpent || 0)}
                    </p>
                    <p className="text-[10px] text-surface-400 uppercase tracking-wider font-semibold mt-0.5">Total Spent</p>
                  </div>
                </div>

                {/* Footer info */}
                <div className="mt-3 space-y-1">
                  {user.phone && (
                    <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1.5">
                      <Phone className="w-3 h-3" /> {user.phone}
                    </p>
                  )}
                  <p className="text-xs text-surface-400 dark:text-surface-500 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Joined {new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 px-5 py-3 shadow-soft">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(page * 10, pagination.total)}</span> of <span className="font-semibold">{pagination.total}</span> users
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
        </>
      )}
    </div>
  );
};

export default AdminUserManagerPage;