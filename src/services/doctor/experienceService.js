import apiClient from '../apiClient';

/**
 * Get Doctor Experiences
 */
export async function getDoctorExperiences(params = {}) {
  const response = await apiClient.get('/doctor/experiences', { params });
  return response.data;
}

/**
 * Get Doctor Experience By ID
 */
export async function getDoctorExperienceById(id) {
  const response = await apiClient.get(`/doctor/experiences/${id}`);
  return response.data;
}

/**
 * Create Doctor Experience
 */
export async function createDoctorExperience(data) {
  const response = await apiClient.post('/doctor/experiences', data);
  return response.data;
}

/**
 * Update Doctor Experience
 */
export async function updateDoctorExperience(id, data) {
  const response = await apiClient.put(`/doctor/experiences/${id}`, data);
  return response.data;
}

/**
 * Delete Doctor Experience
 */
export async function deleteDoctorExperience(id) {
  const response = await apiClient.delete(`/doctor/experiences/${id}`);
  return response.data;
}
