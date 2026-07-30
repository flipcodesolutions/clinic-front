import apiClient from '../apiClient';

/**
 * Get Doctor Leaves
 */
export async function getDoctorLeaves(params = {}) {
  const response = await apiClient.get('/doctor/leaves', { params });
  return response.data;
}

/**
 * Create Doctor Leave Request
 */
export async function createDoctorLeave(data) {
  const response = await apiClient.post('/doctor/leaves', data);
  return response.data;
}

/**
 * Update Doctor Leave Request
 */
export async function updateDoctorLeave(id, data) {
  const response = await apiClient.put(`/doctor/leaves/${id}`, data);
  return response.data;
}

/**
 * Delete Doctor Leave Request
 */
export async function deleteDoctorLeave(id) {
  const response = await apiClient.delete(`/doctor/leaves/${id}`);
  return response.data;
}
