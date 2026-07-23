import apiClient from '@/services/apiClient';

function apiSuccess(response, fallbackMessage) {
  return {
    data: response.data.data,
    message: response.data.message || fallbackMessage,
  };
}

/**
 * Fetch clinics from the admin API.
 * Optional filters: search, status, page, limit
 */
export async function getClinics(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  params.page = filters.page || 1;
  params.limit = filters.limit || 10;

  const response = await apiClient.get('/admin/clinics', { params });

  if (response.data?.success) {
    return {
      data: response.data.data,
      count: response.data.count ?? 0,
      currentPage: response.data.currentPage ?? 1,
      totalPages: response.data.totalPages ?? 1,
      limit: response.data.limit ?? filters.limit ?? 10,
    };
  }

  throw new Error(response.data?.message || 'Failed to fetch clinics');
}

/**
 * Create a new clinic.
 */
export async function createClinic(payload) {
  const response = await apiClient.post('/admin/clinics', payload);

  if (response.data?.success) {
    return apiSuccess(response, 'Clinic registered successfully');
  }

  throw new Error(response.data?.message || 'Failed to create clinic');
}

/**
 * Get a single clinic by ID.
 */
export async function getClinicById(id) {
  const response = await apiClient.get(`/admin/clinics/${id}`);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to fetch clinic');
}

/**
 * Update clinic by ID.
 */
export async function updateClinic(id, payload) {
  const response = await apiClient.put(`/admin/clinics/${id}`, payload);

  if (response.data?.success) {
    return apiSuccess(response, 'Clinic updated successfully');
  }

  throw new Error(response.data?.message || 'Failed to update clinic');
}

/**
 * Delete clinic by ID.
 */
export async function deleteClinic(id) {
  const response = await apiClient.delete(`/admin/clinics/${id}`);

  if (response.data?.success) {
    return {
      message: response.data.message || 'Clinic deleted successfully',
    };
  }

  throw new Error(response.data?.message || 'Failed to delete clinic');
}
