import apiClient from '../apiClient';

/**
 * Get Doctor Achievements
 */
export async function getDoctorAchievements(params = {}) {
  const response = await apiClient.get('/doctor/achievements', { params });
  return response.data;
}

/**
 * Get Doctor Achievement By ID
 */
export async function getDoctorAchievementById(id) {
  const response = await apiClient.get(`/doctor/achievements/${id}`);
  return response.data;
}

/**
 * Create Doctor Achievement
 */
export async function createDoctorAchievement(data) {
  const response = await apiClient.post('/doctor/achievements', data);
  return response.data;
}

/**
 * Update Doctor Achievement
 */
export async function updateDoctorAchievement(id, data) {
  const response = await apiClient.put(`/doctor/achievements/${id}`, data);
  return response.data;
}

/**
 * Delete Doctor Achievement
 */
export async function deleteDoctorAchievement(id) {
  const response = await apiClient.delete(`/doctor/achievements/${id}`);
  return response.data;
}
