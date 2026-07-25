'use client';
import { useEffect, useState } from 'react';
import {
  getGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '@/services/clinicAdminService';

export default function GalleryManager() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Reception',
    image_url: '',
    caption: '',
  });

  const loadGalleryData = async () => {
    setLoading(true);
    const res = await getGalleryImages(selectedCategory);
    const list = Array.isArray(res) ? res : (res?.data || []);
    setGallery(list);
    setLoading(false);
  };

  useEffect(() => {
    loadGalleryData();
  }, []);

  const categories = ['All', 'Reception', 'Operation Theater', 'Ward', 'Exterior', 'General'];

  const openUploadModal = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      category: 'Reception',
      image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
      caption: '',
    });
    setShowUploadModal(true);
  };

  const openEditModal = (img) => {
    setEditingImage(img);
    setFormData({
      title: img.title || '',
      category: img.category || 'General',
      image_url: img.image_url || '',
      caption: img.caption || '',
    });
    setShowUploadModal(true);
  };

  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      if (editingImage) {
        await updateGalleryImage(editingImage.id, formData);
      } else {
        await uploadGalleryImage(formData);
      }
      setShowUploadModal(false);
      loadGalleryData();
    } catch (err) {
      alert(err.message || 'Failed to save gallery image');
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image from clinic gallery?')) {
      try {
        await deleteGalleryImage(id);
        loadGalleryData();
      } catch (err) {
        alert(err.message || 'Failed to delete gallery image');
      }
    }
  };

  const filteredGallery = gallery.filter((img) => {
    if (selectedCategory === 'All') return true;
    return img.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="clinic-gallery-manager">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Clinic Gallery Management</h1>
          <p className="clinic-subtitle">Upload clinic facility photos, update titles & showcase clinic infrastructure.</p>
        </div>
        <button onClick={openUploadModal} className="clinic-btn clinic-btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Upload New Image
        </button>
      </div>

      {/* Category Tabs */}
      <div className="clinic-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`clinic-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          Loading clinic gallery images...
        </div>
      ) : filteredGallery.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b', background: '#fff', borderRadius: 16 }}>
          No gallery images uploaded in this category yet.
        </div>
      ) : (
        <div className="clinic-gallery-grid">
          {filteredGallery.map((img) => (
            <div key={img.id} className="clinic-gallery-card">
              <img
                src={img.image_url}
                alt={img.title}
                className="clinic-gallery-img"
                onClick={() => setPreviewImage(img)}
                style={{ cursor: 'pointer' }}
              />
              <div className="clinic-gallery-info">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="clinic-gallery-tag">{img.category}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => openEditModal(img)}
                      className="clinic-btn clinic-btn-secondary clinic-btn-sm"
                      style={{ padding: '2px 6px', fontSize: 11 }}
                      title="Edit Details"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="clinic-btn clinic-btn-danger clinic-btn-sm"
                      style={{ padding: '2px 6px', fontSize: 11 }}
                      title="Delete Image"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <h4 className="clinic-gallery-title">{img.title}</h4>
                {img.caption && (
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{img.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload / Edit Image Modal */}
      {showUploadModal && (
        <div className="clinic-modal-overlay">
          <div className="clinic-modal">
            <div className="clinic-modal-header">
              <h3 className="clinic-modal-title">
                {editingImage ? 'Update Gallery Image' : 'Upload Image to Gallery'}
              </h3>
              <button className="clinic-modal-close" onClick={() => setShowUploadModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveGallery}>
              <div className="clinic-modal-body">
                <div className="clinic-form-group">
                  <label>Image Title *</label>
                  <input
                    type="text"
                    className="clinic-form-control"
                    required
                    placeholder="e.g. Operation Theater Room 1"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="clinic-form-group">
                  <label>Category</label>
                  <select
                    className="clinic-form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Reception">Reception</option>
                    <option value="Operation Theater">Operation Theater</option>
                    <option value="Ward">Ward</option>
                    <option value="Exterior">Exterior</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="clinic-form-group">
                  <label>Image URL *</label>
                  <input
                    type="text"
                    className="clinic-form-control"
                    required
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div className="clinic-form-group">
                  <label>Caption / Short Description</label>
                  <textarea
                    className="clinic-form-control"
                    rows="3"
                    placeholder="Brief description of the facility photo..."
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  />
                </div>
              </div>
              <div className="clinic-modal-footer">
                <button
                  type="button"
                  className="clinic-btn clinic-btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="clinic-btn clinic-btn-primary">
                  Save Gallery Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div className="clinic-modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="clinic-modal" style={{ maxWidth: 800, padding: 0 }} onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage.image_url}
              alt={previewImage.title}
              style={{ width: '100%', height: 'auto', maxHeight: '75vh', objectFit: 'contain', display: 'block' }}
            />
            <div style={{ padding: 20, background: '#fff' }}>
              <span className="clinic-gallery-tag">{previewImage.category}</span>
              <h3 style={{ margin: '8px 0 4px 0' }}>{previewImage.title}</h3>
              <p style={{ margin: 0, color: '#64748b' }}>{previewImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
