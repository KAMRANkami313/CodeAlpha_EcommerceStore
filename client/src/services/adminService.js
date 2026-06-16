import api from './api.js';
import API from '../constants/API_ENDPOINTS.js';

const getDashboardStats = async () => {
  const response = await api.get(API.ADMIN_STATS);
  return response.data;
};

const getAllOrders = async (params = {}) => {
  const response = await api.get(API.ADMIN_ORDERS, { params });
  return response.data;
};

const getOrderById = async (id) => {
  const response = await api.get(API.ADMIN_ORDER_DETAIL(id));
  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await api.put(`${API.ADMIN_ORDERS}/${id}/status`, { status });
  return response.data;
};

const getAllUsers = async (params = {}) => {
  const response = await api.get(API.ADMIN_USERS, { params });
  return response.data;
};

const getUserById = async (id) => {
  const response = await api.get(API.ADMIN_USER_DETAIL(id));
  return response.data;
};

export default {
  getDashboardStats,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAllUsers,
  getUserById,
};
