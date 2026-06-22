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
      <div className="shrink-0 flex items-center justify-between p-5 border-b border-surface-100 dark:border-surface-850">
        {collapsed ? (
          <div className="w-10 h-10 mx-auto rounded-xl bg-linear-to-br from-primary-600 to-indigo-600 flex items-center justify-center border border-primary-500/25 shadow-glow select-none">
            <Logo className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-indigo-600 flex items-center justify-center border border-primary-500/25 shadow-glow">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-black text-surface-900 dark:text-white leading-tight font-display tracking-tight">
                Shop<span className="gradient-text-brand">Verse</span>
              </div>
              <div className="text-[9px] text-surface-450 dark:text-surface-500 font-extrabold uppercase tracking-widest mt-0.5">Admin Panel</div>
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="hidden lg:flex p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer border border-transparent hover:border-surface-200/40 dark:hover:border-surface-750/30"
            aria-label="Collapse sidebar"
          >
            <Menu className="w-4 h-4 text-surface-500" />
          </button>
        )}
      </div>

      {/* Nav links navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
        {!collapsed && (
          <div className="px-3.5 py-1.5 text-3xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest select-none">
            Navigation Workspace
          </div>
        )}
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === ROUTES.ADMIN_DASHBOARD}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-250 no-underline relative ${
                isActive
                  ? 'bg-linear-to-r from-primary-600 to-indigo-600 text-white font-extrabold shadow-md hover:shadow-lg border border-primary-500/10'
                  : 'text-surface-500 dark:text-surface-400 hover:bg-surface-55 dark:hover:bg-surface-950/45 hover:text-surface-900 dark:hover:text-white font-bold border border-transparent'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? link.label : undefined}
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs leading-none uppercase tracking-wider">{link.label}</div>
                    <div className={`text-[10px] mt-1 font-medium truncate ${isActive ? 'text-white/70' : 'text-surface-400 dark:text-surface-500'}`}>
                      {link.desc}
                    </div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Option Actions */}
      <div className="shrink-0 p-4 border-t border-surface-100 dark:border-surface-850 space-y-1.5">
        <button
          onClick={() => {
            onNavigate?.();
            navigate(ROUTES.HOME);
          }}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-surface-500 dark:text-surface-455 hover:bg-surface-50 dark:hover:bg-surface-950/40 hover:text-surface-900 dark:hover:text-white transition-all duration-200 w-full cursor-pointer font-bold text-xs uppercase tracking-wider ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <ArrowLeft className="w-5 h-5 shrink-0 stroke-[2.2]" />
          {!collapsed && <span>Store Front</span>}
        </button>
        <button
          onClick={() => {
            onNavigate?.();
            handleLogout();
          }}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-danger hover:bg-danger-soft/10 dark:hover:bg-danger/10 transition-all duration-200 w-full cursor-pointer font-bold text-xs uppercase tracking-wider ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 stroke-[2.2]" />
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
            borderRadius: '16px',
            padding: '12px 16px',
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            border: '1px solid var(--color-surface-100)',
          },
        }}
      />

      {/* Desktop Sidebar (Rendered side-by-side with sticky position to prevent overlapping content) */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen shrink-0 z-30 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-850/60 transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent collapsed={!isSidebarOpen} />

        {/* Floating Expand Trigger when fully collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 right-3 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer border border-transparent"
            aria-label="Expand sidebar"
          >
            <Menu className="w-4.5 h-4.5 text-surface-500" />
          </button>
        )}
      </aside>

      {/* Responsive mobile sidebar container elements */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-850 lg:hidden flex flex-col"
            >
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-5 right-4 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer z-10 text-surface-400 hover:text-surface-700"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent onNavigate={() => setIsMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Screen Content Frame */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-100 dark:border-surface-850/55">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest select-none">
                <span className="text-surface-450 dark:text-surface-500">Workspace</span>
                <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
                <span className="text-surface-800 dark:text-white">Admin Management</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Responsive theme switcher */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2.5 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer border border-transparent hover:border-surface-100/50 dark:hover:border-surface-800/60"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <Sun className="w-4.5 h-4.5 text-amber-400 stroke-[2.2]" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <Moon className="w-4.5 h-4.5 text-surface-600 stroke-2" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Connected User Badge Module */}
              <div className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 bg-surface-50 dark:bg-surface-950/50 rounded-2xl border border-surface-150 dark:border-surface-850 select-none">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-600 to-indigo-600 flex items-center justify-center shadow-xs border border-primary-500/25">
                  <span className="text-xs font-black text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-black text-surface-850 dark:text-white leading-none">
                    {user?.name}
                  </p>
                  <p className="text-[9px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wide mt-1">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Nested router outlet content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default AdminLayout;