import apiClient from '@/services/apiClient';

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

export async function syncClinicDepartments(departmentIds) {
  try {
    let res;
    try {
      res = await apiClient.post('/clinic/departments/sync', { department_ids: departmentIds });
    } catch (e) {
      if (e.response?.status === 404) {
        res = await apiClient.post('/clinic/departments', { department_ids: departmentIds });
      } else {
        throw e;
      }
    }
    if (res?.data?.success) {
      return { success: true, message: res.data.message || 'Departments saved successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to save departments');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to save departments';
    return { success: false, message };
  }
}
