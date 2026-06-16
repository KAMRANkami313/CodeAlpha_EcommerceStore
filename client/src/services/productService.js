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

const createProduct = async (formData) => {
  const response = await api.post(API.PRODUCTS, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const updateProduct = async (id, data) => {
  const response = await api.put(API.PRODUCT_DETAIL(id), data);
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await api.delete(API.PRODUCT_DETAIL(id));
  return response.data;
};

export default { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };