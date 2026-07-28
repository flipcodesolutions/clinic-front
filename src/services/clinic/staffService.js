import apiClient from '@/services/apiClient';

// ---- Staff Management ----
export async function getStaffList(filters = {}) {
  try {
    const params = { limit: filters.limit || 10, page: filters.page || 1 };
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;

    const res = await apiClient.get('/clinic/staff', { params });
    if (res?.data?.success && Array.isArray(res.data.data)) {
      const formatted = res.data.data.map((st) => ({
        id: st.id,
        first_name: st.first_name,
        last_name: st.last_name || '',
        email: st.email,
        phone: st.phone || '',
        photo_url: st.profile_image || st.photo_url || '',
        role: Array.isArray(st.roles) ? st.roles[0] : (st.roles || 'staff'),
        designation: st.designation || st.staffProfile?.designation || 'Staff Member',
        qualification: st.qualification || st.staffProfile?.qualification || '',
        joining_date: st.joining_date || st.staffProfile?.joining_date || '',
        clinic_id: st.clinics?.[0]?.id || '',
        clinic_name: st.clinics?.[0]?.name || '',
        status: st.status || 'active',
      }));

      return {
        data: formatted,
        count: res.data.count ?? formatted.length,
        currentPage: res.data.currentPage ?? 1,
        totalPages: res.data.totalPages ?? 1,
      };
    }
  } catch (err) {
    console.error('Error fetching staff list:', err);
  }
  return { data: [], count: 0, currentPage: 1, totalPages: 1 };
}

export async function createStaff(payload) {
  try {
    const apiPayload = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      photo_url: payload.photo_url || '',
      roles: ['staff'],
      status: 'active',
      designation: payload.designation,
      qualification: payload.qualification,
      joining_date: payload.joining_date,
      clinic_id: payload.clinic_id,
    };

    const res = await apiClient.post('/clinic/staff', apiPayload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: 'Staff member added successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to create staff');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to create staff';
    throw new Error(message);
  }
}

export async function updateStaff(id, payload) {
  try {
    const apiPayload = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      photo_url: payload.photo_url || '',
      roles: ['staff'],
      designation: payload.designation,
      qualification: payload.qualification,
      joining_date: payload.joining_date,
      clinic_id: payload.clinic_id,
    };
    if (payload.password && payload.password.trim()) {
      apiPayload.password = payload.password.trim();
    }
    if (payload.status) {
      apiPayload.status = payload.status;
    }

    const res = await apiClient.put(`/clinic/staff/${id}`, apiPayload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: 'Staff updated successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to update staff');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to update staff';
    throw new Error(message);
  }
}

export async function deleteStaff(id) {
  try {
    const res = await apiClient.delete(`/clinic/staff/${id}`);
    return { success: true, message: res?.data?.message || 'Staff member deleted' };
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to delete staff';
    throw new Error(message);
  }
}
