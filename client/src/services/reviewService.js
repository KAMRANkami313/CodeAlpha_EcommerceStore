import api from './api.js';
import API from '../constants/API_ENDPOINTS.js';

const getProductReviews = async (productId, page = 1) => {
  const response = await api.get(API.PRODUCT_REVIEWS(productId), { params: { page } });
  return response.data;
};

const createReview = async (productId, reviewData) => {
  const response = await api.post(API.PRODUCT_REVIEWS(productId), reviewData);
  return response.data;
};

const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(API.REVIEW_DETAIL(reviewId), reviewData);
  return response.data;
};

const deleteReview = async (reviewId) => {
  const response = await api.delete(API.REVIEW_DETAIL(reviewId));
  return response.data;
};

export default { getProductReviews, createReview, updateReview, deleteReview };