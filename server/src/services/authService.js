import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
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

  // Use updateOne instead of save() to avoid re-triggering the password pre-save hook
  await User.updateOne(
    { _id: user._id },
    { $set: { refreshToken: refreshToken } }
  );

  const safeUser = await User.findById(user._id).select('-password -refreshToken');

  return { user: safeUser, accessToken, refreshToken };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Use updateOne instead of save() to avoid re-triggering the password pre-save hook
  await User.updateOne(
    { _id: user._id },
    { $set: { refreshToken: refreshToken } }
  );

  const safeUser = await User.findById(user._id).select('-password -refreshToken');

  return { user: safeUser, accessToken, refreshToken };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };