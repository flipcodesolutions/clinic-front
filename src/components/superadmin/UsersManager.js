'use client';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { getClinics } from '@/services/clinicService';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserStatus,
} from '@/services/userService';
import { showError, showSuccess } from '@/utils/toast';

function formatStatus(status) {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const emptyForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  roles: ['clinic_admin'],
  status: 'active',
  clinic_id: '',
};

const defaultFilters = {
  search: '',
  status: '',
  role: 'clinic_admin',
  page: 1,
  limit: 10,
};

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [clinicsList, setClinicsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // Searchable Clinic Select State
  const [clinicSearch, setClinicSearch] = useState('');
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const clinicDropdownRef = useRef(null);

  const loadUsers = async (filters = activeFilters) => {
    try {
      setLoading(true);
      setError('');
      const result = await getUsers(filters);
      setUsers(result.data || []);
      setPagination({
        count: result.count ?? 0,
        currentPage: result.currentPage ?? 1,
        totalPages: result.totalPages ?? 1,
        limit: result.limit ?? filters.limit ?? 10,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong while loading clinic admins.';
      setError(message);
      showError(err, message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadUsers(defaultFilters);
    });

    getClinics({ limit: 100 })
      .then((res) => setClinicsList(res.data || []))
      .catch((err) => console.error('Failed to load clinics dropdown', err));

    const handleClickOutside = (e) => {
      if (clinicDropdownRef.current && !clinicDropdownRef.current.contains(e.target)) {
        setShowClinicDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClinics = clinicsList.filter((c) => {
    const term = clinicSearch.toLowerCase().trim();
    if (!term) return true;
    return `${c.name} ${c.city || ''}`.toLowerCase().includes(term);
  });

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
      role: 'clinic_admin',
      page: 1,
      limit: activeFilters.limit,
    };
    setActiveFilters(filters);
    loadUsers(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters(defaultFilters);
    loadUsers(defaultFilters);
  };

  const handleLimitChange = (limit) => {
    const filters = {
      ...activeFilters,
      page: 1,
      limit: Number(limit),
    };
    setActiveFilters(filters);
    loadUsers(filters);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    const filters = {
      ...activeFilters,
      page,
    };
    setActiveFilters(filters);
    loadUsers(filters);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setClinicSearch('');
    setFormError('');
    setShowModal(true);
  };

  const handleOpenView = async (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
    try {
      const data = await getUserById(user.id);
      setSelectedUser(data);
    } catch (err) {
      // Fallback to table row data
    }
  };

  const handleOpenEdit = async (user) => {
    setEditingId(user.id);
    setFormError('');
    setShowModal(true);
    setLoadingForm(true);

    try {
      const data = await getUserById(user.id);
      const linkedClinicId = data.clinics?.[0]?.id || user.clinics?.[0]?.id || '';
      const matchedClinic = clinicsList.find((c) => String(c.id) === String(linkedClinicId));

      setForm({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        password: '',
        roles: Array.isArray(data.roles) ? data.roles : [data.roles || 'clinic_admin'],
        status: data.status === 'inactive' ? 'inactive' : 'active',
        clinic_id: linkedClinicId ? String(linkedClinicId) : '',
      });
      setClinicSearch(matchedClinic ? `${matchedClinic.name} ${matchedClinic.city ? `(${matchedClinic.city})` : ''}` : '');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load admin details.';
      setFormError(message);
      showError(err, message);
      const linkedClinicId = user.clinics?.[0]?.id || '';
      const matchedClinic = clinicsList.find((c) => String(c.id) === String(linkedClinicId));

      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        roles: Array.isArray(user.roles) ? user.roles : [user.roles || 'clinic_admin'],
        status: user.status === 'inactive' ? 'inactive' : 'active',
        clinic_id: linkedClinicId ? String(linkedClinicId) : '',
      });
      setClinicSearch(matchedClinic ? `${matchedClinic.name} ${matchedClinic.city ? `(${matchedClinic.city})` : ''}` : '');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleCloseModal = () => {
    if (saving || loadingForm) return;
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setClinicSearch('');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      setFormError('First name is required.');
      return;
    }
    if (!form.email.trim()) {
      setFormError('Email is required.');
      return;
    }
    if (!form.phone.trim()) {
      setFormError('Phone number is required.');
      return;
    }
    if (!editingId && !form.password.trim()) {
      setFormError('Password is required for new admin.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        roles: form.roles,
        status: form.status,
        clinic_id: form.clinic_id || null,
      };

      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (editingId) {
        const result = await updateUser(editingId, payload);
        showSuccess(result.message);
        await loadUsers(activeFilters);
      } else {
        const result = await createUser(payload);
        showSuccess(result.message);
        await loadUsers(activeFilters);
      }

      setForm(emptyForm);
      setClinicSearch('');
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        (editingId ? 'Failed to update clinic admin.' : 'Failed to create clinic admin.');
      setFormError(message);
      showError(err, message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const fullName = `${user.first_name} ${user.last_name || ''}`.trim();
    const result = await Swal.fire({
      title: 'Delete Clinic Admin?',
      text: `"${fullName}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await deleteUser(user.id);
      await loadUsers(activeFilters);
      showSuccess(deleteResult.message);
    } catch (err) {
      showError(err, 'Failed to delete clinic admin.');
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = formatStatus(user.status) === 'Active' ? 'inactive' : 'active';

    try {
      const result = await updateUserStatus(user.id, newStatus);
      showSuccess(result.message);
      await loadUsers(activeFilters);
    } catch (err) {
      showError(err, 'Failed to update status');
    }
  };

  return (
    <div className="cities-manager">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Management</h1>
          <p className="admin-subtitle">Create, edit, and manage Clinic Admin accounts.</p>
        </div>
        <button className="admin-add-btn" onClick={handleOpenAdd}>
          <span>+</span> Create Clinic Admin
        </button>
      </div>

      <div className="admin-filter-bar">
        <input
          className="admin-search-input"
          placeholder="Search admins by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="admin-filter-select"
          value={activeFilters.limit}
          onChange={(e) => handleLimitChange(e.target.value)}
        >
          <option value="10">10 per page</option>
          <option value="20">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
        <button className="admin-btn-apply" onClick={handleApplyFilter}>
          Apply Filter
        </button>
        <button className="admin-btn-reset" onClick={handleResetFilter}>
          Reset
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Admin Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Associated Clinic</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="admin-table-loading-text">
                    Loading admins...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="admin-table-error-text">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-table-empty-text">
                    No clinic admins found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const status = formatStatus(u.status);
                  const fullName = `${u.first_name} ${u.last_name || ''}`.trim();
                  const linkedClinic = u.clinics && u.clinics.length > 0 ? u.clinics[0] : null;

                  return (
                    <tr key={u.id}>
                      <td>
                        <span className="admin-table-bold-name">{fullName}</span>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        {linkedClinic ? (
                          <span className="admin-clinic-link-tag">
                            🏥 {linkedClinic.name}
                          </span>
                        ) : (
                          <span className="admin-unassigned-tag">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="admin-badge-toggle-btn"
                          onClick={() => toggleStatus(u)}
                          title="Click to toggle status"
                        >
                          <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                            {status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button className="admin-action-btn-view" onClick={() => handleOpenView(u)}>
                          View
                        </button>
                        <button className="admin-action-btn-edit" onClick={() => handleOpenEdit(u)}>
                          Edit
                        </button>
                        <button className="admin-action-btn-delete" onClick={() => handleDelete(u)}>
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

        {!loading && !error && pagination.totalPages > 0 && (
          <div className="admin-pagination-container">
            <span className="admin-pagination-info">
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.count} total admins)
            </span>
            <div className="admin-pagination-controls">
              <button
                className="admin-btn-reset"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </button>
              <button
                className="admin-btn-apply"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Admin Details Modal */}
      {showViewModal && selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setShowViewModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Clinic Admin Details</h3>

            <div className="admin-form-grid">
              <div>
                <label className="admin-form-label">Admin ID</label>
                <div className="admin-modal-field-val">#{selectedUser.id}</div>
              </div>

              <div>
                <label className="admin-form-label">UUID</label>
                <div className="admin-modal-field-sub">{selectedUser.uuid || 'N/A'}</div>
              </div>

              <div>
                <label className="admin-form-label">First Name</label>
                <div className="admin-modal-field-text">{selectedUser.first_name}</div>
              </div>

              <div>
                <label className="admin-form-label">Last Name</label>
                <div className="admin-modal-field-text">{selectedUser.last_name || '-'}</div>
              </div>

              <div>
                <label className="admin-form-label">Email Address</label>
                <div className="admin-modal-field-text">{selectedUser.email}</div>
              </div>

              <div>
                <label className="admin-form-label">Phone Number</label>
                <div className="admin-modal-field-text">{selectedUser.phone}</div>
              </div>

              <div className="admin-form-full">
                <label className="admin-form-label">Associated Clinic</label>
                <div className="admin-clinic-link-tag">
                  {selectedUser.clinics && selectedUser.clinics.length > 0 ? (
                    `🏥 ${selectedUser.clinics[0].name} (${selectedUser.clinics[0].city || ''})`
                  ) : (
                    <span className="admin-unassigned-tag">No Clinic Assigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="admin-form-label">Status</label>
                <div>
                  <span className={`admin-badge ${formatStatus(selectedUser.status) === 'Active' ? 'active' : 'inactive'}`}>
                    {formatStatus(selectedUser.status)}
                  </span>
                </div>
              </div>

              <div>
                <label className="admin-form-label">Last Login</label>
                <div className="admin-modal-field-text">
                  {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : 'Never'}
                </div>
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-cancel-btn"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Admin Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingId ? 'Edit Clinic Admin' : 'Create Clinic Admin'}
            </h3>

            {loadingForm ? (
              <p className="admin-table-loading-text">
                Loading admin details...
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-form-label">First Name *</label>
                    <input
                      className="admin-input"
                      placeholder="e.g. Rahul"
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Last Name</label>
                    <input
                      className="admin-input"
                      placeholder="e.g. Sharma"
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Email Address *</label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="e.g. admin@clinic.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 9876543210"
                      maxLength={15}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d+]/g, '') })}
                      required
                    />
                  </div>

                  {/* Searchable Associated Clinic Dropdown */}
                  <div className="admin-form-full admin-searchable-select-wrap" ref={clinicDropdownRef}>
                    <label className="admin-form-label">Assign Associated Clinic</label>
                    <div className="admin-searchable-select-wrap">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Search & select clinic..."
                        value={clinicSearch}
                        onFocus={() => setShowClinicDropdown(true)}
                        onChange={(e) => {
                          setClinicSearch(e.target.value);
                          setShowClinicDropdown(true);
                          if (!e.target.value.trim()) {
                            setForm({ ...form, clinic_id: '' });
                          }
                        }}
                      />
                      {form.clinic_id && (
                        <button
                          type="button"
                          title="Clear selected clinic"
                          className="admin-searchable-clear-btn"
                          onClick={() => {
                            setForm({ ...form, clinic_id: '' });
                            setClinicSearch('');
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {showClinicDropdown && (
                      <div className="admin-searchable-dropdown-list">
                        <div
                          className="admin-searchable-item-unassigned"
                          onClick={() => {
                            setForm({ ...form, clinic_id: '' });
                            setClinicSearch('');
                            setShowClinicDropdown(false);
                          }}
                        >
                          -- Unassigned (No Clinic) --
                        </div>

                        {filteredClinics.length === 0 ? (
                          <div className="admin-searchable-item-empty">
                            No clinic matches "{clinicSearch}"
                          </div>
                        ) : (
                          filteredClinics.map((c) => {
                            const isSelected = form.clinic_id === String(c.id);
                            return (
                              <div
                                key={c.id}
                                className={`admin-searchable-item ${isSelected ? 'selected' : ''}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setForm({ ...form, clinic_id: String(c.id) });
                                  setClinicSearch(`${c.name} ${c.city ? `(${c.city})` : ''}`);
                                  setShowClinicDropdown(false);
                                }}
                              >
                                <span>🏥 {c.name} {c.city ? `(${c.city})` : ''}</span>
                                {isSelected && <span>✓</span>}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">
                      {editingId ? 'Password (leave blank to keep current)' : 'Password *'}
                    </label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder={editingId ? 'Optional new password' : 'Enter strong password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required={!editingId}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-select"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {formError && (
                  <p className="admin-form-error-msg">{formError}</p>
                )}

                <div className="admin-form-actions">
                  <button type="submit" className="admin-save-btn" disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Update Clinic Admin' : 'Save Clinic Admin'}
                  </button>
                  <button
                    type="button"
                    className="admin-cancel-btn"
                    onClick={handleCloseModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
