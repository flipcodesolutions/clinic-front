'use client';
import { useEffect, useState } from 'react';
import { getClinicProfile, updateClinicProfile } from '@/services/clinicAdminService';

export default function AboutManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    clinicName: '',
    tagline: '',
    description: '',
    established: '',
    city: '',
    state: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    timings: '',
  });

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const data = await getClinicProfile();
      if (data) {
        setForm(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      const res = await updateClinicProfile(form);
      if (res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="about-manager" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
        Loading clinic profile...
      </div>
    );
  }

  return (
    <div className="about-manager">
      <form onSubmit={handleSave}>
        <div className="about-header">
          <div>
            <h1 className="about-title">About Clinic</h1>
            <p className="about-subtitle">Manage your clinic's public profile</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className={`about-save-btn${saved ? ' saved' : ''}`}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              marginBottom: 16,
              background: '#fee2e2',
              color: '#b91c1c',
              fontSize: 14,
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Basic Info */}
        <div className="about-section">
          <h3 className="about-section-title">🏥 Basic Information</h3>
          <div className="about-form-grid">
            <div>
              <label className="about-label">Clinic Name *</label>
              <input
                className="about-input"
                required
                value={form.clinicName}
                onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">Tagline</label>
              <input
                className="about-input"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">Established Year</label>
              <input
                className="about-input"
                value={form.established}
                onChange={(e) => setForm({ ...form, established: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">Timings</label>
              <input
                className="about-input"
                value={form.timings}
                onChange={(e) => setForm({ ...form, timings: e.target.value })}
              />
            </div>
            <div className="about-form-col-full">
              <label className="about-label">About / Description</label>
              <textarea
                className="about-textarea"
                rows="4"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="about-section">
          <h3 className="about-section-title">📍 Contact & Location</h3>
          <div className="about-form-grid">
            <div className="about-form-col-full">
              <label className="about-label">Address</label>
              <input
                className="about-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">City</label>
              <input
                className="about-input"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">State</label>
              <input
                className="about-input"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">Phone</label>
              <input
                className="about-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">Email</label>
              <input
                className="about-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="about-label">Website</label>
              <input
                className="about-input"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
