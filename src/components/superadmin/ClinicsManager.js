'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createClinic, deleteClinic, getClinics, updateClinic } from '@/services/clinicService';

function formatStatus(status) {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  status: 'active',
};

export default function ClinicsManager() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [form, setForm] = useState(emptyForm);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const loadClinics = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await getClinics(filters);
      setClinics(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong while loading clinics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinics();
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
    };
    setActiveFilters(filters);
    loadClinics(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters({});
    loadClinics();
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (clinic) => {
    setEditingItem(clinic);
    setForm({
      name: clinic.name || '',
      email: clinic.email || '',
      phone: clinic.phone || '',
      address: clinic.address || '',
      city: clinic.city || '',
      state: clinic.state || '',
      status: clinic.status || 'active',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingItem(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError('Clinic Name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        status: form.status,
      };

      if (editingItem) {
        await updateClinic(editingItem.id, payload);
        await loadClinics(activeFilters);
      } else {
        const newClinic = await createClinic(payload);
        setClinics(prev => [newClinic, ...prev]);
      }

      setForm(emptyForm);
      setEditingItem(null);
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || `Failed to ${editingItem ? 'update' : 'add'} clinic.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (clinic) => {
    const result = await Swal.fire({
      title: 'Delete clinic?',
      text: `"${clinic.name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteClinic(clinic.id);
      await loadClinics(activeFilters);

      Swal.fire({
        title: 'Deleted!',
        text: 'Clinic has been removed successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to delete clinic.',
        icon: 'error',
      });
    }
  };

  const toggleStatus = async (clinic) => {
    try {
      const currentIsActive = formatStatus(clinic.status) === 'Active';
      const newStatus = currentIsActive ? 'inactive' : 'active';

      await updateClinic(clinic.id, {
        ...clinic,
        status: newStatus,
      });

      await loadClinics(activeFilters);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to update clinic status.',
        icon: 'error',
      });
    }
  };

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
          onKeyDown={e => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="admin-btn-apply" onClick={handleApplyFilter}>
          Apply Filter
        </button>
        <button className="admin-btn-reset" onClick={handleResetFilter}>
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
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                    Loading clinics...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              ) : clinics.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                    No clinics found matching criteria.
                  </td>
                </tr>
              ) : (
                clinics.map(c => {
                  const status = formatStatus(c.status);

                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {c.logo ? (
                            <img
                              src={c.logo}
                              alt={c.name}
                              className="clinic-avatar"
                              style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                            />
                          ) : (
                            <span className="clinic-avatar">🏥</span>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>ID: CLN-{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{c.email || '—'}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{c.phone || '—'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: '#475569', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.address}>
                          {c.address || '—'}
                        </div>
                        {(c.city || c.state) && (
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>{[c.city, c.state].filter(Boolean).join(', ')}</div>
                        )}
                      </td>
                      <td>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                          onClick={() => toggleStatus(c)}
                          title="Click to toggle status"
                        >
                          <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                            {status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button className="admin-action-btn-edit" onClick={() => handleOpenEdit(c)}>
                          Edit
                        </button>
                        <button className="admin-action-btn-delete" onClick={() => handleDelete(c)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingItem ? 'Edit Clinic Registration' : 'Register New Clinic'}
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
                  <label className="admin-form-label">Email Address</label>
                  <input
                    type="email"
                    className="admin-input"
                    placeholder="clinic@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
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

                <div>
                  <label className="admin-form-label">City</label>
                  <input
                    className="admin-input"
                    placeholder="City name"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div>
                  <label className="admin-form-label">State</label>
                  <input
                    className="admin-input"
                    placeholder="State name"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
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
                  <label className="admin-form-label">Activation Status</label>
                  <select
                    className="admin-select"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

              </div>

              {formError && (
                <p style={{ margin: '12px 0 0', color: '#dc2626', fontSize: 14 }}>{formError}</p>
              )}

              <div className="admin-form-actions">
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingItem ? 'Update Clinic' : 'Save Clinic'}
                </button>
                <button type="button" className="admin-cancel-btn" onClick={handleCloseModal} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
