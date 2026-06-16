import { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  Shield,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
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
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Users</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Manage registered users and their roles
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-1">
          {['all', 'user', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => { setRoleFilter(role); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700">
          <UsersIcon className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600" />
          <p className="mt-3 text-surface-500 dark:text-surface-400">No users found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-surface-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      {user.role === 'admin' ? (
                        <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                      ) : (
                        <Shield className="w-4 h-4 text-surface-300 dark:text-surface-600 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-surface-400" />
                      <p className="text-sm text-surface-500 dark:text-surface-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-100 dark:border-surface-700 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">
                      {user.orderCount || 0}
                    </p>
                    <p className="text-[10px] text-surface-400 uppercase tracking-wider">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">
                      {formatCurrency(user.totalSpent || 0)}
                    </p>
                    <p className="text-[10px] text-surface-400 uppercase tracking-wider">Spent</p>
                  </div>
                  <div className="text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      user.role === 'admin'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-[10px] text-surface-400 uppercase tracking-wider mt-1">Role</p>
                  </div>
                </div>

                {user.phone && (
                  <p className="mt-2 text-xs text-surface-400">
                    Phone: {user.phone}
                  </p>
                )}

                <p className="mt-2 text-xs text-surface-400">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 px-5 py-3">
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
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
                ))}
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
        </>
      )}
    </div>
  );
};

export default AdminUserManagerPage;