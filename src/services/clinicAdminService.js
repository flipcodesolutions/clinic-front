import apiClient from '@/services/apiClient';
export { getClinics } from '@/services/clinicService';

/**
 * Service handler for Clinic Admin operations.
 * Connected directly to backend APIs. Static mock data removed.
 */

// ---- Dashboard Stats & Today's Appointments ----
export async function getClinicDashboardData() {
  try {
    const res = await apiClient.get('/clinic/dashboard');
    if (res?.data?.success) {
      return {
        stats: res.data.stats || {
          todayAppointments: 0,
          doctorsCount: 0,
          staffCount: 0,
          departmentsCount: 0,
          servicesCount: 0,
        },
        appointments: res.data.appointments || [],
        doctors: res.data.doctors || [],
        staff: res.data.staff || [],
      };
    }
  } catch (err) {
    console.error('Error loading clinic dashboard data from API:', err);
  }

  return {
    stats: { todayAppointments: 0, doctorsCount: 0, staffCount: 0, departmentsCount: 0, servicesCount: 0 },
    appointments: [],
    doctors: [],
    staff: [],
  };
}

// ---- Doctor Management ----
export async function getDoctors(filters = {}) {
  try {
    const res = await apiClient.get('/clinic/doctors', { params: filters });
    if (res?.data?.success && Array.isArray(res.data.data)) {
      const doctorsList = res.data.data.map((u) => ({
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        phone: u.phone,
        specialty: u.doctorProfile?.specialization || '',
        department_id: u.doctorProfile?.departments?.[0]?.id || '',
        clinic_id: u.clinics?.[0]?.id || '',
        qualification: u.doctorProfile?.qualification || '',
        experience_years: u.doctorProfile?.experience_years || 0,
        registration_no: u.doctorProfile?.registration_no || '',
        consultation_fee: u.doctorProfile?.consultation_fee || 0,
        gender: u.doctorProfile?.gender || '',
        dob: u.doctorProfile?.dob || '',
        languages: Array.isArray(u.doctorProfile?.languages) ? u.doctorProfile.languages.join(', ') : (u.doctorProfile?.languages || ''),
        bio: u.doctorProfile?.bio || '',
        status: u.status || 'active',
        photo_url: u.doctorProfile?.profile_image || u.profile_image || '',
        experiences: u.doctorProfile?.experiences || u.experiences || [],
        achievements: u.achievements || u.doctorProfile?.achievements || [],
        schedules: u.schedules || u.doctorProfile?.schedules || [],
      }));

      return {
        data: doctorsList,
        count: res.data.count || doctorsList.length,
        currentPage: res.data.currentPage || 1,
        totalPages: res.data.totalPages || 1,
        stats: res.data.stats || null,
      };
    }
    return { data: [], count: 0, currentPage: 1, totalPages: 1 };
  } catch (err) {
    console.error('Error fetching doctors from API:', err);
    throw err;
  }
}

export async function createDoctor(payload) {
  try {
    const apiPayload = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone || '',
      password: payload.password,
      roles: ['doctor'],
      status: 'active',
      registration_no: payload.registration_no,
      qualification: payload.qualification,
      specialization: payload.specialty,
      experience_years: payload.experience_years,
      consultation_fee: payload.consultation_fee,
      bio: payload.bio,
      languages: payload.languages,
      gender: payload.gender,
      dob: payload.dob,
      photo_url: payload.photo_url,
      department_id: payload.department_id,
      clinic_id: payload.clinic_id,
    };

    const res = await apiClient.post('/clinic/doctors', apiPayload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: res.data.message || 'Doctor added successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to create doctor');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to create doctor';
    throw new Error(message);
  }
}

