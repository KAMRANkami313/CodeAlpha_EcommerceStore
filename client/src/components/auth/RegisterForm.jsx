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

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const passwordValue = watch('password', '');

  // Password strength calculation
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

  // Shared premium input class — same as LoginForm for consistency
  const inputBase = "w-full pl-11 pr-12 py-3 text-sm border-1.5 border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500 bg-surface-50 dark:bg-surface-800/60 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-200 hover:border-surface-300 dark:hover:border-surface-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}
          className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand overflow-hidden"
        >
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_3s_ease-in-out_infinite]" />
          <User className="w-7 h-7 text-white relative z-10" strokeWidth={2.2} />
        </motion.div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">Create Account</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-2 text-sm">Join us and start shopping today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
              className={inputBase}
              placeholder="Muhammad Kamran"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500" />{errors.name.message}
          </p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
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
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password strength bar (NEW) */}
          {passwordValue && (
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strengthLevel ? strengthColors[strengthLevel] : 'bg-surface-200 dark:bg-surface-700'
                    }`}
                  />
                ))}
                <span className="text-xs font-medium text-surface-500 dark:text-surface-400 ml-1 min-w-12 text-right">
                  {strengthLabels[strengthLevel]}
                </span>
              </div>

              {/* Rules checklist */}
              {passwordFocused && (
                <div className="grid grid-cols-1 gap-1 pt-1">
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
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        <span>{rule.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {errors.password && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500" />{errors.password.message}
          </p>}
        </div>

        <Button type="submit" variant="shine" loading={loading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200 dark:border-surface-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-surface-950 px-3 text-surface-400 uppercase tracking-wider">or</span>
        </div>
      </div>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline no-underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;