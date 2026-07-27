'use client';

import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { getStaffList, createStaff, updateStaff, deleteStaff, getClinics } from '@/services/clinicAdminService';
import apiClient from '@/services/apiClient';

const showSuccess = (msg) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: msg,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

const showError = (err, fallbackMsg = 'An error occurred.') => {
  const message = err.response?.data?.message || err.message || fallbackMsg;
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });
};

function formatStatus(status) {
  if (!status) return 'Active';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const backendUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Searchable Clinic Select Component
function SearchableClinicSelect({ clinics, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const selectedClinic = clinics.find((c) => String(c.id) === String(value));
  const displayLabel = selectedClinic ? `${selectedClinic.name} (${selectedClinic.city || 'N/A'})` : '';

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = clinics.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="clinic-search-select-wrap">
      <div className="clinic-search-select-box">
        <input
          type="text"
          className="admin-input"
          placeholder="Select Clinic..."
          value={isOpen ? searchTerm : displayLabel}
          onFocus={() => {
            setSearchTerm('');
            setIsOpen(true);
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
        />
        <span className="clinic-search-select-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="clinic-search-select-menu">
          <div
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className={`clinic-search-select-item ${!value ? 'selected' : ''}`}
            style={{ color: '#64748b', fontWeight: 600 }}
          >
            <span>🏥</span>
            <span>Select Clinic</span>
          </div>
          {filtered.length === 0 ? (
            <div className="clinic-search-select-no-results">
              No matching clinic found
            </div>
          ) : (
            filtered.map((clinic) => (
              <div
                key={clinic.id}
                onClick={() => {
                  onChange(clinic.id);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`clinic-search-select-item ${String(value) === String(clinic.id) ? 'selected' : ''}`}
              >
                <span>🏥</span>
                <span>{clinic.name} ({clinic.city || 'N/A'})</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Static Designation Options
const DESIGNATION_OPTIONS = [
  'Receptionist',
  'Nurse',
  'Lab Technician',
  'Pharmacist',
  'Accountant',
  'Manager',
  'Front Desk Executive',
  'Assistant',
  'Caretaker',
  'Other',
];

// Searchable Designation Select Component
function SearchableDesignationSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = DESIGNATION_OPTIONS.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="clinic-search-select-wrap">
      <div className="clinic-search-select-box">
        <input
          type="text"
          className="admin-input"
          placeholder="Select Designation..."
          value={isOpen ? searchTerm : (value || '')}
          onFocus={() => {
            setSearchTerm('');
            setIsOpen(true);
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
        />
        <span className="clinic-search-select-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="clinic-search-select-menu">
          <div
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            className={`clinic-search-select-item ${!value ? 'selected' : ''}`}
            style={{ color: '#64748b', fontWeight: 600 }}
          >
            <span>👔</span>
            <span>Select Designation</span>
          </div>

          {filtered.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
                setSearchTerm('');
              }}
              className={`clinic-search-select-item ${value === opt ? 'selected' : ''}`}
            >
              <span>👔</span>
              <span>{opt}</span>
            </div>
          ))}

          {searchTerm && !DESIGNATION_OPTIONS.some((o) => o.toLowerCase() === searchTerm.toLowerCase()) && (
            <div
              onClick={() => {
                onChange(searchTerm);
                setIsOpen(false);
                setSearchTerm('');
              }}
              className="clinic-search-select-item"
              style={{ color: '#4f46e5', fontWeight: 600, borderTop: '1px dashed #e2e8f0' }}
            >
              <span>✏️</span>
              <span>Use Custom: "{searchTerm}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [customDesignation, setCustomDesignation] = useState('');

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // Action Menu Open State
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);

  const [photoDoctor, setPhotoDoctor] = useState(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  // Form State (Exact 10 Requested Fields)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    photo_url: '',
    designation: '',
    qualification: '',
    joining_date: '',
    clinic_id: '',
    status: 'active',
  });

  const loadStaffData = async (page = 1, limit = pagination.limit) => {
    try {
      setLoading(true);
      setError('');
      const res = await getStaffList({ page, limit, search, status: statusFilter });
      const list = res?.data || (Array.isArray(res) ? res : []);
      setStaff(list);
      setPagination({
        count: res?.count || list.length,
        currentPage: res?.currentPage || page,
        totalPages: res?.totalPages || 1,
        limit,
      });

      // Load Clinics dynamically for dropdown
      try {
        const clinicsRes = await getClinics({ limit: 100 }).catch(() => null);
        if (clinicsRes && Array.isArray(clinicsRes.data)) {
          setClinics(clinicsRes.data);
        } else {
          setClinics([]);
        }
      } catch (err) {
        setClinics([]);
      }
    } catch (err) {
      setError('Failed to load staff records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadStaffData(1);
    });
  }, [statusFilter]);

  const handleApplyFilter = () => {
    loadStaffData(1);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    loadStaffData(1);
  };

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setPhotoPreview(dataUrl);
      if (typeof callback === 'function') callback(dataUrl);

      try {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        const res = await apiClient.post('/upload/doctors', formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res?.data?.success && res.data.data?.url) {
          const uploadedUrl = res.data.data.url;
          setPhotoPreview(uploadedUrl);
          if (typeof callback === 'function') callback(uploadedUrl);
        }
      } catch (err) {
        console.warn('Direct upload fallback used:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFormError('');
    setCustomDesignation('');
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      photo_url: '',
      designation: '',
      qualification: '',
      joining_date: '',
      clinic_id: '',
      status: 'active',
    });
    setPhotoPreview('');
    setShowModal(true);
  };

  const openEditModal = (st) => {
    setEditingStaff(st);
    setFormError('');
    setCustomDesignation(st.designation || '');
    setFormData({
      first_name: st.first_name || '',
      last_name: st.last_name || '',
      email: st.email || '',
      phone: st.phone || '',
      password: '',
      photo_url: st.photo_url || '',
      designation: st.designation || '',
      qualification: st.qualification || '',
      joining_date: st.joining_date || '',
      clinic_id: st.clinic_id || (clinics.length > 0 ? clinics[0].id : ''),
      status: (st.status || 'active').toLowerCase(),
    });
    setPhotoPreview(st.photo_url || '');
    setShowModal(true);
    setOpenActionRowId(null);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setFormError('First and Last name are required.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Email address is required.');
      return;
    }

    const cleanPhone = String(formData.phone).replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Mobile number must be exactly 10 digits.');
      return;
    }

    if (!editingStaff && (!formData.password || formData.password.trim().length < 6)) {
      setFormError('Password is required (minimum 6 characters).');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingStaff) {
        const result = await updateStaff(editingStaff.id, formData);
        showSuccess(result?.message || 'Staff updated successfully');
      } else {
        const result = await createStaff(formData);
        showSuccess(result?.message || 'Staff added successfully');
      }
      setShowModal(false);
      await loadStaffData(pagination.currentPage);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save staff details.';
      setFormError(msg);
      showError(err, msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (st) => {
    setOpenActionRowId(null);
    const result = await Swal.fire({
      title: 'Delete staff member?',
      text: `"${st.first_name} ${st.last_name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete staff',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await deleteStaff(st.id);
      showSuccess(deleteResult?.message || 'Staff deleted successfully.');
      await loadStaffData(pagination.currentPage);
    } catch (err) {
      showError(err, 'Failed to delete staff member.');
    }
  };

  const toggleStatus = async (st) => {
    const newStatus = formatStatus(st.status) === 'Active' ? 'inactive' : 'active';
    try {
      const result = await updateStaff(st.id, { ...st, status: newStatus });
      showSuccess(result?.message || 'Staff status updated.');
      await loadStaffData(pagination.currentPage);
    } catch (err) {
      showError(err, 'Failed to update status.');
    }
  };

  return (
    <div className="cities-manager">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Staff Management</h1>
          <p className="admin-subtitle">Manage clinic receptionists, nurses, caretakers & administrative staff profiles.</p>
        </div>
        <button className="admin-add-btn" onClick={openAddModal}>
          <span>+</span> Add Staff Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <input
          className="admin-search-input"
          placeholder="Search staff by name, email or phone..."
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
          value={pagination.limit}
          onChange={(e) => loadStaffData(1, Number(e.target.value))}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
        <button className="admin-btn-apply" onClick={handleApplyFilter}>
          Apply Filter
        </button>
        <button className="admin-btn-reset" onClick={handleResetFilter}>
          Reset
        </button>
      </div>

      {/* Table Card */}
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Designation & Qualification</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading staff records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No staff members found matching your criteria.
                  </td>
                </tr>
              ) : (
                staff.map((st) => {
                  const status = formatStatus(st.status);
                  const isActionOpen = openActionRowId === st.id;

                  return (
                    <tr key={st.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="doctor-avatar-box">
                            {st.photo_url ? (
                              <img
                                src={formatImageUrl(st.photo_url)}
                                alt={st.first_name}
                                className="doctor-avatar-img"
                              />
                            ) : (
                              <div className="doctor-avatar-initials">
                                {st.first_name ? st.first_name.charAt(0).toUpperCase() : 'S'}
                              </div>
                            )}
                          </div>
                          <div className="doctor-info-box">
                            <div className="doctor-info-name">
                              {st.first_name} {st.last_name}
                            </div>
                            <div className="doctor-info-sub">{st.email}</div>
                            <div className="doctor-info-sub">{st.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#4f46e5' }}>{st.designation || 'Staff Member'}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{st.qualification || 'N/A'}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{st.joining_date || 'N/A'}</span>
                      </td>
                      <td>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                          onClick={() => toggleStatus(st)}
                          title="Click to toggle status"
                        >
                          <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                            {status}
                          </span>
                        </button>
                      </td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        <div className="admin-action-menu-wrap">
                          <button
                            onClick={() => setOpenActionRowId(isActionOpen ? null : st.id)}
                            className={`admin-action-trigger-btn ${isActionOpen ? 'active' : ''}`}
                            title="Actions Menu"
                          >
                            ⋮
                          </button>

                          {isActionOpen && (
                            <div className="admin-action-popover">
                              <button
                                onClick={() => {
                                  setViewStaff(st);
                                  setOpenActionRowId(null);
                                }}
                                className="admin-action-btn-view"
                                title="View Details"
                              >
                                👁️ View
                              </button>
                              <button
                                onClick={() => openEditModal(st)}
                                className="admin-action-btn-edit"
                                title="Edit Staff"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(st)}
                                className="admin-action-btn-delete"
                                title="Delete Staff"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && pagination.totalPages > 0 && (
          <div className="admin-pagination-footer">
            <span style={{ fontSize: 14, color: '#64748b' }}>
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.count} total staff)
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="admin-btn-reset"
                onClick={() => loadStaffData(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                Previous
              </button>
              <button
                className="admin-btn-apply"
                onClick={() => loadStaffData(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Staff Modal (Strict 10 Fields) */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => !saving && setShowModal(false)}>
          <div className="admin-modal-card admin-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h3>

            <form onSubmit={handleSaveStaff}>
              <div className="admin-form-grid">
                {/* First Name */}
                <div>
                  <label className="admin-form-label">First Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="admin-form-label">Last Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    placeholder="Enter last name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="admin-form-label">Email Address *</label>
                  <input
                    type="email"
                    className="admin-input"
                    required
                    placeholder="staff@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="admin-form-label">Mobile Number (10 digits) *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    maxLength="10"
                    placeholder="10 digit mobile number"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: val });
                    }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="admin-form-label">
                    Password {editingStaff ? '(Leave blank to keep unchanged)' : '*'}
                  </label>
                  <input
                    type="password"
                    className="admin-input"
                    required={!editingStaff}
                    placeholder={editingStaff ? '••••••••' : 'Enter login password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {/* Profile Photo */}
                <div>
                  <label className="admin-form-label">Profile Photo</label>
                  <div className="doctor-file-input-wrap">
                    {photoPreview && (
                      <img
                        src={formatImageUrl(photoPreview)}
                        alt="Preview"
                        className="doctor-avatar-img"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(file, (url) => {
                            setFormData((prev) => ({ ...prev, photo_url: url }));
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Designation */}
                <div>
                  <label className="admin-form-label">Designation</label>
                  <SearchableDesignationSelect
                    value={formData.designation}
                    onChange={(val) => {
                      if (val === 'Other') {
                        setFormData({ ...formData, designation: 'Other' });
                        setCustomDesignation('');
                      } else {
                        setFormData({ ...formData, designation: val });
                        setCustomDesignation(val);
                      }
                    }}
                  />
                  {(formData.designation === 'Other' || (formData.designation && !DESIGNATION_OPTIONS.includes(formData.designation))) && (
                    <input
                      type="text"
                      className="admin-input"
                      style={{ marginTop: 8 }}
                      placeholder="Enter custom designation (e.g. Senior OT Specialist)..."
                      value={customDesignation === 'Other' ? '' : customDesignation}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomDesignation(val);
                        setFormData({ ...formData, designation: val || 'Other' });
                      }}
                    />
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <label className="admin-form-label">Qualification</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. B.Sc Nursing, Graduate"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>

                {/* Joining Date */}
                <div>
                  <label className="admin-form-label">Joining Date</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                  />
                </div>

                {/* Clinic */}
                <div>
                  <label className="admin-form-label">Clinic</label>
                  <SearchableClinicSelect
                    clinics={clinics}
                    value={formData.clinic_id}
                    onChange={(val) => setFormData({ ...formData, clinic_id: val })}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="admin-form-label">Status</label>
                  <select
                    className="admin-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  {saving ? 'Saving...' : editingStaff ? 'Update Staff Member' : 'Save Staff Member'}
                </button>
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Staff Profile Details Modal */}
      {viewStaff && (
        <div className="admin-modal-backdrop" onClick={() => setViewStaff(null)}>
          <div className="admin-modal-card admin-modal-card-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Staff Profile Details</h3>

            <div className="doctor-view-header">
              {viewStaff.photo_url ? (
                <img
                  src={formatImageUrl(viewStaff.photo_url)}
                  alt={viewStaff.first_name}
                  className="doctor-view-avatar-img"
                />
              ) : (
                <div className="doctor-view-avatar-initials">
                  {viewStaff.first_name ? viewStaff.first_name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <div>
                <h3 className="doctor-view-title">
                  {viewStaff.first_name} {viewStaff.last_name}
                </h3>
                <p className="doctor-view-specialty">{viewStaff.designation || 'Staff Member'}</p>
                <p className="doctor-view-qualification">{viewStaff.qualification || 'N/A'}</p>
              </div>
            </div>

            <div className="doctor-view-profile-grid">
              <div><strong>First Name:</strong> {viewStaff.first_name}</div>
              <div><strong>Last Name:</strong> {viewStaff.last_name}</div>
              <div><strong>Email:</strong> {viewStaff.email}</div>
              <div><strong>Mobile:</strong> {viewStaff.phone || '—'}</div>
              <div><strong>Designation:</strong> {viewStaff.designation || 'N/A'}</div>
              <div><strong>Qualification:</strong> {viewStaff.qualification || 'N/A'}</div>
              <div><strong>Joining Date:</strong> {viewStaff.joining_date || 'N/A'}</div>
              <div><strong>Clinic:</strong> {viewStaff.clinic_name || 'N/A'}</div>
              <div><strong>Status:</strong> {formatStatus(viewStaff.status)}</div>
            </div>

            <div className="admin-form-actions" style={{ marginTop: 20 }}>
              <button className="admin-cancel-btn" onClick={() => setViewStaff(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
