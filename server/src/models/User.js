import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      immutable: true, // Prevent role changes via direct assignment
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    refreshToken: {
      type: String,
      select: false,
    },
    // Account lockout fields
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lockUntil: {
      type: Number,
      select: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtual: Check if account is locked ──────────────────────
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ─── Hash password before saving ─────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const saltRounds = env.BCRYPT_SALT_ROUNDS || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// ─── Compare password method ─────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Account lockout: increment failed attempts ──────────────
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const maxAttempts = env.MAX_LOGIN_ATTEMPTS || 5;
  const lockTime = (env.LOGIN_LOCKOUT_TIME || 15) * 60 * 1000; // minutes to ms

  // If we've hit max attempts and no current lock, lock the account
  const updates = { $inc: { loginAttempts: 1 } };
  const needToLock = this.loginAttempts + 1 >= maxAttempts;

  if (needToLock) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

// ─── Account lockout: reset attempts on successful login ─────
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// ─── Remove sensitive fields from JSON output ────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;