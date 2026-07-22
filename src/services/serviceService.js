import apiClient from '@/services/apiClient';

/**
 * Fetch services from the admin API.
 * Optional filters: search, status (active / inactive)
 */
export async function getServices(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;

  const response = await apiClient.get('/admin/services', { params });

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error('Failed to fetch services');
}

/**
 * Create a new service.
 * Payload: { name, description, price, status }
 */
export async function createService(payload) {
  const response = await apiClient.post('/admin/services', payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to create service');
}

/**
 * Delete a service by ID.
 */
export async function deleteService(id) {
  const response = await apiClient.delete(`/admin/services/${id}`);

  if (response.data?.success) {
    return true;
  }

  throw new Error(response.data?.message || 'Failed to delete service');
}

/**
 * Update service by ID.
 * Payload: { name, description, price, status }
 */
export async function updateService(id, payload) {
  const response = await apiClient.put(`/admin/services/${id}`, payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to update service');
}
