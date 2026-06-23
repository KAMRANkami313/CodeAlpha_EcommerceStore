import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import ROUTES from '../../constants/ROUTES.js';

/**
 * LoginForm — Editorial Modern Redesign
 *
 * Clean brand icon, sentence case labels, primary CTA.
 * Same props, hooks, validation, and logic — fully backward compatible.
 */
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  // Shared input class — consistent with RegisterForm
  const inputBase = "w-full pl-10 pr-11 py-2.5 text-sm font-medium border border-surface-200 dark:border-surface-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all hover:border-surface-300 dark:hover:border-surface-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-md mx-auto"
    >
      {/* Brand header */}
      <div className="text-center mb-7">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 250 }}
          className="w-12 h-12 mx-auto mb-4 rounded-xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-sm"
        >
          <Lock className="w-5 h-5 text-white" strokeWidth={2.2} />
        </motion.div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Welcome back</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-surface-600 dark:text-surface-300">Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" strokeWidth={2} />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={inputBase}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-surface-600 dark:text-surface-300">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" strokeWidth={2} />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className={inputBase}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer transition-colors p-1 rounded-md"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer text-surface-600 dark:text-surface-400">
            <input type="checkbox" className="check-premium" />
            Remember me
          </label>
          <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 no-underline link-underline">
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <Button type="submit" variant="primary" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200 dark:border-surface-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-surface-950 px-3 text-surface-400 font-medium">or</span>
        </div>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-surface-500 dark:text-surface-400">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 no-underline font-medium link-underline ml-0.5">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
