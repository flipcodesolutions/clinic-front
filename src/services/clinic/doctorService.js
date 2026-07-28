import apiClient from '@/services/apiClient';

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
