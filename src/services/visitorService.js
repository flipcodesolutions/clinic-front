import apiClient from './apiClient';

/**
 * Fetch active departments/specialties for visitor view
 */
export async function getVisitorDepartments(params = {}) {
  try {
    const response = await apiClient.get('/visitor/departments', { params });
    return response.data;
  } catch (error) {
    // Fallback if visitor route is unavailable
    const response = await apiClient.get('/admin/departments', { params });
    return response.data;
  }
}

/**
 * Fetch doctors for visitor search & dropdown
 */
export async function getVisitorDoctors(params = {}) {
  try {
    const response = await apiClient.get('/visitor/doctors', { params });
    return response.data;
  } catch (error) {
    const response = await apiClient.get('/patient/doctors', { params });
    return response.data;
  }
}

/**
 * Fetch doctor profile for visitor view
 */
export async function getVisitorDoctorProfile(id) {
  try {
    const response = await apiClient.get(`/visitor/doctors/${id}`);
    return response.data;
  } catch (error) {
    const response = await apiClient.get(`/patient/doctors/${id}`);
    return response.data;
  }
}

/**
 * Book appointment for visitor
 */
export async function bookVisitorAppointment(data) {
  const response = await apiClient.post('/patient/appointments', data);
  return response.data;
}

/**
 * Fetch distinct cities where clinics are available
 */
export async function getVisitorCities() {
  try {
    const response = await apiClient.get('/visitor/cities');
    if (response.data?.cities && Array.isArray(response.data.cities)) {
      return response.data.cities;
    }
  } catch (error) {
    console.warn("Could not fetch /visitor/cities, falling back:", error);
  }

  // Fallback: extract from getVisitorDoctors
  try {
    const docRes = await getVisitorDoctors();
    const docs = docRes.doctors || docRes.data || (Array.isArray(docRes) ? docRes : []);
    const citySet = new Set();
    docs.forEach((d) => {
      d.schedules?.forEach((s) => s.clinic?.city && citySet.add(s.clinic.city.trim()));
      d.user?.clinics?.forEach((c) => c.city && citySet.add(c.city.trim()));
    });
    return Array.from(citySet).sort();
  } catch {
    return [];
  }
}

// Aliases for backwards compatibility during migration
export const getVisitorSpecialties = getVisitorDepartments;
export const getPatientDoctors = getVisitorDoctors;
export const getPatientDoctorProfile = getVisitorDoctorProfile;
export const bookPatientAppointment = bookVisitorAppointment;
