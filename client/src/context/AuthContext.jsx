import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Listen for auth:logout custom events from api.js interceptor
  // This ensures the AuthContext stays in sync if the interceptor forces a logout
  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  // Listen for auth:userUpdated events from token refresh
  useEffect(() => {
    const handleUserUpdate = (event) => {
      const { user: updatedUser, accessToken } = event.detail || {};
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
    };

    window.addEventListener('auth:userUpdated', handleUserUpdate);
    return () => window.removeEventListener('auth:userUpdated', handleUserUpdate);
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, []);

  const isAuthenticated = !!user;

  const value = { user, setUser, loading, register, login, logout, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;