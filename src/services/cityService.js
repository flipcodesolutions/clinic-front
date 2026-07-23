import apiClient from '@/services/apiClient';

function apiSuccess(response, fallbackMessage) {
  return {
    data: response.data.data,
    message: response.data.message || fallbackMessage,
  };
}

/**
 * Fetch cities from the admin API.
 * Optional filters: search, status, page, limit
 */
export async function getCities(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;
  params.page = filters.page || 1;
  params.limit = filters.limit || 10;

  const response = await apiClient.get('/admin/cities', { params });

  if (response.data?.success) {
    return {
      data: response.data.data,
      count: response.data.count ?? 0,
      currentPage: response.data.currentPage ?? 1,
      totalPages: response.data.totalPages ?? 1,
      limit: response.data.limit ?? filters.limit ?? 10,
    };
  }

  throw new Error(response.data?.message || 'Failed to fetch cities');
}

/**
 * Create a new city.
 * Payload: { name, status }
 */
export async function createCity(payload) {
  const response = await apiClient.post('/admin/cities', payload);

  if (response.data?.success) {
    return apiSuccess(response, 'City created successfully');
  }

  throw new Error(response.data?.message || 'Failed to create city');
}

/**
 * Get a single city by ID (for edit form).
 */
export async function getCityById(id) {
  const response = await apiClient.get(`/admin/cities/${id}`);

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error(response.data?.message || 'Failed to fetch city');
}

/**
 * Update a city by ID.
 * PUT /admin/cities/:id
 * Payload: { name, status }
 */
export async function updateCity(id, payload) {
  const response = await apiClient.put(`/admin/cities/${id}`, payload);

  if (response.data?.success) {
    return apiSuccess(response, 'City updated successfully');
  }

  throw new Error(response.data?.message || 'Failed to update city');
}

/**
 * Delete a city by ID.
 */
export async function deleteCity(id) {
  const response = await apiClient.delete(`/admin/cities/${id}`);

  if (response.data?.success) {
    return {
      message: response.data.message || 'City deleted successfully',
    };
  }

  throw new Error(response.data?.message || 'Failed to delete city');
}
