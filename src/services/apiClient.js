import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAuthToken } from '@/utils/auth';

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

export default apiClient;
