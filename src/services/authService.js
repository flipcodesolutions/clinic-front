import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

/**
 * Login user with email and password.
 * Returns { user, token } from API.
 */
export async function login(email, password) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Login failed');
}
