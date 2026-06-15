import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as orderService from '../services/orderService.js';

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);

  res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id);

  res.status(200).json(new ApiResponse(200, order, 'Order fetched successfully'));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getMyOrders(req.user._id, req.query.page, req.query.limit);

  res.status(200).json(new ApiResponse(200, result, 'Orders fetched successfully'));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);

  res.status(200).json(new ApiResponse(200, order, 'Order status updated'));
});

export { createOrder, getOrderById, getMyOrders, updateOrderStatus };