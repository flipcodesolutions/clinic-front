import apiClient from './apiClient';

/**
 * Fetch doctors for visitor search & dropdown
 */
export async function getVisitorDoctors(params = {}) {
  const response = await apiClient.get('/patient/doctors', { params });
  return response.data;
}

/**
 * Fetch doctor profile for visitor view
 */
export async function getVisitorDoctorProfile(id) {
  const response = await apiClient.get(`/patient/doctors/${id}`);
  return response.data;
}

/**
 * Book appointment for visitor
 */
export async function bookVisitorAppointment(data) {
  const response = await apiClient.post('/patient/appointments', data);
  return response.data;
}

// Aliases for backwards compatibility during migration
export const getPatientDoctors = getVisitorDoctors;
export const getPatientDoctorProfile = getVisitorDoctorProfile;
export const bookPatientAppointment = bookVisitorAppointment;
