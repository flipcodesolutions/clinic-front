import apiClient from '@/services/apiClient';

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
