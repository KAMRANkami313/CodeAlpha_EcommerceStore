import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Search, LogOut, Heart, Sun, Moon, Shield } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import useCart from '../../hooks/useCart.js';
import useWishlist from '../../hooks/useWishlist.js';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import ROUTES from '../../constants/ROUTES.js';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white">
              Shop<span className="text-primary-600">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to={ROUTES.HOME} className="text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors no-underline">
              Home
            </Link>
            <Link to={ROUTES.PRODUCTS} className="text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors no-underline">
              Products
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-surface-600" />
              )}
            </button>

            <Link
              to={ROUTES.PRODUCTS}
              className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors no-underline"
            >
              <Search className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            </Link>

            {/* Wishlist */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors no-underline"
            >
              <Heart className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors no-underline"
            >
              <ShoppingBag className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              {cart.totalQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.totalQuantity}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-12 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-surface-100 dark:border-surface-700">
                        <p className="font-semibold text-surface-800 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to={ROUTES.PROFILE}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 no-underline text-sm"
                        >
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to={ROUTES.ADMIN}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-700 dark:text-primary-400 no-underline text-sm font-medium"
                          >
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <Link
                          to={ROUTES.WISHLIST}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 no-underline text-sm"
                        >
                          <Heart className="w-4 h-4" /> Wishlist
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors no-underline"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors no-underline"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-surface-600" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-surface-700 dark:text-surface-300" /> : <Menu className="w-6 h-6 text-surface-700 dark:text-surface-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to={ROUTES.HOME}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-surface-700 dark:text-surface-300 font-medium no-underline"
              >
                Home
              </Link>
              <Link
                to={ROUTES.PRODUCTS}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-surface-700 dark:text-surface-300 font-medium no-underline"
              >
                Products
              </Link>
              <Link
                to={ROUTES.WISHLIST}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-surface-700 dark:text-surface-300 font-medium no-underline"
              >
                Wishlist {wishlistCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>}
              </Link>
              <Link
                to={ROUTES.CART}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-surface-700 dark:text-surface-300 font-medium no-underline"
              >
                Cart {cart.totalQuantity > 0 && <span className="bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">{cart.totalQuantity}</span>}
              </Link>
              <div className="pt-3 border-t border-surface-200 dark:border-surface-700">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={ROUTES.PROFILE}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-surface-700 dark:text-surface-300 font-medium no-underline"
                    >
                      Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to={ROUTES.ADMIN}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 py-2 text-primary-600 dark:text-primary-400 font-medium no-underline"
                      >
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="block py-2 text-red-600 dark:text-red-400 font-medium cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 text-center py-2 border border-surface-300 dark:border-surface-600 rounded-xl text-surface-700 dark:text-surface-300 font-medium no-underline"
                    >
                      Login
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 text-center py-2 bg-primary-600 text-white rounded-xl font-semibold no-underline"
                    >
                      Sign Up
                    </Link>
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