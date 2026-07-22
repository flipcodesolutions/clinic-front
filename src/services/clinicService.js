import apiClient from '@/services/apiClient';

/**
 * Fetch clinics from the admin API.
 * Optional filters: search, status (active / inactive)
 */
export async function getClinics(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;

  const response = await apiClient.get('/admin/clinics', { params });

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error('Failed to fetch clinics');
}

/**
 * Create a new clinic.
 */
export async function createClinic(payload) {
  const response = await apiClient.post('/admin/clinics', payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to create clinic');
}

/**
 * Update clinic by ID.
 */
export async function updateClinic(id, payload) {
  const response = await apiClient.put(`/admin/clinics/${id}`, payload);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to update clinic');
}

/**
 * Delete clinic by ID.
 */
export async function deleteClinic(id) {
  const response = await apiClient.delete(`/admin/clinics/${id}`);

  if (response.data?.success) {
    return true;
  }

  throw new Error(response.data?.message || 'Failed to delete clinic');
}
