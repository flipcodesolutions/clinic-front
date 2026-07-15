'use client';
import { useState } from 'react';

export default function AboutManager() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    clinicName: 'HealthCare Plus Clinic',
    tagline: 'Your Health, Our Priority',
    description: 'We are a leading multi-specialty clinic providing comprehensive healthcare services with a team of experienced doctors and modern medical facilities.',
    established: '2015',
    city: 'Mumbai', state: 'Maharashtra',
    address: '123, MG Road, Andheri West',
    phone: '022-12345678', email: 'info@healthcareplus.com',
    website: 'www.healthcareplus.com',
    timings: 'Mon - Sat: 9:00 AM - 8:00 PM',
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="about-manager">
      <div className="about-header">
        <div>
          <h1 className="about-title">About Clinic</h1>
          <p className="about-subtitle">Manage your clinic's public profile</p>
        </div>
        <button className={`about-save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Basic Info */}
      <div className="about-section">
        <h3 className="about-section-title">🏥 Basic Information</h3>
        <div className="about-form-grid">
          <div>
            <label className="about-label">Clinic Name</label>
            <input className="about-input" value={form.clinicName} onChange={e => setForm({ ...form, clinicName: e.target.value })} />
          </div>
          <div>
            <label className="about-label">Tagline</label>
            <input className="about-input" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div>
            <label className="about-label">Established Year</label>
            <input className="about-input" value={form.established} onChange={e => setForm({ ...form, established: e.target.value })} />
          </div>
          <div>
            <label className="about-label">Timings</label>
            <input className="about-input" value={form.timings} onChange={e => setForm({ ...form, timings: e.target.value })} />
          </div>
          <div className="about-form-col-full">
            <label className="about-label">About / Description</label>
            <textarea className="about-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="about-section">
        <h3 className="about-section-title">📍 Contact & Location</h3>
        <div className="about-form-grid">
          <div className="about-form-col-full">
            <label className="about-label">Address</label>
            <input className="about-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="about-label">City</label>
            <input className="about-input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="about-label">State</label>
            <input className="about-input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
          </div>
          <div>
            <label className="about-label">Phone</label>
            <input className="about-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="about-label">Email</label>
            <input className="about-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="about-label">Website</label>
            <input className="about-input" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
