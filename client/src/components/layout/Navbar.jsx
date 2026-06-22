import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, User, Menu, X, Search, LogOut, Heart, Sun, Moon, Shield,
  ChevronDown, Sparkles, Package, ShieldAlert, Home as HomeIcon,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import ROUTES from '../../constants/ROUTES.js';

const NAV_CATEGORIES = [
  { name: 'Electronics',   desc: 'Gadgets, audio, mobile',         icon: '📱', gradient: 'from-blue-500/10 to-cyan-500/10' },
  { name: 'Clothing',      desc: 'Men, women, kids',                icon: '👕', gradient: 'from-pink-500/10 to-rose-500/10' },
  { name: 'Footwear',      desc: 'Sneakers, formal, sports',        icon: '👟', gradient: 'from-amber-500/10 to-orange-500/10' },
  { name: 'Accessories',   desc: 'Bags, watches, jewelry',          icon: '⌚', gradient: 'from-violet-500/10 to-purple-500/10' },
  { name: 'Home & Garden', desc: 'Decor, kitchen, outdoor',         icon: '🏡', gradient: 'from-emerald-500/10 to-teal-500/10' },
  { name: 'Sports',        desc: 'Fitness, outdoor, gear',          icon: '⚽', gradient: 'from-red-500/10 to-pink-500/10' },
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
    setIsMegaMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (cart.totalQuantity > 0) {
      setCartPulse(true);
      const t = setTimeout(() => setCartPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [cart.totalQuantity]);

  useEffect(() => {
    if (wishlistCount > 0) {
      setWishlistPulse(true);
      const t = setTimeout(() => setWishlistPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [wishlistCount]);

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

  const openMegaMenu = () => {
    clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };
  const closeMegaMenu = () => {
    megaMenuTimeout.current = setTimeout(() => setIsMegaMenuOpen(false), 150);
  };

  const isActive = (path) => location.pathname === path ||
    (path !== ROUTES.HOME && location.pathname.startsWith(path));

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? 'glass-nav border-b border-surface-200/50 dark:border-surface-800/40 shadow-soft'
          : 'bg-white/90 dark:bg-surface-950/90 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-14' : 'h-16'}`}>
          
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline shrink-0 group">
            <motion.div
              whileHover={{ rotate: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 bg-linear-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center shadow-brand overflow-hidden"
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ShoppingBag className="w-4.5 h-4.5 text-white relative z-10" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              Shop<span className="gradient-text-brand font-extrabold">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to={ROUTES.HOME}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 no-underline relative ${
                isActive(ROUTES.HOME)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50/70 dark:bg-primary-950/20'
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/60 dark:hover:bg-surface-800/50'
              }`}
            >
              Home
            </Link>

            {/* Mega Menu Trigger */}
            <div
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
              className="relative animate-fade-in"
            >
              <button
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 inline-flex items-center gap-1.5 cursor-pointer ${
                  isActive(ROUTES.PRODUCTS)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50/70 dark:bg-primary-950/20'
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/60 dark:hover:bg-surface-800/50'
                }`}
              >
                Shop
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-180 z-50"
                  >
                    <div className="glass-premium rounded-2xl p-5 shadow-premium border border-surface-200/50 dark:border-surface-800/50 card-gleam">
                      <div className="grid grid-cols-3 gap-2">
                        {NAV_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.name}
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-surface-100/50 dark:hover:bg-surface-800/40 border border-transparent hover:border-surface-200/40 dark:hover:border-surface-700/20 transition-all duration-300 no-underline group"
                          >
                            <span className="text-2xl shrink-0 p-2 rounded-xl bg-surface-100/70 dark:bg-surface-800/80 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                              {cat.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                                {cat.name}
                              </p>
                              <p className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">
                                {cat.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      <div className="gradient-divider my-4" />
                      
                      <div className="flex items-center justify-between px-2">
                        <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-accent-500 animate-bounce-subtle" />
                          Curated arrivals weekly
                        </p>
                        <Link
                          to={ROUTES.PRODUCTS}
                          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors no-underline link-underline"
                        >
                          Browse all products →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to={ROUTES.PRODUCTS + '?sort=newest'}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 no-underline text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/60 dark:hover:bg-surface-800/50"
            >
              New Arrivals
            </Link>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-1.5">
            
            {/* Search Toggle Panel */}
            <div className="hidden sm:block">
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-surface-100/70 dark:bg-surface-800/50 rounded-xl border border-surface-200/60 dark:border-surface-700/40 focus-within:border-primary-400 dark:focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-300"
                >
                  <Search className="w-4.5 h-4.5 text-surface-400 ml-3.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search premium products..."
                    className="bg-transparent border-none outline-none px-2.5 py-2 text-sm w-48 lg:w-64 text-surface-900 dark:text-white placeholder:text-surface-400/80 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="p-2 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mr-1.5 cursor-pointer rounded-lg hover:bg-surface-200/50 dark:hover:bg-surface-700/50 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-white transition-all cursor-pointer"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Theme Toggle (Tactile Interaction) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-white transition-all cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <Sun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Wishlist Link with Animate Badging */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-white transition-all no-underline"
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
                    className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center shadow-sm select-none"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart Link with Count Badge */}
            <Link
              to={ROUTES.CART}
              className="relative p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-white transition-all no-underline"
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
                    className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-accent-500 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center shadow-sm select-none"
                  >
                    {cart.totalQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Profile Dropdown Section */}
            {isAuthenticated ? (
              <div className="relative ml-1 z-50">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-xl hover:bg-surface-100/60 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
                  aria-label="Open profile menu"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-violet-600 rounded-full flex items-center justify-center shadow-sm text-white font-display">
                    <span className="text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-12 w-64 glass-premium rounded-2xl overflow-hidden z-20 shadow-premium border border-surface-200/50 dark:border-surface-800/40"
                      >
                        <div className="p-4 border-b border-surface-200/40 dark:border-surface-800/40 bg-linear-to-br from-primary-50/50 to-violet-50/50 dark:from-primary-950/20 dark:to-violet-950/20">
                          <p className="font-bold text-sm text-surface-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 truncate mt-0.5">{user?.email}</p>
                        </div>
                        
                        <div className="p-2">
                          <Link to={ROUTES.PROFILE} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100/50 dark:hover:bg-surface-800/40 text-surface-700 dark:text-surface-200 no-underline text-sm font-semibold transition-all">
                            <User className="w-4 h-4 text-surface-400" /> My Profile
                          </Link>
                          <Link to={ROUTES.PROFILE} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100/50 dark:hover:bg-surface-800/40 text-surface-700 dark:text-surface-200 no-underline text-sm font-semibold transition-all">
                            <Package className="w-4 h-4 text-surface-400" /> My Orders
                          </Link>
                          <Link to={ROUTES.WISHLIST} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100/50 dark:hover:bg-surface-800/40 text-surface-700 dark:text-surface-200 no-underline text-sm font-semibold transition-all">
                            <Heart className="w-4 h-4 text-surface-400" /> Wishlist
                            {wishlistCount > 0 && (
                              <span className="ml-auto text-xs font-bold font-mono text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{wishlistCount}</span>
                            )}
                          </Link>
                          <Link to={ROUTES.CART} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-100/50 dark:hover:bg-surface-800/40 text-surface-700 dark:text-surface-200 no-underline text-sm font-semibold transition-all">
                            <ShoppingBag className="w-4 h-4 text-surface-400" /> Cart
                            {cart.totalQuantity > 0 && (
                              <span className="ml-auto text-xs font-bold font-mono text-accent-500 bg-accent-500/10 px-2 py-0.5 rounded-full">{cart.totalQuantity}</span>
                            )}
                          </Link>
                          
                          {user?.role === 'admin' && (
                            <>
                              <div className="gradient-divider my-1.5" />
                              <Link to={ROUTES.ADMIN} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary-500/5 dark:bg-primary-500/10 hover:bg-primary-500/10 dark:hover:bg-primary-500/15 text-primary-700 dark:text-primary-400 no-underline text-sm font-bold transition-all">
                                <Shield className="w-4 h-4 text-primary-500" /> Admin Panel
                              </Link>
                            </>
                          )}
                          
                          <div className="gradient-divider my-1.5" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-bold cursor-pointer transition-all"
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
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-bold text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors no-underline"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2.5 text-sm font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 hover:shadow-brand transition-all duration-300 no-underline shine-effect"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-surface-200/40 dark:border-surface-800/40 bg-white/95 dark:bg-surface-950/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-5 space-y-2">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-3.5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-11 pr-4 py-3 bg-surface-100/70 dark:bg-surface-850/60 rounded-xl text-sm font-medium text-surface-900 dark:text-white placeholder:text-surface-400/80 border border-surface-200/50 dark:border-surface-800/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </form>

              <Link to={ROUTES.HOME} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100/50 dark:hover:bg-surface-800/40 no-underline font-semibold transition-colors">
                Home
              </Link>
              <Link to={ROUTES.PRODUCTS} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100/50 dark:hover:bg-surface-800/40 no-underline font-semibold transition-colors">
                All Products
              </Link>

              <div className="gradient-divider my-2.5" />

              <div className="px-4 py-1.5 text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Categories</div>
              <div className="grid grid-cols-2 gap-2 px-2 pt-1">
                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-surface-100/40 dark:bg-surface-900/40 border border-surface-200/20 dark:border-surface-800/10 hover:bg-surface-100/70 dark:hover:bg-surface-800 no-underline text-sm font-semibold text-surface-700 dark:text-surface-200 transition-all"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>

              <div className="gradient-divider my-4" />

              <div className="space-y-1.5">
                {!isAuthenticated ? (
                  <div className="flex gap-2.5 px-2">
                    <Link to={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-3 text-center rounded-xl border border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-200 no-underline font-bold text-sm hover:bg-surface-100/50 dark:hover:bg-surface-900/30 transition-colors">
                      Login
                    </Link>
                    <Link to={ROUTES.REGISTER} onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-3 text-center rounded-xl bg-primary-600 text-white no-underline font-bold text-sm hover:bg-primary-700 transition-colors">
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="px-2 space-y-1">
                    <Link to={ROUTES.PROFILE} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100/50 dark:hover:bg-surface-800/40 no-underline font-semibold transition-all">
                      <User className="w-4.5 h-4.5 text-surface-400" /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 cursor-pointer font-bold transition-all">
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