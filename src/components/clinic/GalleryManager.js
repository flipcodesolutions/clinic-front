'use client';
import { useState } from 'react';

const sampleImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400', caption: 'Reception Area' },
  { id: 2, url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=400', caption: 'Consultation Room' },
  { id: 3, url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400', caption: 'Lab' },
  { id: 4, url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400', caption: 'Waiting Lounge' },
];

export default function GalleryManager() {
  const [images, setImages] = useState(sampleImages);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!preview) return;
    setImages([...images, { id: Date.now(), url: preview, caption: caption || 'New Photo' }]);
    setPreview(null);
    setCaption('');
  };

  const handleDelete = (id) => setImages(images.filter(img => img.id !== id));

  return (
    <div className="gallery-manager">
      {/* Header */}
      <div className="gallery-header">
        <h1 className="gallery-title">Gallery</h1>
        <p className="gallery-subtitle">{images.length} photos uploaded</p>
      </div>

      {/* Upload Card */}
      <div className="gallery-upload-card">
        <h3 className="gallery-upload-title">Upload New Photo</h3>
        <div className="gallery-upload-body">
          <label className="gallery-dropzone">
            {preview
              ? <img src={preview} alt="preview" className="gallery-dropzone-preview" />
              : <>
                  <span className="gallery-dropzone-icon">📷</span>
                  <span className="gallery-dropzone-text">Click to upload</span>
                </>
            }
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>

          <div className="gallery-upload-fields">
            <label className="gallery-caption-label">Caption</label>
            <input
              className="gallery-caption-input"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Enter photo caption..."
            />
            <button
              className="gallery-upload-btn"
              onClick={handleUpload}
              disabled={!preview}
            >
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Table Card */}
      <div className="clinic-table-card">
        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Image Preview</th>
                <th>Caption / Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map(img => (
                <tr key={img.id}>
                  <td>
                    <div style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', position: 'relative' }}>
                      <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td className="fw-semibold text-dark" style={{ verticalAlign: 'middle' }}>
                    {img.caption}
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <button 
                      className="staff-delete-btn btn btn-sm py-1 px-3" 
                      onClick={() => handleDelete(img.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
