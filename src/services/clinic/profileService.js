import apiClient from '@/services/apiClient';

// ---- About Clinic Profile ----
export async function getClinicProfile() {
  try {
    let res;
    try {
      res = await apiClient.get('/clinic/profile');
    } catch (e) {
      res = await apiClient.get('/admin/clinics/profile/current');
    }
    if (res?.data?.success) {
      const c = res.data.data;
      return {
        clinicName: c.name || '',
        tagline: '',
        description: c.description || '',
        established: '',
        city: c.city || '',
        state: c.state || '',
        address: c.address || '',
        phone: c.phone || '',
        email: c.email || '',
        website: c.website || '',
        timings: '',
      };
    }
  } catch (err) {
    console.error('Error fetching clinic profile:', err);
  }
  return null;
}

export async function updateClinicProfile(payload) {
  try {
    const apiPayload = {
      name: payload.clinicName,
      description: payload.description,
      city: payload.city,
      state: payload.state,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
      website: payload.website,
    };

    let res;
    try {
      res = await apiClient.put('/clinic/profile', apiPayload);
    } catch (e) {
      res = await apiClient.put('/admin/clinics/profile/current', apiPayload);
    }
    if (res?.data?.success) {
      return { success: true, message: res.data.message || 'Clinic profile updated successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to update clinic profile');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to update clinic profile';
    throw new Error(message);
  }
}

// ---- Change Password ----
export async function changeClinicPassword(currentPassword, newPassword) {
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
