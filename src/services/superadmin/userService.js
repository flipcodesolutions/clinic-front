import apiClient from '@/services/apiClient';

function apiSuccess(response, fallbackMessage) {
  return {
    data: response.data.data,
    message: response.data.message || fallbackMessage,
  };
}

/**
 * Fetch users from the admin API.
 * Filters: search, status, role, page, limit
 */
export async function getUsers(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.role) params.role = filters.role;
  params.page = filters.page || 1;
  params.limit = filters.limit || 10;

  const response = await apiClient.get('/admin/users', { params });

  if (response.data?.success) {
    return {
      data: response.data.data,
      count: response.data.count ?? 0,
      currentPage: response.data.currentPage ?? 1,
      totalPages: response.data.totalPages ?? 1,
      limit: response.data.limit ?? filters.limit ?? 10,
      stats: response.data.stats || { total: 0, active: 0, inactive: 0, blocked: 0 },
    };
  }

  throw new Error(response.data?.message || 'Failed to fetch users');
}

/**
 * Get a single user by ID.
 */
export async function getUserById(id) {
  const response = await apiClient.get(`/admin/users/${id}`);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to fetch user details');
}

/**
 * Create a new user.
 */
export async function createUser(payload) {
  const response = await apiClient.post('/admin/users', payload);

  if (response.data?.success) {
    return apiSuccess(response, 'User created successfully');
  }

  throw new Error(response.data?.message || 'Failed to create user');
}

/**
 * Update a user.
 */
export async function updateUser(id, payload) {
  const response = await apiClient.put(`/admin/users/${id}`, payload);

  if (response.data?.success) {
    return apiSuccess(response, 'User updated successfully');
  }

  throw new Error(response.data?.message || 'Failed to update user');
}

/**
 * Update user status (active, inactive, blocked).
 */
export async function updateUserStatus(id, status) {
  const response = await apiClient.put(`/admin/users/${id}/status`, { status });

  if (response.data?.success) {
    return apiSuccess(response, `User status updated to ${status}`);
  }

  throw new Error(response.data?.message || 'Failed to update user status');
}

/**
 * Delete a user.
 */
export async function deleteUser(id) {
  const response = await apiClient.delete(`/admin/users/${id}`);

  if (response.data?.success) {
    return {
      message: response.data.message || 'User deleted successfully',
    };
  }

  throw new Error(response.data?.message || 'Failed to delete user');
}
