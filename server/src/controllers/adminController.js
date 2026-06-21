import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as adminService from '../services/adminService.js';

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched successfully'));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const result = await adminService.getAllOrders(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Orders fetched successfully'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await adminService.getOrderByIdAdmin(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully'));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully'));
});

const getUserById = asyncHandler(async (req, res) => {
  const result = await adminService.getUserByIdAdmin(req.params.id);
  if (!result.user) {
    throw new ApiError(404, 'User not found');
  }
  res.status(200).json(new ApiResponse(200, result, 'User fetched successfully'));
});

const changeUserRole = asyncHandler(async (req, res) => {
  const user = await adminService.changeUserRole(req.params.id, req.body.role);
  res.status(200).json(new ApiResponse(200, user, 'User role updated successfully'));
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.params.id);
  res.status(200).json(new ApiResponse(200, null, result.message));
});

export { getDashboardStats, getAllOrders, getOrderById, getAllUsers, getUserById, changeUserRole, deleteUser };