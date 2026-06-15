import api from './api.js';
import API from '../constants/API_ENDPOINTS.js';

const getAllProducts = async (params = {}) => {
  const response = await api.get(API.PRODUCTS, { params });
  return response.data;
};

const getProductById = async (id) => {
  const response = await api.get(API.PRODUCT_DETAIL(id));
  return response.data;
};

export default { getAllProducts, getProductById };