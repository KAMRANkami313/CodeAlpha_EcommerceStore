import api from './api.js';
import API from '../constants/API_ENDPOINTS.js';

const createOrder = async (orderData) => {
  const response = await api.post(API.ORDERS, orderData);
  return response.data;
};

const getMyOrders = async (params = {}) => {
  const response = await api.get(API.ORDERS, { params });
  return response.data;
};

const getOrderById = async (id) => {
  const response = await api.get(API.ORDER_DETAIL(id));
  return response.data;
};

export default { createOrder, getMyOrders, getOrderById };