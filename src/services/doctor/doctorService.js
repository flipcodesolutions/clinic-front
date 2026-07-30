import apiClient from '../apiClient';

/**
 * Fetch Doctor Profile with User Details
 */
export async function getDoctorProfile() {
  const response = await apiClient.get('/doctor/profile');
  return response.data;
}

/**
 * Update Doctor Profile (DoctorProfile fields + User fields)
 */
export async function updateDoctorProfile(profileData) {
  const response = await apiClient.put('/doctor/profile', profileData);
  return response.data;
}

/**
 * Upload Photo for Doctor Profile
 */
export async function uploadDoctorPhoto(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload/doctors', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * List Doctor Appointments
 */
export async function getDoctorAppointments(params = {}) {
  const response = await apiClient.get('/doctor/appointments', { params });
  return response.data;
}

/**
 * Update Appointment Status
 */
export async function updateAppointmentStatus(appointmentId, status, remarks = '') {
  const response = await apiClient.put(`/doctor/appointments/${appointmentId}/status`, {
    status,
    remarks,
  });
  return response.data;
}

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
