import apiClient from '@/services/apiClient';

/**
 * Fetch cities from the admin API.
 * Optional filters: search, status (active / inactive)
 */
export async function getCities(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;

  const response = await apiClient.get('/admin/cities', { params });

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error('Failed to fetch cities');
}

/**
 * Create a new city.
 * Payload: { name, status }
 */
export async function createCity(payload) {
  const response = await apiClient.post('/admin/cities', payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to create city');
}

/**
 * Update an existing city by ID.
 * Payload: { name, status }
 */
export async function updateCity(id, payload) {
  const response = await apiClient.put(`/admin/cities/${id}`, payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to update city');
}

/**
 * Delete a city by ID.
 */
export async function deleteCity(id) {
  const response = await apiClient.delete(`/admin/cities/${id}`);

  if (response.data?.success) {
    return true;
  }

  throw new Error(response.data?.message || 'Failed to delete city');
}
