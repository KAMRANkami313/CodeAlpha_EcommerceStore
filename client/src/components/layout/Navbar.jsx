import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, User, Menu, X, Search, LogOut, Heart, Sun, Moon, Shield,
  ChevronDown, Sparkles, Package, Smartphone, Shirt, Footprints, Watch,
  Home as HomeIcon, Dumbbell, ArrowRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import ROUTES from '../../constants/ROUTES.js';

/**
 * Navbar — Editorial Modern Redesign
 *
 * All emojis replaced with Lucide icons. Cleaner logo, refined mega-menu,
 * same state & behavior — fully backward compatible.
 */

// Category config — Lucide icons instead of emojis
// (icon is a React component reference, not a string)
const NAV_CATEGORIES = [
  { name: 'Electronics',   desc: 'Gadgets, audio, mobile',  Icon: Smartphone },
  { name: 'Clothing',      desc: 'Men, women, kids',         Icon: Shirt },
  { name: 'Footwear',      desc: 'Sneakers, formal, sports', Icon: Footprints },
  { name: 'Accessories',   desc: 'Bags, watches, jewelry',   Icon: Watch },
  { name: 'Home & Garden', desc: 'Decor, kitchen, outdoor',  Icon: HomeIcon },
  { name: 'Sports',        desc: 'Fitness, outdoor, gear',   Icon: Dumbbell },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartPulse, setCartPulse] = useState(false);
  const [wishlistPulse, setWishlistPulse] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const megaMenuTimeout = useRef(null);

  // Scroll listener — toggles navbar condensed style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close all menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
    setIsMegaMenuOpen(false);
  }, [location.pathname]);

  // Pulse animation when cart count changes
  useEffect(() => {
    if (cart.totalQuantity > 0) {
      setCartPulse(true);
      const t = setTimeout(() => setCartPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [cart.totalQuantity]);

  // Pulse animation when wishlist count changes
  useEffect(() => {
    if (wishlistCount > 0) {
      setWishlistPulse(true);
      const t = setTimeout(() => setWishlistPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [wishlistCount]);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Mega menu open/close with hover delay (prevents flicker)
  const openMegaMenu = () => {
    clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };
  const closeMegaMenu = () => {
    megaMenuTimeout.current = setTimeout(() => setIsMegaMenuOpen(false), 150);
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path !== ROUTES.HOME && location.pathname.startsWith(path));

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'glass-nav border-b border-surface-200/60 dark:border-surface-800/50 shadow-xs'
          : 'bg-white/90 dark:bg-surface-950/90 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>

          {/* ─── Logo ─── */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline shrink-0 group">
            <motion.div
              whileHover={{ rotate: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 bg-linear-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center shadow-sm overflow-hidden"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-white relative z-10" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              Shop<span className="gradient-text-brand font-extrabold">Verse</span>
            </span>
          </Link>

          {/* ─── Desktop Nav Links ─── */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to={ROUTES.HOME}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                isActive(ROUTES.HOME)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30'
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800/60'
              }`}
            >
              Home
            </Link>

            {/* Mega Menu Trigger */}
            <div
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
              className="relative"
            >
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer ${
                  isActive(ROUTES.PRODUCTS)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30'
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800/60'
                }`}
              >
                Shop
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-xl z-50"
                  >
                    <div className="bg-white dark:bg-surface-900 rounded-xl p-3 shadow-lg border border-surface-200 dark:border-surface-800">
                      <div className="grid grid-cols-2 gap-1">
                        {NAV_CATEGORIES.map(({ name, desc, Icon }) => (
                          <Link
                            key={name}
                            to={`/products?category=${encodeURIComponent(name)}`}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 border border-transparent hover:border-surface-200 dark:hover:border-surface-700/40 transition-all duration-200 no-underline group"
                          >
                            <span className="shrink-0 p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-primary-600 dark:text-primary-400 transition-transform duration-200 group-hover:scale-105">
                              <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                            </span>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {name}
                              </p>
                              <p className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">
                                {desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="gradient-divider my-2" />

                      <Link
                        to={ROUTES.PRODUCTS}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 no-underline transition-colors group"
                      >
                        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                          Curated arrivals weekly
                        </span>
                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Browse all
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to={ROUTES.PRODUCTS + '?sort=newest'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
                location.search.includes('sort=newest')
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30'
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800/60'
              }`}
            >
              New Arrivals
            </Link>
          </div>

          {/* ─── Actions ─── */}
          <div className="flex items-center gap-0.5">

            {/* Search Toggle (Desktop) */}
            <div className="hidden sm:block">
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-surface-100 dark:bg-surface-800/60 rounded-lg border border-surface-200 dark:border-surface-700/40 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/15 transition-all duration-200"
                >
                  <Search className="w-4.5 h-4.5 text-surface-400 ml-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent border-none outline-none px-2.5 py-2 text-sm w-48 lg:w-60 text-surface-900 dark:text-white placeholder:text-surface-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="p-2 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mr-1 cursor-pointer rounded-md hover:bg-surface-200/60 dark:hover:bg-surface-700/60 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white transition-all cursor-pointer"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white transition-all cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Wishlist */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative p-2.5 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white transition-all no-underline"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: wishlistPulse ? [1, 1.25, 1] : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center select-none"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2.5 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white transition-all no-underline"
              aria-label={`Cart (${cart.totalQuantity} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cart.totalQuantity > 0 && (
                  <motion.span
                    key={cart.totalQuantity}
                    initial={{ scale: 0 }}
                    animate={{ scale: cartPulse ? [1, 1.25, 1] : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-primary-600 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center select-none"
                  >
                    {cart.totalQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Profile Dropdown OR Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative ml-1 z-50">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800/60 transition-colors cursor-pointer"
                  aria-label="Open profile menu"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-violet-600 rounded-full flex items-center justify-center text-white font-display">
                    <span className="text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-12 w-64 bg-white dark:bg-surface-900 rounded-xl overflow-hidden z-20 shadow-lg border border-surface-200 dark:border-surface-800"
                      >
                        {/* Profile header */}
                        <div className="p-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/40">
                          <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">{user?.email}</p>
                        </div>

                        {/* Menu items */}
                        <div className="p-1.5">
                          <Link to={ROUTES.PROFILE} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800/60 text-surface-700 dark:text-surface-200 no-underline text-sm font-medium transition-colors">
                            <User className="w-4 h-4 text-surface-400" /> My Profile
                          </Link>
                          <Link to={ROUTES.PROFILE} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800/60 text-surface-700 dark:text-surface-200 no-underline text-sm font-medium transition-colors">
                            <Package className="w-4 h-4 text-surface-400" /> My Orders
                          </Link>
                          <Link to={ROUTES.WISHLIST} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800/60 text-surface-700 dark:text-surface-200 no-underline text-sm font-medium transition-colors">
                            <Heart className="w-4 h-4 text-surface-400" /> Wishlist
                            {wishlistCount > 0 && (
                              <span className="ml-auto text-xs font-bold font-mono text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">{wishlistCount}</span>
                            )}
                          </Link>
                          <Link to={ROUTES.CART} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800/60 text-surface-700 dark:text-surface-200 no-underline text-sm font-medium transition-colors">
                            <ShoppingBag className="w-4 h-4 text-surface-400" /> Cart
                            {cart.totalQuantity > 0 && (
                              <span className="ml-auto text-xs font-bold font-mono text-primary-600 dark:text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded-full">{cart.totalQuantity}</span>
                            )}
                          </Link>

                          {user?.role === 'admin' && (
                            <>
                              <div className="gradient-divider my-1.5" />
                              <Link to={ROUTES.ADMIN} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-950/50 text-primary-700 dark:text-primary-400 no-underline text-sm font-medium transition-colors">
                                <Shield className="w-4 h-4 text-primary-500" /> Admin Panel
                              </Link>
                            </>
                          )}

                          <div className="gradient-divider my-1.5" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-medium cursor-pointer transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 ml-1">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-3.5 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors no-underline"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors no-underline"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 overflow-hidden"
          >
            <div className="px-4 py-5 space-y-2">
              {/* Mobile search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-3.5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-11 pr-4 py-3 bg-surface-100 dark:bg-surface-850 rounded-lg text-sm font-medium text-surface-900 dark:text-white placeholder:text-surface-400 border border-surface-200 dark:border-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </form>

              <Link to={ROUTES.HOME} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/60 no-underline font-medium transition-colors">
                Home
              </Link>
              <Link to={ROUTES.PRODUCTS} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/60 no-underline font-medium transition-colors">
                All Products
              </Link>

              <div className="gradient-divider my-2.5" />

              <div className="px-4 py-1.5 text-[11px] font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Categories</div>
              <div className="grid grid-cols-2 gap-1.5 px-2 pt-1">
                {NAV_CATEGORIES.map(({ name, Icon }) => (
                  <Link
                    key={name}
                    to={`/products?category=${encodeURIComponent(name)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-lg bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-800 no-underline text-sm font-medium text-surface-700 dark:text-surface-200 transition-colors"
                  >
                    <Icon className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400 shrink-0" strokeWidth={2} />
                    <span className="truncate">{name}</span>
                  </Link>
                ))}
              </div>

              <div className="gradient-divider my-3" />

              <div className="space-y-1.5">
                {!isAuthenticated ? (
                  <div className="flex gap-2 px-2">
                    <Link to={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-3 text-center rounded-lg border border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-200 no-underline font-medium text-sm hover:bg-surface-100 dark:hover:bg-surface-800/60 transition-colors">
                      Login
                    </Link>
                    <Link to={ROUTES.REGISTER} onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-3 text-center rounded-lg bg-primary-600 text-white no-underline font-medium text-sm hover:bg-primary-700 transition-colors">
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="px-2 space-y-1">
                    <Link to={ROUTES.PROFILE} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/60 no-underline font-medium transition-colors">
                      <User className="w-4.5 h-4.5 text-surface-400" /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer font-medium transition-colors">
                      <LogOut className="w-4.5 h-4.5 text-red-500" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;