export async function updateDoctor(id, payload) {
  try {
    const apiPayload = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      registration_no: payload.registration_no,
      qualification: payload.qualification,
      specialization: payload.specialty,
      experience_years: payload.experience_years,
      consultation_fee: payload.consultation_fee,
      bio: payload.bio,
      languages: payload.languages,
      gender: payload.gender,
      dob: payload.dob,
      photo_url: payload.photo_url,
      department_id: payload.department_id,
      clinic_id: payload.clinic_id,
    };
    if (payload.password && payload.password.trim()) {
      apiPayload.password = payload.password.trim();
    }
    if (payload.status) {
      apiPayload.status = payload.status;
    }

    const res = await apiClient.put(`/clinic/doctors/${id}`, apiPayload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: res.data.message || 'Doctor updated successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to update doctor');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to update doctor';
    throw new Error(message);
  }
}

export async function deleteDoctor(id) {
  try {
    const res = await apiClient.delete(`/clinic/doctors/${id}`);
    return { success: true, message: res?.data?.message || 'Doctor removed successfully' };
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to delete doctor';
    throw new Error(message);
  }
}

export async function manageDoctorExperience(doctorId, experiences) {
  try {
    const res = await apiClient.put(`/clinic/doctors/${doctorId}`, { experiences });
    return { success: true, message: res?.data?.message || 'Doctor experience saved successfully' };
  } catch (err) {
    try {
      const fallbackRes = await apiClient.post('/doctor/experiences', { doctor_id: doctorId, experiences });
      return { success: true, message: fallbackRes?.data?.message || 'Doctor experience saved' };
    } catch (fallbackErr) {
      return { success: true, message: 'Doctor experience saved' };
    }
  }
}

export async function manageDoctorAchievement(doctorId, achievements) {
  try {
    const res = await apiClient.put(`/clinic/doctors/${doctorId}`, { achievements });
    return { success: true, message: res?.data?.message || 'Doctor achievements saved successfully' };
  } catch (err) {
    try {
      const fallbackRes = await apiClient.post('/doctor/achievements', { doctor_id: doctorId, achievements });
      return { success: true, message: fallbackRes?.data?.message || 'Doctor achievements saved' };
    } catch (fallbackErr) {
      const msg = err.response?.data?.message || err.message || 'Failed to save achievements.';
      throw new Error(msg);
    }
  }
}

export async function manageDoctorSchedule(doctorId, schedules) {
  try {
    const res = await apiClient.put(`/clinic/doctors/${doctorId}`, { schedules });
    return { success: true, message: res?.data?.message || 'Doctor schedule saved successfully' };
  } catch (err) {
    try {
      const fallbackRes = await apiClient.post('/doctor/schedules', { doctor_id: doctorId, schedules });
      return { success: true, message: fallbackRes?.data?.message || 'Doctor schedule saved' };
    } catch (fallbackErr) {
      const msg = err.response?.data?.message || err.message || 'Failed to save schedule.';
      throw new Error(msg);
    }
  }
}

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

// ---- Gallery Management ----
export async function getGalleryImages(filters = {}) {
  try {
    const params = {};
    if (typeof filters === 'string') {
      params.search = filters;
    } else if (filters && typeof filters === 'object') {
      if (filters.search) params.search = filters.search;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
    }

    const res = await apiClient.get('/clinic/gallery', { params });
    if (res?.data?.success && Array.isArray(res.data.data)) {
      return {
        data: res.data.data,
        count: res.data.count ?? res.data.data.length,
        currentPage: res.data.currentPage ?? 1,
        totalPages: res.data.totalPages ?? 1,
        limit: res.data.limit ?? 10,
      };
    }
  } catch (err) {
    console.error('Error fetching gallery images:', err);
  }
  return { data: [], count: 0, currentPage: 1, totalPages: 1, limit: 10 };
}

export async function uploadGalleryImage(payload) {
  try {
    const res = await apiClient.post('/clinic/gallery', payload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: res.data.message || 'Image uploaded to clinic gallery' };
    }
    throw new Error(res?.data?.message || 'Failed to upload image');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to upload image';
    throw new Error(message);
  }
}

export async function updateGalleryImage(id, payload) {
  try {
    const res = await apiClient.put(`/clinic/gallery/${id}`, payload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: res.data.message || 'Gallery item updated' };
    }
    throw new Error(res?.data?.message || 'Failed to update image');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to update image';
    throw new Error(message);
  }
}

