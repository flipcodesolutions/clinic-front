import apiClient from '../apiClient';

/**
 * List Doctor Patients
 */
export async function getDoctorPatients(params = {}) {
  const response = await apiClient.get('/doctor/patients', { params });
  return response.data;
}

/**
 * Get Specific Patient Detail & History
 */
export async function getDoctorPatientDetails(patientId) {
  const response = await apiClient.get(`/doctor/patients/${patientId}`);
  return response.data;
}
