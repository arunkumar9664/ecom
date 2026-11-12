import axios from 'axios';
import { storageKeys } from '../config/brand.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function readUserToken() {
  return localStorage.getItem(storageKeys.accessToken) || sessionStorage.getItem(storageKeys.accessToken);
}

function readRefreshToken() {
  return localStorage.getItem(storageKeys.refreshToken) || sessionStorage.getItem(storageKeys.refreshToken);
}

api.interceptors.request.use(
  (config) => {
    const adminToken = sessionStorage.getItem(storageKeys.adminToken);
    const userToken = readUserToken();
    const token = config.url?.includes('/admin') ? adminToken : (userToken || adminToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/admin/login')
    ) {
      originalRequest._retry = true;
      try {
        const isSessionOnly = Boolean(sessionStorage.getItem(storageKeys.accessToken));
        const refreshToken = readRefreshToken();
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data?.success && res.data?.token) {
            const targetStorage = isSessionOnly ? sessionStorage : localStorage;
            targetStorage.setItem(storageKeys.accessToken, res.data.token);
            if (res.data.refreshToken) {
              targetStorage.setItem(storageKeys.refreshToken, res.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem(storageKeys.accessToken);
        localStorage.removeItem(storageKeys.refreshToken);
        sessionStorage.removeItem(storageKeys.accessToken);
        sessionStorage.removeItem(storageKeys.refreshToken);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
