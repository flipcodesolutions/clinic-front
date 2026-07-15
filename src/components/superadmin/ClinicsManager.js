'use client';
import { useState } from 'react';

const initialClinics = [
  { id: 1, name: 'Metro Health Care', email: 'info@metrohealth.com', phone: '9876543210', address: '102, Ring Road, Ahmedabad', status: 'Active' },
  { id: 2, name: 'City Dental Clinic', email: 'dental@cityclinic.com', phone: '9876543211', address: 'G-5, Shanti Arcade, Ahmedabad', status: 'Active' },
  { id: 3, name: 'Apex Cardiology Care', email: 'apex@cardio.com', phone: '9876543212', address: '4th Floor, Medical Plaza, Ahmedabad', status: 'Active' },
  { id: 4, name: 'LifeLine General Hospital', email: 'lifeline@hospital.com', phone: '9876543213', address: 'Near Highway Cross, Ahmedabad', status: 'Inactive' },
];

export default function ClinicsManager() {
  const [clinics, setClinics] = useState(initialClinics);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', password: '', status: 'Active'
  });

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');

  const handleOpenAdd = () => {
    setForm({ name: '', email: '', phone: '', address: '', password: '', status: 'Active' });
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (clinic) => {
    setForm({
      name: clinic.name,
      email: clinic.email,
      phone: clinic.phone,
      address: clinic.address,
      password: '••••••••', // Masked mock password
      status: clinic.status
    });
    setEditingId(clinic.id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert('Please fill in Name and Email.');
      return;
    }

    if (editingId) {
      // Edit mode
      setClinics(clinics.map(c => c.id === editingId ? { ...c, ...form, id: editingId } : c));
    } else {
      // Add mode
      setClinics([...clinics, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this clinic?')) {
      setClinics(clinics.filter(c => c.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setClinics(clinics.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const filteredClinics = clinics.filter(c => {
    const term = appliedSearch.toLowerCase();
    const matchesSearch = !appliedSearch ? true : (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.address.toLowerCase().includes(term)
    );
    const matchesStatus = !appliedFilter ? true : c.status === appliedFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="clinics-manager">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Clinics Directory</h1>
          <p className="admin-subtitle">Register and manage affiliated healthcare clinics on the platform.</p>
        </div>
        <button className="admin-add-btn" onClick={handleOpenAdd}>
          <span>+</span> Register Clinic
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <input 
          className="admin-search-input" 
          placeholder="Search by clinic name, email, phone, city..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="admin-filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button className="admin-btn-apply" onClick={() => {
          setAppliedSearch(search);
          setAppliedFilter(statusFilter);
        }}>
          Apply Filter
        </button>
        <button className="admin-btn-reset" onClick={() => {
          setSearch('');
          setStatusFilter('');
          setAppliedSearch('');
          setAppliedFilter('');
        }}>
          Reset
        </button>
      </div>

      {/* Table List */}
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Clinic</th>
                <th>Contact Info</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClinics.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                    No clinics found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredClinics.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="clinic-avatar">🏥</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>ID: CLN-{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.email}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{c.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: '#475569', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.address}>
                        {c.address}
                      </div>
                    </td>
                    <td>
                      <button 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        onClick={() => toggleStatus(c.id)}
                        title="Click to toggle status"
                      >
                        <span className={`admin-badge ${c.status === 'Active' ? 'active' : 'inactive'}`}>
                          {c.status}
                        </span>
                      </button>
                    </td>
                    <td>
                      <button className="admin-action-btn-edit" onClick={() => handleOpenEdit(c)}>
                        Edit
                      </button>
                      <button className="admin-action-btn-delete" onClick={() => handleDelete(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingId ? 'Edit Clinic Registration' : 'Register New Clinic'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                
                <div className="admin-form-full">
                  <label className="admin-form-label">Clinic Name *</label>
                  <input 
                    className="admin-input" 
                    placeholder="e.g. Apollo Wellness Clinic" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="admin-form-label">Email Address *</label>
                  <input 
                    type="email"
                    className="admin-input" 
                    placeholder="clinic@example.com" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="admin-form-label">Contact Number</label>
                  <input 
                    className="admin-input" 
                    placeholder="Phone number" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="admin-form-full">
                  <label className="admin-form-label">Address</label>
                  <textarea 
                    className="admin-textarea" 
                    placeholder="Complete clinic address..." 
                    value={form.address} 
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-form-label">Admin Login Password</label>
                  <input 
                    type="password"
                    className="admin-input" 
                    placeholder="Clinic admin password" 
                    value={form.password} 
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-form-label">Activation Status</label>
                  <select 
                    className="admin-select"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-save-btn">Save Clinic</button>
                <button type="button" className="admin-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
