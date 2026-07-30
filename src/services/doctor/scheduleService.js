import apiClient from '../apiClient';

/**
 * Get Doctor Schedules
 */
export async function getDoctorSchedules(params = {}) {
  const response = await apiClient.get('/doctor/schedules', { params });
  return response.data;
}

/**
 * Create Doctor Schedule
 */
export async function createDoctorSchedule(data) {
  const response = await apiClient.post('/doctor/schedules', data);
  return response.data;
}

/**
 * Update Doctor Schedule
 */
export async function updateDoctorSchedule(id, data) {
  const response = await apiClient.put(`/doctor/schedules/${id}`, data);
  return response.data;
}

/**
 * Delete Doctor Schedule
 */
export async function deleteDoctorSchedule(id) {
  const response = await apiClient.delete(`/doctor/schedules/${id}`);
  return response.data;
}
