'use client';
import { useEffect, useState } from 'react';
import { getStaffList, createStaff, updateStaff, deleteStaff } from '@/services/clinicAdminService';

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'receptionist',
    designation: 'Receptionist',
    status: 'active',
    shift: 'Morning',
  });

  const loadStaffData = async () => {
    setLoading(true);
    const res = await getStaffList();
    const list = Array.isArray(res) ? res : (res?.data || []);
    setStaff(list);
    setLoading(false);
  };

  useEffect(() => {
    loadStaffData();
  }, []);

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'receptionist',
      designation: 'Front Desk Executive',
      status: 'active',
      shift: 'Morning',
    });
    setShowModal(true);
  };

  const openEditModal = (st) => {
    setEditingStaff(st);
    setFormData({
      first_name: st.first_name || '',
      last_name: st.last_name || '',
      email: st.email || '',
      phone: st.phone || '',
      role: st.role || 'staff',
      designation: st.designation || '',
      status: st.status || 'active',
      shift: st.shift || 'General',
    });
    setShowModal(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
      } else {
        await createStaff(formData);
      }
      setShowModal(false);
      loadStaffData();
    } catch (err) {
      alert(err.message || 'Failed to save staff member');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await deleteStaff(id);
        loadStaffData();
      } catch (err) {
        alert(err.message || 'Failed to delete staff member');
      }
    }
  };

  const filteredStaff = staff.filter((st) => {
    const nameMatch = `${st.first_name} ${st.last_name}`.toLowerCase().includes(search.toLowerCase());
    const emailMatch = st.email?.toLowerCase().includes(search.toLowerCase());
    const roleMatch = roleFilter === 'all' || st.role === roleFilter;
    return (nameMatch || emailMatch) && roleMatch;
  });

  return (
    <div className="clinic-staff-manager">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Staff Management</h1>
          <p className="clinic-subtitle">Manage clinic receptionists, nurses, caretakers & administrative staff.</p>
        </div>
        <button onClick={openAddModal} className="clinic-btn clinic-btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Staff Member
        </button>
      </div>

      {/* Search & Filter */}
      <div className="clinic-table-card">
        <div className="clinic-table-header">
          <div className="clinic-search-bar">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Role Filter:</span>
            <select
              className="clinic-form-control"
              style={{ width: 150, padding: '6px 10px', fontSize: 13 }}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="receptionist">Receptionist</option>
              <option value="nurse">Nurse</option>
              <option value="caretaker">Caretaker</option>
              <option value="staff">Staff</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role & Designation</th>
                <th>Shift</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading staff records...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No staff members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((st) => (
                  <tr key={st.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {st.first_name} {st.last_name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{st.email}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{st.phone}</div>
                    </td>
                    <td>
                      <span className="clinic-gallery-tag">{st.role.toUpperCase()}</span>
                      <div style={{ fontSize: 13, color: '#334155', marginTop: 4 }}>{st.designation}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0d9488' }}>{st.shift}</span>
                    </td>
                    <td>
                      <span className={`clinic-badge ${st.status}`}>{st.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setViewStaff(st)}
                          className="clinic-btn clinic-btn-secondary clinic-btn-sm"
                          title="View Details"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => openEditModal(st)}
                          className="clinic-btn clinic-btn-secondary clinic-btn-sm"
                          title="Edit Staff"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(st.id)}
                          className="clinic-btn clinic-btn-danger clinic-btn-sm"
                          title="Delete Staff"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {showModal && (
        <div className="clinic-modal-overlay">
          <div className="clinic-modal">
            <div className="clinic-modal-header">
              <h3 className="clinic-modal-title">
                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
              </h3>
              <button className="clinic-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveStaff}>
              <div className="clinic-modal-body">
                <div className="clinic-form-grid">
                  <div className="clinic-form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      className="clinic-form-control"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="clinic-form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      className="clinic-form-control"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                  <div className="clinic-form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      className="clinic-form-control"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="clinic-form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      className="clinic-form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="clinic-form-group">
                    <label>Role</label>
                    <select
                      className="clinic-form-control"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="receptionist">Receptionist</option>
                      <option value="nurse">Nurse</option>
                      <option value="caretaker">Caretaker</option>
                      <option value="staff">Administrative Staff</option>
                    </select>
                  </div>
                  <div className="clinic-form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      className="clinic-form-control"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </div>
                  <div className="clinic-form-group">
                    <label>Shift Timing</label>
                    <select
                      className="clinic-form-control"
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    >
                      <option value="Morning">Morning (8 AM - 4 PM)</option>
                      <option value="Evening">Evening (2 PM - 10 PM)</option>
                      <option value="Night">Night (10 PM - 6 AM)</option>
                      <option value="General">General (9 AM - 6 PM)</option>
                    </select>
                  </div>
                  <div className="clinic-form-group">
                    <label>Status</label>
                    <select
                      className="clinic-form-control"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="clinic-modal-footer">
                <button
                  type="button"
                  className="clinic-btn clinic-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="clinic-btn clinic-btn-primary">
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Staff Detail Modal */}
      {viewStaff && (
        <div className="clinic-modal-overlay">
          <div className="clinic-modal">
            <div className="clinic-modal-header">
              <h3 className="clinic-modal-title">Staff Details</h3>
              <button className="clinic-modal-close" onClick={() => setViewStaff(null)}>
                ✕
              </button>
            </div>
            <div className="clinic-modal-body">
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>{viewStaff.first_name} {viewStaff.last_name}</h3>
                <p style={{ margin: '4px 0', color: '#0d9488', fontWeight: 600 }}>{viewStaff.designation}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 14 }}>
                <div><strong>Email:</strong> {viewStaff.email}</div>
                <div><strong>Phone:</strong> {viewStaff.phone || '—'}</div>
                <div><strong>System Role:</strong> {viewStaff.role}</div>
                <div><strong>Shift:</strong> {viewStaff.shift}</div>
                <div><strong>Status:</strong> {viewStaff.status}</div>
              </div>
            </div>
            <div className="clinic-modal-footer">
              <button className="clinic-btn clinic-btn-secondary" onClick={() => setViewStaff(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
