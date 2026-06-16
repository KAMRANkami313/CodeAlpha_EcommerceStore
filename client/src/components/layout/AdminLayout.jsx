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
  ShoppingBag as Logo,
  LogOut,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import ScrollToTopButton from '../common/ScrollToTopButton.jsx';
import ROUTES from '../../constants/ROUTES.js';

const sidebarLinks = [
  { to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & stats' },
  { to: ROUTES.ADMIN_PRODUCTS, icon: Package, label: 'Products', desc: 'Manage catalog' },
  { to: ROUTES.ADMIN_ORDERS, icon: ShoppingBag, label: 'Orders', desc: 'Track & fulfill' },
  { to: ROUTES.ADMIN_USERS, icon: Users, label: 'Users', desc: 'Manage accounts' },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  // Reusable sidebar content (used for both desktop + mobile drawer)
  const SidebarContent = ({ collapsed = false, onNavigate }) => (
    <>
      {/* Logo header */}
      <div className="shrink-0 flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
        {collapsed ? (
          <div className="w-9 h-9 mx-auto rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-glow">
            <Logo className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-glow">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-bold text-surface-900 dark:text-white leading-tight">
                Shop<span className="gradient-text-brand">Verse</span>
              </div>
              <div className="text-[10px] text-surface-500 dark:text-surface-400 uppercase tracking-widest">Admin</div>
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <Menu className="w-4 h-4 text-surface-500" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">
            Menu
          </div>
        )}
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === ROUTES.ADMIN_DASHBOARD}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline relative ${
                isActive
                  ? 'bg-linear-to-r from-primary-600 to-violet-600 text-white font-semibold shadow-md'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? link.label : undefined}
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm leading-tight">{link.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-white/70' : 'text-surface-400 dark:text-surface-500'}`}>
                      {link.desc}
                    </div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Back to Store + Logout */}
      <div className="shrink-0 p-3 border-t border-surface-200 dark:border-surface-700 space-y-1">
        <button
          onClick={() => {
            onNavigate?.();
            navigate(ROUTES.HOME);
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-all duration-200 w-full cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">Back to Store</span>}
        </button>
        <button
          onClick={() => {
            onNavigate?.();
            handleLogout();
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </>
  );

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
        <SidebarContent collapsed={!isSidebarOpen} />

        {/* Expand button when collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-3 right-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <Menu className="w-4 h-4 text-surface-500" />
          </button>
        )}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 lg:hidden flex flex-col"
            >
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-3 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer z-10"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-surface-500" />
              </button>
              <SidebarContent onNavigate={() => setIsMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 glass-nav border-b border-surface-200/60 dark:border-surface-700/60">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-sm">
                <span className="text-surface-500 dark:text-surface-400">Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-600" />
                <span className="text-surface-800 dark:text-white font-medium">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun className="w-5 h-5 text-amber-400" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Moon className="w-5 h-5 text-surface-600" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* User chip */}
              <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-linear-to-r from-primary-50 to-violet-50 dark:from-primary-900/30 dark:to-violet-900/30 rounded-xl border border-primary-100 dark:border-primary-800/40">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-surface-800 dark:text-white leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-primary-600 dark:text-primary-400 uppercase tracking-wide">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default AdminLayout;