import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token or Admin Token
api.interceptors.request.use(
  (config) => {
    const adminToken = sessionStorage.getItem('surangi_admin_token');
    const userToken = localStorage.getItem('surangi_access_token') || sessionStorage.getItem('surangi_access_token');

    // For admin routes, strictly use adminToken from sessionStorage
    const token = config.url?.includes('/admin') ? adminToken : (userToken || adminToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If payload is FormData, remove default Content-Type so browser sets correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh Token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/admin/login')
    ) {
      originalRequest._retry = true;
      try {
        const isSessionOnly = Boolean(sessionStorage.getItem('surangi_access_token'));
        const refreshToken = localStorage.getItem('surangi_refresh_token') || sessionStorage.getItem('surangi_refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data?.success && res.data?.token) {
            const targetStorage = isSessionOnly ? sessionStorage : localStorage;
            targetStorage.setItem('surangi_access_token', res.data.token);
            if (res.data.refreshToken) {
              targetStorage.setItem('surangi_refresh_token', res.data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('surangi_access_token');
        localStorage.removeItem('surangi_refresh_token');
        sessionStorage.removeItem('surangi_access_token');
        sessionStorage.removeItem('surangi_refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
