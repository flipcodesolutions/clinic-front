import apiClient from './apiClient';

/**
 * Fetch patient's appointments list
 */
export async function getPatientAppointments(params = {}) {
  const response = await apiClient.get('/patient/appointments', { params });
  return response.data;
}

/**
 * Cancel patient appointment
 */
export async function cancelPatientAppointment(id, remarks = '') {
  const response = await apiClient.put(`/patient/appointments/${id}/cancel`, { remarks });
  return response.data;
}

/**
 * Fetch patient profile details
 */
export async function getPatientProfile() {
  const response = await apiClient.get('/patient/profile');
  return response.data;
}

/**
 * Update patient profile details
 */
export async function updatePatientProfile(data) {
  const response = await apiClient.put('/patient/profile', data);
  return response.data;
}

/**
 * Fetch patient uploaded documents / prescriptions
 */
export async function getPatientDocuments(params = {}) {
  const response = await apiClient.get('/patient/documents', { params });
  return response.data;
}

/**
 * Upload a patient document
 */
export async function createPatientDocument(data) {
  const response = await apiClient.post('/patient/documents', data);
  return response.data;
}

/**
 * Fetch patient invoices / bills
 */
export async function getPatientInvoices(params = {}) {
  const response = await apiClient.get('/patient/invoices', { params });
  return response.data;
}
