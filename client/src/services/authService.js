import api from './api.js';
import API from '../constants/API_ENDPOINTS.js';

const register = async (userData) => {
  const response = await api.post(API.REGISTER, userData);
  if (response.data?.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post(API.LOGIN, credentials);
  if (response.data?.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

const logout = async () => {
  const response = await api.post(API.LOGOUT);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  return response.data;
};

const getProfile = async () => {
  const response = await api.get(API.PROFILE);
  return response.data;
};

const updateProfile = async (data) => {
  const response = await api.put(API.PROFILE, data);
  return response.data;
};

export default { register, login, logout, getProfile, updateProfile };