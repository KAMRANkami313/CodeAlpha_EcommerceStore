import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';
import env from '../config/env.js';

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }
  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken } });
  const safeUser = await User.findById(user._id).select('-password -refreshToken -loginAttempts -lockUntil');
  return { user: safeUser, accessToken, refreshToken };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if account is locked
  if (user.isLocked) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new ApiError(423, `Account is temporarily locked due to too many failed login attempts. Please try again in ${remainingTime} minute(s).`);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    // Increment login attempts on failed password
    await user.incLoginAttempts();
    const attemptsLeft = env.MAX_LOGIN_ATTEMPTS - (user.loginAttempts + 1);
    if (attemptsLeft > 0) {
      throw new ApiError(401, `Invalid email or password. ${attemptsLeft} attempt(s) remaining before account lockout.`);
    }
    throw new ApiError(423, 'Account locked due to too many failed login attempts. Please try again later.');
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken } });
  const safeUser = await User.findById(user._id).select('-password -refreshToken -loginAttempts -lockUntil');
  return { user: safeUser, accessToken, refreshToken };
};

const refreshUserToken = async (token) => {
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id).select('-password -loginAttempts -lockUntil');

  if (!user) {
    throw new ApiError(401, 'User belonging to this token no longer exists.');
  }

  // Verify the refresh token matches the stored one (single session)
  if (user.refreshToken !== token) {
    await User.updateOne({ _id: user._id }, { $unset: { refreshToken: 1 } });
    throw new ApiError(401, 'Invalid refresh token. Please log in again.');
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  await User.updateOne({ _id: user._id }, { $set: { refreshToken: newRefreshToken } });

  const safeUser = await User.findById(user._id).select('-password -refreshToken -loginAttempts -lockUntil');
  return { user: safeUser, accessToken, refreshToken: newRefreshToken };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken -loginAttempts -lockUntil');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  // Whitelist only allowed fields — prevent mass assignment (e.g., setting role: 'admin')
  const allowedFields = ['name', 'phone', 'avatar'];
  const filteredData = {};
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  // Handle address update separately (nested object)
  if (updateData.address) {
    const allowedAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    filteredData.address = {};
    for (const field of allowedAddressFields) {
      if (updateData.address[field] !== undefined) {
        filteredData.address[field] = updateData.address[field];
      }
    }
  }

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken -loginAttempts -lockUntil');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export { registerUser, loginUser, refreshUserToken, getUserProfile, updateUserProfile };