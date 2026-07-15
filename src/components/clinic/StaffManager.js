'use client';
import { useState } from 'react';

const initialStaff = [
  { id: 1, name: 'Rahul Patel', role: 'Receptionist', phone: '9876543210', email: 'rahul@clinic.com', photo: '👨' },
  { id: 2, name: 'Sunita Sharma', role: 'Nurse', phone: '9823456789', email: 'sunita@clinic.com', photo: '👩' },
  { id: 3, name: 'Mohan Verma', role: 'Lab Technician', phone: '9912345678', email: 'mohan@clinic.com', photo: '🧑' },
];

const roles = ['Receptionist', 'Nurse', 'Lab Technician', 'Pharmacist', 'Cleaner', 'Security'];

export default function StaffManager() {
  const [staff, setStaff] = useState(initialStaff);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', phone: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = () => {
    if (!form.name || !form.role) return;
    setStaff([...staff, { ...form, id: Date.now(), photo: '🧑' }]);
    setForm({ name: '', role: '', phone: '', email: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => setStaff(staff.filter(s => s.id !== id));

  // Filter Logic
  const filteredStaff = staff.filter(member => {
    const term = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term) ||
      (member.phone && member.phone.toLowerCase().includes(term)) ||
      (member.email && member.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="staff-manager">
      {/* Header */}
      <div className="staff-header">
        <div>
          <h1 className="staff-title">Staff Management</h1>
          <p className="staff-count">{filteredStaff.length} team members</p>
        </div>
        <button className="staff-add-btn" onClick={() => setShowForm(!showForm)}>
          <span>+</span> Add Staff
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="clinic-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="clinic-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="staff-form-title">New Staff Member</h3>
            <div className="staff-form-grid">
              <div>
                <label className="staff-form-label">Full Name *</label>
                <input className="staff-input" placeholder="Enter name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="staff-form-label">Role *</label>
                <select className="staff-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="">Select role</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="staff-form-label">Phone</label>
                <input className="staff-input" placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="staff-form-label">Email</label>
                <input className="staff-input" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="staff-form-actions">
              <button className="staff-save-btn" onClick={handleAdd}>Save Staff</button>
              <button className="staff-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="clinic-filter-bar">
        <div className="clinic-filter-group">
          <input 
            className="clinic-search-input" 
            placeholder="Search staff members by name, role, email, phone..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        {searchTerm && (
          <div className="clinic-filter-actions">
            <button className="clinic-btn-reset" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Staff Table Card */}
      <div className="clinic-table-card">
        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Contact Number</th>
                <th>Email Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="clinic-doctor-cell">
                      <div className="clinic-avatar">{member.photo}</div>
                      <span className="clinic-doctor-name">{member.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="staff-role-badge">{member.role}</span>
                  </td>
                  <td>{member.phone || 'N/A'}</td>
                  <td>{member.email || 'N/A'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="staff-edit-btn btn btn-sm py-1 px-2">Edit</button>
                      <button className="staff-delete-btn btn btn-sm py-1 px-2" onClick={() => handleDelete(member.id)}>Delete</button>
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