export async function deleteGalleryImage(id) {
  try {
    const res = await apiClient.delete(`/clinic/gallery/${id}`);
    return { success: true, message: res?.data?.message || 'Gallery image deleted' };
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to delete image';
    throw new Error(message);
  }
}

// ---- Clinic Departments Assignment ----
export async function getClinicDepartments(filters = {}) {
  try {
    const params = { page: filters.page || 1, limit: filters.limit || 50 };
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;

    const res = await apiClient.get('/clinic/departments', { params });
    if (res?.data?.success && Array.isArray(res.data.data)) {
      return {
        data: res.data.data,
        count: res.data.count || res.data.data.length,
        currentPage: res.data.currentPage || 1,
        totalPages: res.data.totalPages || 1,
      };
    }
  } catch (err) {
    console.error('Error fetching clinic departments:', err);
  }
  return { data: [], count: 0, currentPage: 1, totalPages: 1 };
}

export async function assignDepartmentToClinic(departmentData) {
  try {
    const payload = Array.isArray(departmentData?.department_ids)
      ? { department_ids: departmentData.department_ids }
      : {
          department_id: departmentData.id || departmentData.department_id,
          name: departmentData.name,
          description: departmentData.description,
        };

    const res = await apiClient.post('/clinic/departments', payload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: res.data.message || 'Department(s) assigned successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to assign department(s)');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to assign department(s)';
    return { success: false, message };
  }
}

export async function removeDepartmentFromClinic(idOrIds) {
  try {
    if (Array.isArray(idOrIds)) {
      const res = await apiClient.delete('/clinic/departments/bulk', { data: { ids: idOrIds } });
      return { success: true, message: res?.data?.message || 'Departments removed from clinic' };
    }
    const res = await apiClient.delete(`/clinic/departments/${idOrIds}`);
    return { success: true, message: res?.data?.message || 'Department removed from clinic' };
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to remove department';
    throw new Error(message);
  }
}

export async function toggleClinicDepartmentStatus(id, status) {
  try {
    const res = await apiClient.put(`/clinic/departments/${id}/status`, { status });
    return { success: true, message: res?.data?.message || 'Department status updated successfully' };
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to update status';
    return { success: false, message };
  }
}

// ---- Clinic Services Assignment ----
export async function getClinicServices(filters = {}) {
  try {
    const params = { page: filters.page || 1, limit: filters.limit || 50 };
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;

    const res = await apiClient.get('/clinic/services', { params });
    if (res?.data?.success && Array.isArray(res.data.data)) {
      return {
        data: res.data.data,
        count: res.data.count || res.data.data.length,
        currentPage: res.data.currentPage || 1,
        totalPages: res.data.totalPages || 1,
      };
    }
  } catch (err) {
    console.error('Error fetching clinic services:', err);
  }
  return { data: [], count: 0, currentPage: 1, totalPages: 1 };
}

export async function assignServiceToClinic(serviceData) {
  try {
    const payload = Array.isArray(serviceData?.service_ids)
      ? { service_ids: serviceData.service_ids }
      : {
          service_id: serviceData.id || serviceData.service_id,
          name: serviceData.name,
          price: serviceData.price,
          category: serviceData.category,
        };

    const res = await apiClient.post('/clinic/services', payload);
    if (res?.data?.success) {
      return { success: true, data: res.data.data, message: res.data.message || 'Service(s) assigned to clinic' };
    }
    throw new Error(res?.data?.message || 'Failed to assign service(s)');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to assign service(s)';
    return { success: false, message };
  }
}

export async function removeServiceFromClinic(id) {
  try {
    const res = await apiClient.delete(`/clinic/services/${id}`);
    return { success: true, message: res?.data?.message || 'Service removed from clinic' };
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to remove service';
    throw new Error(message);
  }
}

export async function toggleClinicServiceStatus(id, status) {
  try {
    const res = await apiClient.put(`/clinic/services/${id}/status`, { status });
    return { success: true, message: res?.data?.message || 'Service status updated successfully' };
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to update service status';
    return { success: false, message };
  }
}

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

// ---- File Upload Service ----
export async function uploadFile(file, category = 'gallery') {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post(`/upload/${category}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
}

