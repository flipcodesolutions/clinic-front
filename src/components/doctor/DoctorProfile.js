'use client';
import { useState } from 'react';

const specialities = ['General Physician','Dentist','Cardiologist','Dermatologist','Orthopedic','Gynecologist','Pediatrician','Neurologist','ENT Specialist','Ophthalmologist','Psychiatrist','Urologist'];

export default function DoctorProfile() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: 'Dr. Priya Sharma', email: 'priya.sharma@clinic.com',
    phone: '9876543210', speciality: 'Dentist',
    qualification: 'BDS, MDS', experience: '12',
    bio: 'Dr. Priya Sharma is a highly experienced dentist with 12 years of practice in general and cosmetic dentistry.',
    consultationFee: '500', languages: 'Hindi, English',
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="doc-profile">
      <div className="doc-profile-header">
        <div>
          <h1 className="doc-profile-title">My Profile</h1>
          <p className="doc-profile-subtitle">Manage your professional information</p>
        </div>
        <button className={`doc-save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Banner */}
      <div className="doc-profile-banner">
        <div className="doc-profile-avatar">👨‍⚕️</div>
        <div>
          <h2 className="doc-profile-banner-name">{form.name}</h2>
          <p className="doc-profile-banner-spec">{form.speciality}</p>
          <span className="doc-profile-exp-badge">{form.experience} Years Experience</span>
        </div>
      </div>

      {/* Personal Info */}
      <div className="doc-form-section">
        <h3 className="doc-form-section-title">👤 Personal Info</h3>
        <div className="doc-form-grid">
          <div>
            <label className="doc-label">Full Name</label>
            <input className="doc-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="doc-label">Email</label>
            <input className="doc-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="doc-label">Phone</label>
            <input className="doc-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="doc-label">Languages</label>
            <input className="doc-input" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div className="doc-form-section">
        <h3 className="doc-form-section-title">🏥 Professional Info</h3>
        <div className="doc-form-grid">
          <div>
            <label className="doc-label">Speciality</label>
            <select className="doc-select" value={form.speciality} onChange={e => setForm({ ...form, speciality: e.target.value })}>
              {specialities.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="doc-label">Qualification</label>
            <input className="doc-input" value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
          </div>
          <div>
            <label className="doc-label">Experience (years)</label>
            <input className="doc-input" type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
          </div>
          <div>
            <label className="doc-label">Consultation Fee (₹)</label>
            <input className="doc-input" type="number" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} />
          </div>
          <div className="doc-form-col-full">
            <label className="doc-label">Bio</label>
            <textarea className="doc-textarea" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
