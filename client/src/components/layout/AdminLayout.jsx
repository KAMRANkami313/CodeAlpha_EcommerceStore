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
  LogOut,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import ScrollToTopButton from '../common/ScrollToTopButton.jsx';
import ROUTES from '../../constants/ROUTES.js';

const sidebarLinks = [
  { to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', desc: 'Overview & stats' },
  { to: ROUTES.ADMIN_PRODUCTS,  icon: Package,         label: 'Products',  desc: 'Manage catalog' },
  { to: ROUTES.ADMIN_ORDERS,    icon: ShoppingBag,     label: 'Orders',    desc: 'Track & fulfill' },
  { to: ROUTES.ADMIN_USERS,     icon: Users,           label: 'Users',     desc: 'Manage accounts' },
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
      <div className="shrink-0 flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
        {collapsed ? (
          <div className="w-9 h-9 mx-auto rounded-lg bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
            <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-surface-900 dark:text-white leading-tight font-display tracking-tight">
                Shop<span className="text-primary-600 dark:text-primary-400">Verse</span>
              </div>
              <div className="text-[10px] text-surface-500 font-medium uppercase tracking-wider mt-0.5">Admin Panel</div>
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            aria-label="Collapse sidebar"
          >
            <Menu className="w-4 h-4 text-surface-500" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {!collapsed && (
          <div className="px-3 py-1.5 text-[10px] font-medium text-surface-500 uppercase tracking-wider select-none">
            Navigation
          </div>
        )}
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === ROUTES.ADMIN_DASHBOARD}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors no-underline relative ${
                isActive
                  ? 'bg-primary-600 text-white font-medium'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white font-medium'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? link.label : undefined}
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm leading-none">{link.label}</div>
                    <div className={`text-[11px] mt-1 font-normal truncate ${isActive ? 'text-white/70' : 'text-surface-400 dark:text-surface-500'}`}>
                      {link.desc}
                    </div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="shrink-0 p-3 border-t border-surface-200 dark:border-surface-800 space-y-1">
        <button
          onClick={() => {
            onNavigate?.();
            navigate(ROUTES.HOME);
          }}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white transition-colors w-full cursor-pointer font-medium text-sm ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <ArrowLeft className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Store Front</span>}
        </button>
        <button
          onClick={() => {
            onNavigate?.();
            handleLogout();
          }}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full cursor-pointer font-medium text-sm ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
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
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: '1px solid var(--color-surface-200)',
          },
        }}
      />

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen shrink-0 z-30 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent collapsed={!isSidebarOpen} />

        {/* Floating expand button when collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 right-3 p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            aria-label="Expand sidebar"
          >
            <Menu className="w-4 h-4 text-surface-500" />
          </button>
        )}
      </aside>

      {/* Mobile sidebar drawer */}
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
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 lg:hidden flex flex-col"
            >
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer z-10 text-surface-400 hover:text-surface-700"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onNavigate={() => setIsMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">

        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium select-none">
                <span className="text-surface-500">Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
                <span className="text-surface-900 dark:text-white">Admin Management</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4.5 h-4.5 text-amber-400" strokeWidth={2} />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4.5 h-4.5 text-surface-600" strokeWidth={2} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* User badge */}
              <div className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 bg-surface-100 dark:bg-surface-950/50 rounded-lg border border-surface-200 dark:border-surface-800 select-none">
                <div className="w-8 h-8 rounded-md bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-surface-900 dark:text-white leading-none">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-primary-600 dark:text-primary-400 font-medium mt-1">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default AdminLayout;