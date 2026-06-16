import api from './api.js';
import API from '../constants/API_ENDPOINTS.js';

const getWishlist = async () => {
  const response = await api.get(API.WISHLIST);
  return response.data;
};

const addToWishlist = async (productId) => {
  const response = await api.post(API.WISHLIST_ITEM(productId));
  return response.data;
};

const removeFromWishlist = async (productId) => {
  const response = await api.delete(API.WISHLIST_ITEM(productId));
  return response.data;
};

const checkWishlist = async (productId) => {
  const response = await api.get(API.WISHLIST_CHECK(productId));
  return response.data;
};

export default { getWishlist, addToWishlist, removeFromWishlist, checkWishlist };