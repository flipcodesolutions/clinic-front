import apiClient from '@/services/apiClient';

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

export async function syncClinicServices(serviceIds) {
  try {
    let res;
    try {
      res = await apiClient.post('/clinic/services/sync', { service_ids: serviceIds });
    } catch (e) {
      if (e.response?.status === 404) {
        res = await apiClient.post('/clinic/services', { service_ids: serviceIds });
      } else {
        throw e;
      }
    }
    if (res?.data?.success) {
      return { success: true, message: res.data.message || 'Services saved successfully' };
    }
    throw new Error(res?.data?.message || 'Failed to save services');
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to save services';
    return { success: false, message };
  }
}
