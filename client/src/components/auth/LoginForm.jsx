import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import ROUTES from '../../constants/ROUTES.js';

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

  const inputBase = "w-full pl-10 pr-12 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand"
        >
          <Lock className="w-6 h-6 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Welcome Back</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className={inputBase}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500" />{errors.email.message}
          </p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className={inputBase}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500" />{errors.password.message}
          </p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-surface-600 dark:text-surface-400">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            Remember me
          </label>
          <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Forgot password?
          </a>
        </div>

        <Button type="submit" variant="shine" loading={loading} className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline no-underline">
          Sign Up
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;