import apiClient from '@/services/apiClient';

function apiSuccess(response, fallbackMessage) {
  return {
    data: response.data.data,
    message: response.data.message || fallbackMessage,
  };
}

/**
 * Fetch departments from the admin API.
 * Optional filters: search, status, page, limit
 */
export async function getDepartments(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  params.page = filters.page || 1;
  params.limit = filters.limit || 10;

  const response = await apiClient.get('/admin/departments', { params });

  if (response.data?.success) {
    return {
      data: response.data.data,
      count: response.data.count ?? 0,
      currentPage: response.data.currentPage ?? 1,
      totalPages: response.data.totalPages ?? 1,
      limit: response.data.limit ?? filters.limit ?? 10,
    };
  }

  throw new Error(response.data?.message || 'Failed to fetch departments');
}

/**
 * Create a new department.
 * Payload: { name, description, status }
 */
export async function createDepartment(payload) {
  const response = await apiClient.post('/admin/departments', payload);

  if (response.data?.success) {
    return apiSuccess(response, 'Department created successfully');
  }

  throw new Error(response.data?.message || 'Failed to create department');
}

/**
 * Get a single department by ID (for edit form).
 */
export async function getDepartmentById(id) {
  const response = await apiClient.get(`/admin/departments/${id}`);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to fetch department');
}

/**
 * Update department by ID.
 * Payload: { name, description, status }
 */
export async function updateDepartment(id, payload) {
  const response = await apiClient.put(`/admin/departments/${id}`, payload);

  if (response.data?.success) {
    return apiSuccess(response, 'Department updated successfully');
  }

  throw new Error(response.data?.message || 'Failed to update department');
}

/**
 * Delete a department by ID.
 */
export async function deleteDepartment(id) {
  const response = await apiClient.delete(`/admin/departments/${id}`);

  if (response.data?.success) {
    return {
      message: response.data.message || 'Department deleted successfully',
    };
  }

  throw new Error(response.data?.message || 'Failed to delete department');
}
