import apiClient from '@/services/apiClient';

/**
 * Fetch departments from the admin API.
 * Optional filters: search, status (active / inactive)
 */
export async function getDepartments(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;

  const response = await apiClient.get('/admin/departments', { params });

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error('Failed to fetch departments');
}

/**
 * Create a new department.
 * Payload: { name, description, status }
 */
export async function createDepartment(payload) {
  const response = await apiClient.post('/admin/departments', payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to create department');
}

/**
 * Delete a department by ID.
 */
export async function deleteDepartment(id) {
  const response = await apiClient.delete(`/admin/departments/${id}`);

  if (response.data?.success) {
    return true;
  }

  throw new Error(response.data?.message || 'Failed to delete department');
}

/**
 * Update department by ID.
 * Payload: { name, description, status }
 */
export async function updateDepartment(id, payload) {
  const response = await apiClient.put(`/admin/departments/${id}`, payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to update department');
}

