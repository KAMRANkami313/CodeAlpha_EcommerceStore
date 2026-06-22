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
 * RegisterForm — Premium Redesign
 *
 * A high-fidelity, micro-interactive registration card featuring tactile inputs,
 * dynamic strength indicators, and a clean validation rules checklist.
 */
const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const passwordValue = watch('password', '');

  // Password strength calculations (original robust metrics)
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

  // Shared premium input class — matches LoginForm for visual consistency
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
          initial={{ scale: 0, rotate: 8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-brand overflow-hidden border border-white/10"
        >
          {/* Shine Sweep Overlay */}
          <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shine_3s_ease-in-out_infinite]" />
          <User className="w-6.5 h-6.5 text-white relative z-10 stroke-[2.2]" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">Create Account</h1>
        <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 mt-2">Join us and start shopping today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
        
        {/* Full Name Input */}
        <div className="space-y-2">
          <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-555 uppercase tracking-widest select-none">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
              className={inputBase}
              placeholder="Muhammad Kamran"
            />
          </div>
          {errors.name && (
            <p className="text-danger text-2xs font-bold mt-1.5 flex items-center gap-1.5 uppercase tracking-wider select-none animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address Input */}
        <div className="space-y-2">
          <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-555 uppercase tracking-widest select-none">Email Address</label>
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

        {/* Password Input with Complex Verification */}
        <div className="space-y-2">
          <label className="block text-2xs font-extrabold text-surface-450 dark:text-surface-555 uppercase tracking-widest select-none">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 cursor-pointer transition-colors p-1 rounded-md"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Styled Password Strength Meter */}
          {passwordValue && (
            <div className="mt-3.5 space-y-2.5 select-none animate-fade-in">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strengthLevel ? strengthColors[strengthLevel] : 'bg-surface-200 dark:bg-surface-800'
                    }`}
                  />
                ))}
                <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 ml-1.5 min-w-12 text-right uppercase tracking-wider">
                  {strengthLabels[strengthLevel]}
                </span>
              </div>

              {/* Password Rules Checklist */}
              {passwordFocused && (
                <div className="grid grid-cols-1 gap-1.5 pt-1 bg-surface-50 dark:bg-surface-950 p-3 rounded-xl border border-surface-200/30 dark:border-surface-800/30">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(passwordValue);
                    return (
                      <motion.div
                        key={rule.label}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider transition-colors ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400 dark:text-surface-500'}`}
                      >
                        {passed ? (
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        ) : (
                          <X className="w-3.5 h-3.5 stroke-3" />
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
            <p className="text-danger text-2xs font-bold mt-1.5 flex items-center gap-1.5 uppercase tracking-wider select-none animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Create Account CTA */}
        <div className="pt-2 select-none">
          <Button type="submit" variant="shine" loading={loading} className="w-full font-bold uppercase tracking-wider py-3.5 shadow-brand" size="lg">
            Create Account
          </Button>
        </div>
      </form>

      {/* Styled Secondary Divider */}
      <div className="relative my-6 select-none">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200/60 dark:border-surface-800/40" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface-50 dark:bg-surface-950 px-3 text-surface-400 dark:text-surface-555 font-bold uppercase tracking-widest text-2xs">or</span>
        </div>
      </div>

      <p className="text-center text-xs font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 select-none">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 no-underline font-extrabold link-underline ml-1">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
};

export default RegisterForm;