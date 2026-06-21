import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';
import User from '../models/User.js';
import * as authService from '../services/authService.js';

const getAccessTokenCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes (matches JWT_EXPIRE)
  path: '/',
});

const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: parseInt(env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
  path: '/api/auth/refresh', // Only sent on refresh endpoint
});

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
};

const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(201).json(new ApiResponse(201, { user, accessToken }, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(200).json(new ApiResponse(200, { user, accessToken }, 'User logged in successfully'));
});

const logout = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.updateOne({ _id: req.user._id }, { $unset: { refreshToken: 1 } });
  }
  // Clear cookies with the same options they were set with
  res.cookie('accessToken', '', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0, path: '/' });
  res.cookie('refreshToken', '', { httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0, path: '/api/auth/refresh' });
  res.status(200).json(new ApiResponse(200, null, 'User logged out successfully'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    throw new ApiError(401, 'No refresh token provided. Please log in again.');
  }
  const { user, accessToken, refreshToken: newRefreshToken } = await authService.refreshUserToken(token);
  setTokenCookies(res, accessToken, newRefreshToken);
  res.status(200).json(new ApiResponse(200, { user, accessToken }, 'Token refreshed successfully'));
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);
  res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateUserProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export { register, login, logout, refreshToken, getProfile, updateProfile };