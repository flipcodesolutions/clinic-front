import apiClient from '@/services/apiClient';

/**
 * Fetch clinics from the admin API.
 * Optional filters: search, status (active / inactive)
 *
 * Examples:
 *   getClinics({ status: 'active' })
 *   getClinics({ search: 'apollo' })
 *   getClinics({ search: 'apollo', status: 'active' })
 */
export async function getClinics(filters = {}) {
  const params = {};

  if (filters.search) params.search = filters.search;
  if (filters.status) params.status = filters.status;

  const response = await apiClient.get('/clinics', { params });

  if (response.data?.success) {
    return response.data.data;
  }

  throw new Error('Failed to fetch clinics');
}
