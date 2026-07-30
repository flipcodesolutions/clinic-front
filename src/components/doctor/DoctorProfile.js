'use client';
import { useState, useEffect } from 'react';
import { getDoctorProfile, updateDoctorProfile, uploadDoctorPhoto } from '@/services/doctor/doctorService';

const specialities = [
  'General Physician',
  'Dentist',
  'Cardiologist',
  'Dermatologist',
  'Orthopedic',
  'Gynecologist',
  'Pediatrician',
  'Neurologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Psychiatrist',
  'Urologist',
];

export default function DoctorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    registration_no: '',
    qualification: '',
    specialization: 'General Physician',
    experience_years: '0',
    consultation_fee: '0',
    bio: '',
    languages: 'English, Hindi',
    gender: 'male',
    dob: '',
    profile_photo: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getDoctorProfile();
      if (res?.success && res?.data) {
        const data = res.data;
        const user = data.user || {};

        setForm({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          mobile: user.mobile || '',
          registration_no: data.registration_no || '',
          qualification: data.qualification || '',
          specialization: data.specialization || 'General Physician',
          experience_years: data.experience_years || '0',
          consultation_fee: data.consultation_fee || '0',
          bio: data.bio || '',
          languages: data.languages || 'English, Hindi',
          gender: data.gender || 'male',
          dob: data.dob || '',
          profile_photo: user.profile_photo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadRes = await uploadDoctorPhoto(file);
      if (uploadRes?.success && uploadRes?.fileUrl) {
        setForm((prev) => ({ ...prev, profile_photo: uploadRes.fileUrl }));
        showToast('Photo uploaded successfully! Save profile to finalize.');
      } else if (uploadRes?.url) {
        setForm((prev) => ({ ...prev, profile_photo: uploadRes.url }));
        showToast('Photo uploaded successfully!');
      }
    } catch (error) {
      console.error('Failed to upload doctor photo:', error);
      showToast('Photo upload failed. Please try again.');
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
        showToast('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      showToast('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        <p>Loading Doctor Profile...</p>
      </div>
    );
  }

  const doctorFullName = `Dr. ${form.first_name || ''} ${form.last_name || ''}`.trim();

  return (
    <div className="doc-profile">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">My Profile</h1>
          <p className="admin-subtitle">Manage your personal details, qualifications, and consultation charges</p>
        </div>
      </div>

      {toastMessage && <div className="admin-toast-success">✓ {toastMessage}</div>}

      <form onSubmit={handleSave}>
        {/* Profile Card Banner */}
        <div className="doc-profile-card">
          <div className="doc-profile-header-banner">
            <div className="doc-photo-upload-wrap">
              {form.profile_photo ? (
                <img src={form.profile_photo} alt="Doctor" className="doc-photo-img" />
              ) : (
                <div className="doc-photo-placeholder">👨‍⚕️</div>
              )}
              <label htmlFor="doctorPhotoInput" className="doc-photo-overlay">
                {uploading ? 'Uploading...' : 'Change'}
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
                {form.specialization} • {form.qualification || 'MBBS'}
              </p>
              <div className="doc-profile-meta">
                <span>Registration No: {form.registration_no || 'N/A'}</span>
                <span>•</span>
                <span>Experience: {form.experience_years} Years</span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <h3 className="admin-form-section-title">👤 Personal Information</h3>
          <div className="admin-form-grid">
            <div>
              <label className="admin-form-label">First Name</label>
              <input
                className="admin-input"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <label className="admin-form-label">Last Name</label>
              <input
                className="admin-input"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                placeholder="Last Name"
                required
              />
            </div>
            <div>
              <label className="admin-form-label">Email Address (Login ID)</label>
              <input className="admin-input" value={form.email} disabled style={{ background: '#f8fafc', color: '#64748b' }} />
            </div>
            <div>
              <label className="admin-form-label">Mobile Number</label>
              <input
                className="admin-input"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="Mobile Number"
              />
            </div>
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
            <div>
              <label className="admin-form-label">Date of Birth</label>
              <input
                type="date"
                className="admin-input"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
          </div>

          {/* Professional Details */}
          <h3 className="admin-form-section-title" style={{ marginTop: 24 }}>
            🏥 Medical & Professional Details
          </h3>
          <div className="admin-form-grid">
            <div>
              <label className="admin-form-label">Medical Registration No.</label>
              <input
                className="admin-input"
                value={form.registration_no}
                onChange={(e) => setForm({ ...form, registration_no: e.target.value })}
                placeholder="e.g. MCI-123456"
              />
            </div>
            <div>
              <label className="admin-form-label">Specialization</label>
              <select
                className="admin-select"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              >
                {specialities.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-form-label">Qualification Degrees</label>
              <input
                className="admin-input"
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                placeholder="e.g. MBBS, MD, DNB"
              />
            </div>
            <div>
              <label className="admin-form-label">Experience (Years)</label>
              <input
                type="number"
                className="admin-input"
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-form-label">Consultation Fee (₹)</label>
              <input
                type="number"
                className="admin-input"
                value={form.consultation_fee}
                onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-form-label">Languages Spoken</label>
              <input
                className="admin-input"
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
                placeholder="e.g. English, Hindi, Gujarati"
              />
            </div>
            <div className="admin-form-full">
              <label className="admin-form-label">Doctor Biography & Profile Summary</label>
              <textarea
                className="admin-textarea"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Write a brief professional summary about your medical practice and experience..."
              />
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="admin-save-btn" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
