import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
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
    return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
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
    return res.status(404).json(new ApiResponse(404, null, 'User not found'));
  }
  res.status(200).json(new ApiResponse(200, result, 'User fetched successfully'));
});

export { getDashboardStats, getAllOrders, getOrderById, getAllUsers, getUserById };