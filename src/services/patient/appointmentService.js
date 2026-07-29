import apiClient from '../apiClient';

/**
 * Fetch list of appointments for logged-in patient
 */
export async function getPatientAppointments() {
  const response = await apiClient.get('/patient/appointments');
  return response.data;
}

/**
 * Book appointment
 */
export async function bookPatientAppointment(data) {
  const response = await apiClient.post('/patient/appointments', data);
  return response.data;
}

/**
 * Cancel appointment
 */
export async function cancelPatientAppointment(id, remarks) {
  const response = await apiClient.put(`/patient/appointments/${id}/cancel`, { remarks });
  return response.data;
}
