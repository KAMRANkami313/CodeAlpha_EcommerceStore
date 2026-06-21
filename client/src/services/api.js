import axios from 'axios';
import API from '../constants/API_ENDPOINTS.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if a token refresh is in progress to prevent duplicate calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Helper: Dispatch auth events so AuthContext can react without tight coupling.
 * This avoids direct window.location manipulation and lets React handle navigation.
 */
const dispatchAuthLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new CustomEvent('auth:logout'));
  // Use React Router-aware redirect instead of hard navigation
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const dispatchAuthUpdate = (user, accessToken) => {
  window.dispatchEvent(new CustomEvent('auth:userUpdated', {
    detail: { user, accessToken },
  }));
};

// Request interceptor — attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401, or request already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      if (error.response?.status === 401) {
        dispatchAuthLogout();
      }
      return Promise.reject(error);
    }

    // Don't try to refresh if the failing request IS the refresh-token endpoint
    if (originalRequest.url === API.REFRESH_TOKEN) {
      dispatchAuthLogout();
      return Promise.reject(error);
    }

    // Mark request as retried
    originalRequest._retry = true;

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }).catch((err) => {
        return Promise.reject(err);
      });
    }

    isRefreshing = true;

    try {
      // Attempt to refresh the token
      const response = await axios.post(API.REFRESH_TOKEN, {}, { withCredentials: true });
      const newAccessToken = response.data?.data?.accessToken;

      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);

        // Update user data if returned
        const userData = response.data?.data?.user;
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }

        // Notify AuthContext of the update
        dispatchAuthUpdate(userData, newAccessToken);

        // Process queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        processQueue(new Error('Refresh failed'), null);
        dispatchAuthLogout();
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError, null);
      dispatchAuthLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;