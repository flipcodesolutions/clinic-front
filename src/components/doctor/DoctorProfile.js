'use client';
import { useState, useEffect, useCallback } from 'react';
import { getDoctorProfile, updateDoctorProfile, uploadDoctorPhoto } from '@/services/doctor/profileService';
import { showError, showSuccess } from '@/utils/toast';
import { API_BASE_URL } from '@/config/api';

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Exactly 16 fields
  const [form, setForm] = useState({
    profile_photo: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    registration_no: '',
    qualification: '',
    specialization: '',
    experience_years: '0',
    consultation_fee: '0',
    languages: '',
    gender: 'male',
    dob: '',
    bio: '',
    department: '',
    clinic_name: '',
  });

  const getFullImageUrl = (url) => {
    if (!url) return '';
    const cleanUrl = String(url).trim();
    if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    const backendHost = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : '';
    const cleanPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    return `${backendHost}${cleanPath}`;
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDoctorProfile();
      if (res?.success && res?.data) {
        const data = res.data;
        const user = data.user || {};
        const clinic = (user.clinics && user.clinics[0]) || data.clinic || {};
        const dept = (data.departments && data.departments[0]) || {};

        setForm({
          profile_photo: user.profile_image || data.profile_image || data.profile_photo || '',
          first_name: user.first_name || data.first_name || '',
          last_name: user.last_name || data.last_name || '',
          email: user.email || data.email || '',
          mobile: user.phone || user.mobile || data.mobile || '',
          registration_no: data.registration_no || '',
          qualification: data.qualification || '',
          specialization: data.specialization || '',
          experience_years: data.experience_years !== undefined ? String(data.experience_years) : '0',
          consultation_fee: data.consultation_fee !== undefined ? String(data.consultation_fee) : '0',
          languages: data.languages ? (Array.isArray(data.languages) ? data.languages.join(', ') : data.languages) : '',
          gender: data.gender || 'male',
          dob: data.dob ? data.dob.split('T')[0] : '',
          bio: data.bio || '',
          department: data.department || dept.name || '',
          clinic_name: clinic.name || data.clinic_name || '',
        });
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      showError(error, 'Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    setImgError(false);
  }, [form.profile_photo]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setImgError(false);
      const uploadRes = await uploadDoctorPhoto(file);
      const uploadedUrl =
        uploadRes?.data?.fullUrl ||
        uploadRes?.data?.url ||
        uploadRes?.fileUrl ||
        uploadRes?.url;

      if (uploadedUrl) {
        const fullPath = getFullImageUrl(uploadedUrl);
        const updatedForm = { ...form, profile_photo: fullPath };
        setForm(updatedForm);
        try {
          await updateDoctorProfile(updatedForm);
        } catch (err) {
          console.error('Auto save profile error:', err);
        }
        showSuccess('Photo uploaded successfully');
      } else {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUri = reader.result;
          const updatedForm = { ...form, profile_photo: dataUri };
          setForm(updatedForm);
          try {
            await updateDoctorProfile(updatedForm);
          } catch (err) {
            console.error('Auto save profile error:', err);
          }
          showSuccess('Photo uploaded successfully');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Failed to upload doctor photo:', error);
      showError(error, 'Failed to upload doctor photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await updateDoctorProfile(form);
      if (res?.success) {
        showSuccess(res.message || 'Profile updated successfully');
      } else {
        showSuccess('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      showError(error, 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-table-card admin-empty-state">
        <p>Loading Profile...</p>
      </div>
    );
  }

  const doctorFullName = `Dr. ${form.first_name || ''} ${form.last_name || ''}`.trim();
  const hasPhoto = Boolean(form.profile_photo) && !imgError;

  return (
    <div className="doc-profile">
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Doctor Profile</h1>
          <p className="admin-subtitle">View and manage your profile details</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="doc-profile-card">
          {/* Profile Photo & Header Banner */}
          <div className="doc-profile-header-banner">
            <div className="doc-photo-upload-wrap">
              {hasPhoto ? (
                <img
                  src={getFullImageUrl(form.profile_photo)}
                  alt="Doctor"
                  className="doc-photo-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="doc-photo-placeholder">
                  {form.first_name ? form.first_name[0].toUpperCase() : 'D'}
                </div>
              )}
              <label htmlFor="doctorPhotoInput" className="doc-photo-overlay">
                {uploading ? '...' : 'Upload'}
              </label>
              <input
                id="doctorPhotoInput"
                type="file"
                accept="image/*"
                className="doc-photo-input"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </div>

            <div className="doc-profile-info-wrap">
              <h2 className="doc-profile-name">{doctorFullName || 'Doctor Profile'}</h2>
              <p className="doc-profile-spec">
                {form.specialization} {form.qualification ? `• ${form.qualification}` : ''}
              </p>
            </div>
          </div>

          {/* Simple Form Grid - 16 Fields */}
          <div className="admin-form-grid">
            {/* 1. First Name */}
            <div>
              <label className="admin-form-label">First Name</label>
              <input
                type="text"
                className="admin-input"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                placeholder="First Name"
                required
              />
            </div>

            {/* 2. Last Name */}
            <div>
              <label className="admin-form-label">Last Name</label>
              <input
                type="text"
                className="admin-input"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                placeholder="Last Name"
                required
              />
            </div>

            {/* 3. Email */}
            <div>
              <label className="admin-form-label">Email Address</label>
              <input
                type="email"
                className="admin-input admin-input-disabled"
                value={form.email}
                disabled
              />
            </div>

            {/* 4. Mobile */}
            <div>
              <label className="admin-form-label">Mobile Number</label>
              <input
                type="text"
                className="admin-input admin-input-disabled"
                value={form.mobile}
                disabled
              />
            </div>

            {/* 5. Registration No */}
            <div>
              <label className="admin-form-label">Registration No</label>
              <input
                type="text"
                className="admin-input admin-input-disabled"
                value={form.registration_no}
                disabled
              />
            </div>

            {/* 6. Qualification */}
            <div>
              <label className="admin-form-label">Qualification</label>
              <input
                type="text"
                className="admin-input admin-input-disabled"
                value={form.qualification}
                disabled
              />
            </div>

            {/* 7. Specialization */}
            <div>
              <label className="admin-form-label">Specialization</label>
              <input
                type="text"
                className="admin-input admin-input-disabled"
                value={form.specialization}
                disabled
              />
            </div>

            {/* 8. Experience Years */}
            <div>
              <label className="admin-form-label">Experience (Years)</label>
              <input
                type="text"
                className="admin-input admin-input-disabled"
                value={form.experience_years}
                disabled
              />
            </div>

            {/* 9. Consultation Fee */}
            <div>
              <label className="admin-form-label">Consultation Fee (₹)</label>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={form.consultation_fee}
                onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
                placeholder="Consultation Fee"
              />
            </div>

            {/* 10. Languages */}
            <div>
              <label className="admin-form-label">Languages</label>
              <input
                type="text"
                className="admin-input"
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
                placeholder="Languages"
              />
            </div>

            {/* 11. Gender */}
            <div>
              <label className="admin-form-label">Gender</label>
              <select
                className="admin-select"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* 12. DOB */}
            <div>
              <label className="admin-form-label">Date of Birth</label>
              <input
                type="date"
                className="admin-input"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>

            {/* 13. Department */}
            <div>
              <label className="admin-form-label">Department</label>
              <input
                type="text"
                className="admin-input admin-input-disabled"
                value={form.department}
                disabled
              />
            </div>

            {/* 14. Clinic Name */}
            <div>
              <label className="admin-form-label">Clinic Name</label>
              <input
                type="text"
                className="admin-input admin-input-disabled"
                value={form.clinic_name}
                disabled
              />
            </div>

            {/* 15. Bio */}
            <div className="admin-form-full">
              <label className="admin-form-label">Bio</label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Write a brief summary..."
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
