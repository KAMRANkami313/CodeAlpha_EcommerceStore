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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Create Account</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-2">Join us and start shopping</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
              className="w-full pl-10 pr-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
              placeholder="Muhammad Kamran"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full pl-10 pr-4 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
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
              className="w-full pl-10 pr-12 py-3 border border-surface-200 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
              placeholder="Min 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}

          {/* Password strength indicator */}
          {passwordFocused && passwordValue && (
            <div className="mt-2 space-y-1">
              {passwordRules.map((rule) => {
                const passed = rule.test(passwordValue);
                return (
                  <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400 dark:text-surface-500'}`}>
                    {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>{rule.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-6">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline no-underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;