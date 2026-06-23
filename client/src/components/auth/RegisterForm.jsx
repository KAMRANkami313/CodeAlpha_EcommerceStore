import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import ROUTES from '../../constants/ROUTES.js';

const passwordRules = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v) => /[^a-zA-Z0-9]/.test(v) },
];

/**
 * RegisterForm — Editorial Modern Redesign
 *
 * Clean brand icon, sentence case labels, primary CTA, refined strength meter.
 * Same props, hooks, validation rules, and strength logic — fully backward compatible.
 */
const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const passwordValue = watch('password', '');

  // Password strength calculations (same logic as before)
  const passedCount = passwordRules.filter(r => r.test(passwordValue)).length;
  const strengthLevel = passedCount <= 1 ? 0 : passedCount <= 2 ? 1 : passedCount <= 3 ? 2 : passedCount <= 4 ? 3 : 4;
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-surface-300', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const onSubmit = async (data) => {
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const messages = error.response?.data?.errors;
      if (messages && messages.length > 0) {
        toast.error(messages[0]);
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    }
  };

  // Shared input class — matches LoginForm
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
          <User className="w-5 h-5 text-white" strokeWidth={2.2} />
        </motion.div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Create your account</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">Join us and start shopping today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-surface-600 dark:text-surface-300">Full name</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" strokeWidth={2} />
            <input
              type="text"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
              className={inputBase}
              placeholder="Muhammad Kamran"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.name.message}
            </p>
          )}
        </div>

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
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                validate: {
                  uppercase: (v) => /[A-Z]/.test(v) || 'Need at least one uppercase letter',
                  lowercase: (v) => /[a-z]/.test(v) || 'Need at least one lowercase letter',
                  number: (v) => /[0-9]/.test(v) || 'Need at least one number',
                  special: (v) => /[^a-zA-Z0-9]/.test(v) || 'Need at least one special character',
                },
              })}
              onFocus={() => setPasswordFocused(true)}
              className={inputBase}
              placeholder="Min 8 characters"
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

          {/* Strength meter */}
          {passwordValue && (
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= strengthLevel ? strengthColors[strengthLevel] : 'bg-surface-200 dark:bg-surface-800'
                    }`}
                  />
                ))}
                <span className="text-[11px] font-medium text-surface-500 dark:text-surface-400 ml-1.5 min-w-14 text-right">
                  {strengthLabels[strengthLevel]}
                </span>
              </div>

              {/* Rules checklist */}
              {passwordFocused && (
                <div className="grid grid-cols-1 gap-1.5 pt-1 bg-surface-50 dark:bg-surface-950 p-3 rounded-lg border border-surface-200 dark:border-surface-800">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(passwordValue);
                    return (
                      <motion.div
                        key={rule.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400 dark:text-surface-500'}`}
                      >
                        {passed ? (
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        ) : (
                          <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                        )}
                        <span>{rule.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-500 rounded-full" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-1">
          <Button type="submit" variant="primary" loading={loading} className="w-full" size="lg">
            Create Account
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

      {/* Sign in link */}
      <p className="text-center text-sm text-surface-500 dark:text-surface-400">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 no-underline font-medium link-underline ml-0.5">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;