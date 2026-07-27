'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  uploadFile,
} from '@/services/clinicAdminService';
import { showError, showSuccess } from '@/utils/toast';

const formatImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `http://localhost:5000${cleanPath}`;
};

const defaultFilters = {
  search: '',
  page: 1,
  limit: 10,
};

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
  });

  const loadGalleryData = async (filters = activeFilters) => {
    try {
      setLoading(true);
      const res = await getGalleryImages(filters);
      const list = res?.data || (Array.isArray(res) ? res : []);
      setGallery(list);
      setPagination({
        count: res?.count || list.length,
        currentPage: res?.currentPage || Number(filters.page) || 1,
        totalPages: res?.totalPages || 1,
        limit: Number(filters.limit) || 10,
      });
    } catch (err) {
      showError(err, 'Failed to load clinic gallery data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadGalleryData(defaultFilters);
    });
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      page: 1,
      limit: activeFilters.limit,
    };
    setActiveFilters(filters);
    loadGalleryData(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setActiveFilters(defaultFilters);
    loadGalleryData(defaultFilters);
  };

  const handleLimitChange = (limit) => {
    const filters = { ...activeFilters, page: 1, limit: Number(limit) };
    setActiveFilters(filters);
    loadGalleryData(filters);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const filters = { ...activeFilters, page: newPage };
    setActiveFilters(filters);
    loadGalleryData(filters);
  };

  const openUploadModal = () => {
    setEditingImage(null);
    setFormData({ title: '', image_url: '' });
    setPhotoPreview('');
    setShowUploadModal(true);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    const imgUrl = img.photo || img.image_url || '';
    setFormData({
      title: img.title || '',
      image_url: imgUrl,
    });
    setPhotoPreview(imgUrl);
    setShowUploadModal(true);
  };

  const handleFileUpload = async (file) => {
    try {
      setSaving(true);
      const res = await uploadFile(file, 'gallery');
      const uploadedUrl = res?.data?.fullUrl || res?.data?.url || res?.url;
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
        setPhotoPreview(uploadedUrl);
        showSuccess('Image uploaded successfully.');
      } else {
        throw new Error('Upload response did not contain file URL');
      }
    } catch (err) {
      console.warn('File upload fallback to Base64 data URL:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const localUrl = reader.result;
        setFormData((prev) => ({ ...prev, image_url: localUrl }));
        setPhotoPreview(localUrl);
      };
      reader.readAsDataURL(file);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showError(null, 'Image title is required.');
      return;
    }
    if (!formData.image_url) {
      showError(null, 'Please choose an image file to upload.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: formData.title,
        image_url: formData.image_url,
        photo: formData.image_url,
      };

      if (editingImage) {
        const res = await updateGalleryImage(editingImage.id, payload);
        showSuccess(res?.message || 'Gallery image updated successfully.');
      } else {
        const res = await uploadGalleryImage(payload);
        showSuccess(res?.message || 'Gallery image uploaded successfully.');
      }
      setShowUploadModal(false);
      await loadGalleryData(activeFilters);
    } catch (err) {
      showError(err, 'Failed to save gallery image.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (id) => {
    const result = await Swal.fire({
      title: 'Delete gallery photo?',
      text: 'This photo will be permanently removed from clinic gallery.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete photo',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteGalleryImage(id);
      showSuccess(res?.message || 'Gallery photo deleted successfully.');
      await loadGalleryData(activeFilters);
    } catch (err) {
      showError(err, 'Failed to delete gallery photo.');
    }
  };

  return (
    <div className="cities-manager">
      {/* Header - 1:1 match with CitiesManager */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Clinic Gallery Directory</h1>
          <p className="admin-subtitle">Manage clinic infrastructure photos and gallery records.</p>
        </div>
        <button className="admin-add-btn" onClick={openUploadModal}>
          <span>+</span> Add Photo
        </button>
      </div>

      {/* Filter Bar - 1:1 match with CitiesManager */}
      <div className="admin-filter-bar">
        <input
          className="admin-search-input"
          placeholder="Search gallery photos by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={activeFilters.limit}
          onChange={(e) => handleLimitChange(e.target.value)}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
        <button className="admin-btn-apply" onClick={handleApplyFilter}>
          Apply Filter
        </button>
        <button className="admin-btn-reset" onClick={handleResetFilter}>
          Reset
        </button>
      </div>

      {/* Table Card - 1:1 match with CitiesManager */}
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading gallery photos...
                  </td>
                </tr>
              ) : gallery.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No gallery photos found.
                  </td>
                </tr>
              ) : (
                gallery.map((img) => {
                  const displayUrl = formatImageUrl(img.photo || img.image_url);

                  return (
                    <tr key={img.id}>
                      <td>
                        <div
                          onClick={() => setPreviewImage(img)}
                          style={{
                            width: 70,
                            height: 50,
                            borderRadius: 8,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Click to preview"
                        >
                          {displayUrl ? (
                            <img
                              src={displayUrl}
                              alt={img.title || 'Photo'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/120x80?text=Photo';
                              }}
                            />
                          ) : (
                            <span>🖼️</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{img.title}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button className="admin-action-btn-edit" onClick={() => openEditModal(img)}>
                            Edit
                          </button>
                          <button className="admin-action-btn-delete" onClick={() => handleDeleteImage(img.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer - 1:1 match with CitiesManager */}
        {!loading && pagination.totalPages > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 14, color: '#64748b' }}>
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.count} total photos)
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn-reset"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </button>
              <button
                className="admin-btn-apply"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal - 1:1 match with CitiesManager modal */}
      {showUploadModal && (
        <div className="admin-modal-backdrop" onClick={() => !saving && setShowUploadModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingImage ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
            </h3>

            <form onSubmit={handleSaveGallery}>
              <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div>
                  <label className="admin-form-label">Image Title *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    placeholder="e.g. Reception Waiting Area"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-form-label">Upload Image *</label>
                  {photoPreview && (
                    <div style={{ marginBottom: 12, textAlign: 'center' }}>
                      <img
                        src={formatImageUrl(photoPreview)}
                        alt="Preview"
                        style={{ height: 140, maxWidth: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid #cbd5e1' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/300x180?text=Preview';
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </div>
              </div>

              <div className="admin-form-actions" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="admin-btn-reset"
                  onClick={() => setShowUploadModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingImage ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="admin-modal-backdrop" onClick={() => setPreviewImage(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 800, padding: 0, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={formatImageUrl(previewImage.photo || previewImage.image_url)}
              alt={previewImage.title}
              style={{ width: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain', display: 'block', background: '#0f172a' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/800x500?text=Photo+Preview';
              }}
            />
            <div style={{ padding: 16, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: 16 }}>{previewImage.title}</h3>
              <button className="admin-btn-reset" onClick={() => setPreviewImage(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
