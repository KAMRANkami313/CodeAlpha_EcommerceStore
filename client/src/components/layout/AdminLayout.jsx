import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ArrowLeft,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import ScrollToTopButton from '../common/ScrollToTopButton.jsx';
import ROUTES from '../../constants/ROUTES.js';

const sidebarLinks = [
  { to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.ADMIN_PRODUCTS, icon: Package, label: 'Products' },
  { to: ROUTES.ADMIN_ORDERS, icon: ShoppingBag, label: 'Orders' },
  { to: ROUTES.ADMIN_USERS, icon: Users, label: 'Users' },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
        }}
      />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header - fixed at top */}
        <div className="shrink-0 flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
          {isSidebarOpen && (
            <span className="text-lg font-bold text-surface-900 dark:text-white">
              Admin<span className="text-primary-600">Panel</span>
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* Nav Links - scrollable middle area */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.ADMIN_DASHBOARD}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                } ${!isSidebarOpen ? 'justify-center' : ''}`
              }
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="text-sm">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Back to Store - pinned at bottom */}
        <div className="shrink-0 p-3 border-t border-surface-200 dark:border-surface-700">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-all duration-200 w-full cursor-pointer ${
              !isSidebarOpen ? 'justify-center' : ''
            }`}
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="text-sm">Back to Store</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 lg:hidden flex flex-col"
            >
              <div className="shrink-0 flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                <span className="text-lg font-bold text-surface-900 dark:text-white">
                  Admin<span className="text-primary-600">Panel</span>
                </span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer"
                >
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {sidebarLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === ROUTES.ADMIN_DASHBOARD}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                      }`
                    }
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="text-sm">{link.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="shrink-0 p-3 border-t border-surface-200 dark:border-surface-700">
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    navigate(ROUTES.HOME);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 w-full cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm">Back to Store</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden cursor-pointer"
              >
                <Menu className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <div className="hidden sm:flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400">
                <span>Admin</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-surface-600" />
                )}
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl">
                <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-primary-500 dark:text-primary-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default AdminLayout;