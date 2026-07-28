import apiClient from '@/services/apiClient';

function apiSuccess(response, fallbackMessage) {
  return {
    data: response.data.data,
    message: response.data.message || fallbackMessage,
  };
}

/**
 * Fetch services from the admin API.
 * Optional filters: search, status, page, limit
 */
export async function getServices(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  params.page = filters.page || 1;
  params.limit = filters.limit || 10;

  const response = await apiClient.get('/admin/services', { params });

  if (response.data?.success) {
    return {
      data: response.data.data,
      count: response.data.count ?? 0,
      currentPage: response.data.currentPage ?? 1,
      totalPages: response.data.totalPages ?? 1,
      limit: response.data.limit ?? filters.limit ?? 10,
    };
  }

  throw new Error(response.data?.message || 'Failed to fetch services');
}

/**
 * Create a new service.
 * Payload: { name, description, price, status }
 */
export async function createService(payload) {
  const response = await apiClient.post('/admin/services', payload);

  if (response.data?.success) {
    return apiSuccess(response, 'Service created successfully');
  }

  throw new Error(response.data?.message || 'Failed to create service');
}

/**
 * Get a single service by ID (for edit form).
 */
export async function getServiceById(id) {
  const response = await apiClient.get(`/admin/services/${id}`);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to fetch service');
}

/**
 * Update service by ID.
 * Payload: { name, description, price, status }
 */
export async function updateService(id, payload) {
  const response = await apiClient.put(`/admin/services/${id}`, payload);

  if (response.data?.success) {
    return apiSuccess(response, 'Service updated successfully');
  }

  throw new Error(response.data?.message || 'Failed to update service');
}

/**
 * Delete a service by ID.
 */
export async function deleteService(id) {
  const response = await apiClient.delete(`/admin/services/${id}`);

  if (response.data?.success) {
    return {
      message: response.data.message || 'Service deleted successfully',
    };
  }

  throw new Error(response.data?.message || 'Failed to delete service');
}
