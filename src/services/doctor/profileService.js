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
 * Change Doctor Password
 */
export async function changeDoctorPassword(currentPassword, newPassword) {
  try {
    const res = await apiClient.put('/auth/change-password', { currentPassword, newPassword });
    if (res?.data?.success) {
      return { success: true, message: res.data.message || 'Password changed successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to update password');
  } catch (e) {
    const message = e.response?.data?.message || e.message || 'Failed to update password';
    return { success: false, message };
  }
}
