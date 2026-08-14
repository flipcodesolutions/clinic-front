import apiClient from '../apiClient';
import { getDoctorSchedules } from './scheduleService';


  // List Doctor Appointments
 
export async function getDoctorAppointments(params = {}) {
  const response = await apiClient.get('/doctor/appointments', { params });
  return response.data;
}


// Update Appointment Status
 
export async function updateAppointmentStatus(appointmentId, statusOrData, optionalRemarks = '') {
  let status = statusOrData;
  let remarks = optionalRemarks;

  if (typeof statusOrData === 'object' && statusOrData !== null) {
    status = statusOrData.status;
    remarks = statusOrData.remarks || '';
  }

  const response = await apiClient.put(`/doctor/appointments/${appointmentId}/status`, {
    status,
    remarks,
  });
  return response.data;
}


//  Create Consultation / Medical Record

export async function createConsultationRecord(appointmentId, payload) {
  const response = await apiClient.post('/doctor/medical-records', {
    appointment_id: appointmentId,
    patient_id: payload?.patient_id,
    ...payload,
  });
  return response.data;
}


  // Re-export getDoctorSchedules
 
export { getDoctorSchedules };
