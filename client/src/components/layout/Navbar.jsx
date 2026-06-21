import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, User, Menu, X, Search, LogOut, Heart, Sun, Moon, Shield,
  ChevronDown, Sparkles, Package, Settings, Home as HomeIcon,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import ROUTES from '../../constants/ROUTES.js';

const NAV_CATEGORIES = [
  { name: 'Electronics',   desc: 'Gadgets, audio, mobile',         icon: '📱', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Clothing',      desc: 'Men, women, kids',                icon: '👕', gradient: 'from-pink-500 to-rose-500' },
  { name: 'Footwear',      desc: 'Sneakers, formal, sports',        icon: '👟', gradient: 'from-amber-500 to-orange-500' },
  { name: 'Accessories',   desc: 'Bags, watches, jewelry',          icon: '⌚', gradient: 'from-violet-500 to-purple-500' },
  { name: 'Home & Garden', desc: 'Decor, kitchen, outdoor',         icon: '🏡', gradient: 'from-emerald-500 to-teal-500' },
  { name: 'Sports',        desc: 'Fitness, outdoor, gear',          icon: '⚽', gradient: 'from-red-500 to-pink-500' },
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
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-nav border-b border-surface-200/70 dark:border-surface-800/70 shadow-sm'
          : 'bg-white/95 dark:bg-surface-950/95 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline shrink-0 group">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 bg-linear-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center shadow-brand overflow-hidden"
            >
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ShoppingBag className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              Shop<span className="linear-text-brand">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              to={ROUTES.HOME}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all no-underline relative ${
                isActive(ROUTES.HOME)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
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
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1 cursor-pointer ${
                  isActive(ROUTES.PRODUCTS)
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
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
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-160"
                  >
                    <div className="glass-premium rounded-2xl p-4">
                      <div className="grid grid-cols-3 gap-1">
                        {NAV_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.name}
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors no-underline group"
                          >
                            <span className="text-2xl shrink-0 transition-transform group-hover:scale-110">{cat.icon}</span>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {cat.name}
                              </p>
                              <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                                {cat.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between px-3">
                        <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                          New arrivals every week
                        </p>
                        <Link
                          to={ROUTES.PRODUCTS}
                          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline no-underline"
                        >
                          Browse all →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to={ROUTES.PRODUCTS + '?sort=newest'}
              className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors no-underline text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              New Arrivals
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <div className="hidden sm:block">
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 focus-within:border-primary-400 dark:focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all"
                >
                  <Search className="w-4 h-4 text-surface-400 ml-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent border-none outline-none px-2.5 py-2 text-sm w-48 lg:w-64 text-surface-900 dark:text-white placeholder:text-surface-400"
                  />
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="p-2 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 cursor-pointer"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Wishlist */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-colors no-underline"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: wishlistPulse ? [1, 1.3, 1] : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white transition-colors no-underline"
              aria-label={`Cart (${cart.totalQuantity} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cart.totalQuantity > 0 && (
                  <motion.span
                    key={cart.totalQuantity}
                    initial={{ scale: 0 }}
                    animate={{ scale: cartPulse ? [1, 1.3, 1] : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cart.totalQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  aria-label="Open profile menu"
                >
                  <div className="w-8 h-8 bg-linear-to-br from-primary-500 to-violet-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-60 glass-premium rounded-2xl overflow-hidden z-20"
                      >
                        <div className="p-4 border-b border-surface-100 dark:border-surface-800 bg-linear-to-br from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20">
                          <p className="font-semibold text-surface-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link to={ROUTES.PROFILE} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-200 no-underline text-sm transition-colors">
                            <User className="w-4 h-4 text-surface-400" /> My Profile
                          </Link>
                          <Link to={ROUTES.PROFILE} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-200 no-underline text-sm transition-colors">
                            <Package className="w-4 h-4 text-surface-400" /> My Orders
                          </Link>
                          <Link to={ROUTES.WISHLIST} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-200 no-underline text-sm transition-colors">
                            <Heart className="w-4 h-4 text-surface-400" /> Wishlist
                            {wishlistCount > 0 && (
                              <span className="ml-auto text-xs font-semibold text-red-500">{wishlistCount}</span>
                            )}
                          </Link>
                          <Link to={ROUTES.CART} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-200 no-underline text-sm transition-colors">
                            <ShoppingBag className="w-4 h-4 text-surface-400" /> Cart
                            {cart.totalQuantity > 0 && (
                              <span className="ml-auto text-xs font-semibold text-accent-500">{cart.totalQuantity}</span>
                            )}
                          </Link>
                          {user?.role === 'admin' && (
                            <Link to={ROUTES.ADMIN} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-700 dark:text-primary-400 no-underline text-sm font-medium transition-colors">
                              <Shield className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <div className="my-1.5 border-t border-surface-100 dark:border-surface-800" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm cursor-pointer transition-colors"
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
                  className="px-3.5 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors no-underline"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all hover:shadow-brand no-underline shine-effect"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
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
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-100 dark:bg-surface-800 rounded-xl text-sm text-surface-900 dark:text-white placeholder:text-surface-400 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </form>

              <Link to={ROUTES.HOME} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 no-underline font-medium transition-colors">
                Home
              </Link>
              <Link to={ROUTES.PRODUCTS} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 no-underline font-medium transition-colors">
                All Products
              </Link>

              <div className="px-4 py-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Categories</div>
              <div className="grid grid-cols-2 gap-1.5 px-2">
                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 hover:bg-surface-100 dark:hover:bg-surface-800 no-underline text-sm text-surface-700 dark:text-surface-200 transition-colors"
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-surface-200 dark:border-surface-800 space-y-1">
                {!isAuthenticated ? (
                  <div className="flex gap-2 px-2">
                    <Link to={ROUTES.LOGIN} onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-2.5 text-center rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200 no-underline font-medium text-sm">
                      Login
                    </Link>
                    <Link to={ROUTES.REGISTER} onClick={() => setIsMenuOpen(false)} className="flex-1 px-4 py-2.5 text-center rounded-xl bg-primary-600 text-white no-underline font-semibold text-sm">
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link to={ROUTES.PROFILE} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 no-underline transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
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
