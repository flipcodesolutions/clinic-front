'use client';
import { useState } from 'react';

const initialDoctors = [
  { id: 1, name: 'Dr. Priya Sharma', speciality: 'Dentist', experience: '12', fee: '500', email: 'priya@clinic.com', phone: '9876543210', status: 'Active' },
  { id: 2, name: 'Dr. Arjun Mehta', speciality: 'Cardiologist', experience: '15', fee: '1000', email: 'arjun@clinic.com', phone: '9876543211', status: 'Active' },
  { id: 3, name: 'Dr. Neha Patel', speciality: 'Dermatologist', experience: '8', fee: '600', email: 'neha@clinic.com', phone: '9876543212', status: 'On Leave' },
  { id: 4, name: 'Dr. Rahul Gupta', speciality: 'Orthopedic', experience: '10', fee: '800', email: 'rahul@clinic.com', phone: '9876543213', status: 'Active' },
];

const specialities = [
  'General Physician', 'Dentist', 'Cardiologist', 'Dermatologist', 
  'Orthopedic', 'Gynecologist', 'Pediatrician', 'Neurologist', 
  'ENT Specialist', 'Ophthalmologist', 'Psychiatrist', 'Urologist'
];

export default function DoctorsManager() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', speciality: '', experience: '', fee: '', phone: '', status: 'Active'
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedStatus, setAppliedStatus] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.speciality) {
      alert('Please fill in all required fields (Name, Email, Speciality).');
      return;
    }
    setDoctors([...doctors, { ...form, id: Date.now() }]);
    setForm({ name: '', email: '', password: '', speciality: '', experience: '', fee: '', phone: '', status: 'Active' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doc => doc.id !== id));
    }
  };

  // Filter Logic
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = !appliedSearch ? true : (
      doc.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      (doc.email && doc.email.toLowerCase().includes(appliedSearch.toLowerCase())) ||
      (doc.phone && doc.phone.toLowerCase().includes(appliedSearch.toLowerCase()))
    );
    const matchesStatus = !appliedStatus ? true : doc.status === appliedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="staff-manager">
      {/* Header */}
      <div className="staff-header">
        <div>
          <h1 className="staff-title">Doctors Directory</h1>
          <p className="staff-count">{filteredDoctors.length} Registered Doctors</p>
        </div>
        <button className="staff-add-btn" onClick={() => setShowForm(!showForm)}>
          <span>+</span> Add Doctor
        </button>
      </div>

      {/* Register Form Modal */}
      {showForm && (
        <div className="clinic-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="clinic-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="staff-form-title">Register New Doctor</h3>
            <form onSubmit={handleAdd}>
              <div className="staff-form-grid">
                <div>
                  <label className="staff-form-label">Doctor Name *</label>
                  <input 
                    className="staff-input" 
                    placeholder="e.g. Dr. Amit Verma" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="staff-form-label">Speciality *</label>
                  <select 
                    className="staff-select" 
                    value={form.speciality} 
                    onChange={e => setForm({ ...form, speciality: e.target.value })}
                    required
                  >
                    <option value="">Select Speciality</option>
                    {specialities.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="staff-form-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="staff-input" 
                    placeholder="doctor@clinic.com" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="staff-form-label">Temporary Password *</label>
                  <input 
                    type="password" 
                    className="staff-input" 
                    placeholder="Password for doctor login" 
                    value={form.password} 
                    onChange={e => setForm({ ...form, password: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="staff-form-label">Phone Number</label>
                  <input 
                    className="staff-input" 
                    placeholder="10 digit phone number" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="staff-form-label">Experience (Years)</label>
                  <input 
                    type="number" 
                    className="staff-input" 
                    placeholder="e.g. 5" 
                    value={form.experience} 
                    onChange={e => setForm({ ...form, experience: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="staff-form-label">Consultation Fee (₹)</label>
                  <input 
                    type="number" 
                    className="staff-input" 
                    placeholder="e.g. 500" 
                    value={form.fee} 
                    onChange={e => setForm({ ...form, fee: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="staff-form-label">Availability Status</label>
                  <select 
                    className="staff-select" 
                    value={form.status} 
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div className="staff-form-actions">
                <button type="submit" className="staff-save-btn">Save Doctor</button>
                <button type="button" className="staff-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="clinic-filter-bar">
        <div className="clinic-filter-group">
          <input 
            className="clinic-search-input" 
            placeholder="Search doctors by name, speciality, contact..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <select 
          className="clinic-filter-select" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
        </select>
        <div className="clinic-filter-actions">
          <button 
            className="clinic-btn-apply" 
            onClick={() => {
              setAppliedSearch(searchTerm);
              setAppliedStatus(statusFilter);
            }}
          >
            Apply Filter
          </button>
          <button 
            className="clinic-btn-reset" 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setAppliedSearch('');
              setAppliedStatus('');
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Doctors Table Card */}
      <div className="clinic-table-card">
        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Speciality</th>
                <th>Experience</th>
                <th>Fee</th>
                <th>Contact Info</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="clinic-doctor-cell">
                      <div className="clinic-avatar">👨‍⚕️</div>
                      <span className="clinic-doctor-name">{doc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="staff-role-badge">{doc.speciality}</span>
                  </td>
                  <td>{doc.experience || '0'} Yrs</td>
                  <td>₹{doc.fee || '0'}</td>
                  <td>
                    <div className="small text-muted">{doc.email}</div>
                    <div className="small text-muted">{doc.phone || 'N/A'}</div>
                  </td>
                  <td>
                    <span className={`clinic-status-badge ${doc.status === 'Active' ? 'active' : 'leave'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="staff-edit-btn btn btn-sm py-1 px-2">Edit</button>
                      <button className="staff-delete-btn btn btn-sm py-1 px-2" onClick={() => handleDelete(doc.id)}>Delete</button>
                    </div>
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
