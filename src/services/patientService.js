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
 * Fetch patient shortlist (saved doctors)
 */
export async function getPatientShortlist() {
  const response = await apiClient.get('/patient/shortlist');
  return response.data;
}

/**
 * Add a doctor to shortlist
 */
export async function addDoctorToShortlist(doctorId) {
  const response = await apiClient.post('/patient/shortlist', { doctor_id: doctorId });
  return response.data;
}

/**
 * Remove a doctor from shortlist
 */
export async function removeDoctorFromShortlist(doctorId) {
  const response = await apiClient.delete(`/patient/shortlist/${doctorId}`);
  return response.data;
}

/**
 * Fetch family members
 */
export async function getFamilyMembers() {
  const response = await apiClient.get('/patient/family');
  return response.data;
}

/**
 * Add a family member
 */
export async function addFamilyMember(data) {
  const response = await apiClient.post('/patient/family', data);
  return response.data;
}

/**
 * Update a family member
 */
export async function updateFamilyMember(id, data) {
  const response = await apiClient.put(`/patient/family/${id}`, data);
  return response.data;
}

/**
 * Delete a family member
 */
export async function deleteFamilyMember(id) {
  const response = await apiClient.delete(`/patient/family/${id}`);
  return response.data;
}

/**
 * Fetch prescriptions (doctor issued + patient uploaded)
 */
export async function getPatientPrescriptions() {
  const response = await apiClient.get('/patient/prescriptions');
  return response.data;
}

/**
 * Create / upload patient prescription
 */
export async function createPatientPrescription(data) {
  const response = await apiClient.post('/patient/prescriptions', data);
  return response.data;
}

/**
 * Delete patient prescription
 */
export async function deletePatientPrescription(id) {
  const response = await apiClient.delete(`/patient/prescriptions/${id}`);
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
 * Fetch patient lab reports specifically
 */
export async function getPatientLabReports() {
  const response = await apiClient.get('/patient/documents', {
    params: { document_type: 'lab_report' },
  });
  return response.data;
}

/**
 * Upload a patient document / lab report
 */
export async function createPatientDocument(data) {
  const response = await apiClient.post('/patient/documents', data);
  return response.data;
}

/**
 * Delete a patient document
 */
export async function deletePatientDocument(id) {
  const response = await apiClient.delete(`/patient/documents/${id}`);
  return response.data;
}

/**
 * Fetch patient invoices / bills
 */
export async function getPatientInvoices(params = {}) {
  const response = await apiClient.get('/patient/invoices', { params });
  return response.data;
}
