import api from './api.js';
import API from '../constants/API_ENDPOINTS.js';

const getCart = async () => {
  const response = await api.get(API.CART);
  return response.data;
};

const addToCart = async (productId, quantity = 1) => {
  const response = await api.post(API.CART, { productId, quantity });
  return response.data;
};

const updateCartItem = async (productId, quantity) => {
  const response = await api.put(API.CART_ITEM(productId), { quantity });
  return response.data;
};

const removeFromCart = async (productId) => {
  const response = await api.delete(API.CART_ITEM(productId));
  return response.data;
};

const clearCart = async () => {
  const response = await api.delete(API.CART);
  return response.data;
};

export default { getCart, addToCart, updateCartItem, removeFromCart, clearCart };