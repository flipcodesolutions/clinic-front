import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAuthToken, clearUserSession } from '@/utils/auth';

// Shared axios instance for all API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token in header before every request
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Intercept 401 Unauthorized responses (token expired / invalid)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthRoute = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
      if (!isAuthRoute) {
        clearUserSession();
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
