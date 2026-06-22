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
 * LoginForm — Premium Redesign
 *
 * A high-fidelity, micro-interactive login card featuring tactile inputs,
 * styled checkboxes, and robust input validation states.
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

  // Shared premium input class — consistent across all auth forms (Tactile Minimalist)
  const inputBase = "w-full pl-11 pr-12 py-3 text-sm font-semibold border-1.5 border-surface-200 dark:border-surface-850 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-300 hover:border-surface-300 dark:hover:border-surface-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-md mx-auto"
    >
      {/* Brand Header */}
      <div className="text-center mb-7 select-none">
        <motion.div
          initial={{ scale: 0, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand overflow-hidden border border-white/10"
        >
          {/* Shine Sweep Overlay */}
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shine_3s_ease-in-out_infinite]" />
          <Lock className="w-6.5 h-6.5 text-white relative z-10 stroke-[2.2]" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Welcome Back</h1>
        <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 mt-2">Sign in to your premium account to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
        
        {/* Email Address Input */}
        <div className="space-y-2">
          <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-550 uppercase tracking-widest select-none">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={inputBase}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-danger text-2xs font-bold mt-1.5 flex items-center gap-1.5 uppercase tracking-wider select-none animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-550 uppercase tracking-widest select-none">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className={inputBase}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer transition-colors p-1 rounded-md"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-danger text-2xs font-bold mt-1.5 flex items-center gap-1.5 uppercase tracking-wider select-none animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between text-xs font-semibold select-none pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-surface-550 dark:text-surface-400">
            <input
              type="checkbox"
              className="check-premium"
            />
            Remember me
          </label>
          <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 no-underline link-underline">
            Forgot password?
          </a>
        </div>

        {/* Sign In CTA */}
        <div className="pt-2">
          <Button type="submit" variant="shine" loading={loading} className="w-full font-bold uppercase tracking-wider py-3.5 shadow-brand" size="lg">
            Sign In
          </Button>
        </div>
      </form>

      {/* Styled Secondary Divider */}
      <div className="relative my-6 select-none">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200/60 dark:border-surface-800/40" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface-50 dark:bg-surface-950 px-3 text-surface-400 dark:text-surface-550 font-bold uppercase tracking-widest text-2xs">or</span>
        </div>
      </div>

      <p className="text-center text-xs font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 select-none">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 no-underline font-extrabold link-underline ml-1">
          Sign Up
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;
