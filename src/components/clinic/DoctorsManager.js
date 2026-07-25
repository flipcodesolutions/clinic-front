'use client';
import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import apiClient from '@/services/apiClient';
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  manageDoctorExperience,
  manageDoctorAchievement,
  manageDoctorSchedule,
  getClinicDepartments,
} from '@/services/clinicAdminService';
import { getDepartments } from '@/services/departmentService';
import { showError, showSuccess } from '@/utils/toast';

const defaultFilters = {
  search: '',
  status: '',
  page: 1,
  limit: 10,
};

function formatStatus(status) {
  if (!status) return 'Inactive';
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

function SearchableDepartmentSelect({ departments, value, onChange }) {
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

  const filtered = departments.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = isOpen ? searchTerm : (value || '');

  return (
    <div ref={wrapperRef} className="clinic-search-select-wrap">
      <div className="clinic-search-select-box">
        <input
          type="text"
          className="admin-input"
          placeholder="🔍 Search department..."
          value={displayValue}
          onFocus={() => {
            setSearchTerm('');
            setIsOpen(true);
          }}
          onChange={(e) => {
            const text = e.target.value;
            setSearchTerm(text);
            setIsOpen(true);
            onChange(text);
          }}
        />
        <span className="clinic-search-select-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="clinic-search-select-menu">
          {filtered.length === 0 ? (
            <div className="clinic-search-select-no-results">
              No matching department found. Using "{searchTerm}"
            </div>
          ) : (
            filtered.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  onChange(dept.name);
                  setSearchTerm(dept.name);
                  setIsOpen(false);
                }}
                className={`clinic-search-select-item ${value === dept.name ? 'selected' : ''}`}
              >
                <span>🏢</span>
                <span>{dept.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function DoctorsManager() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // Action Menu Open State
  const [openActionRowId, setOpenActionRowId] = useState(null);

  // Modals
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);

  const [expDoctor, setExpDoctor] = useState(null);
  const [expList, setExpList] = useState([]);

  const [achDoctor, setAchDoctor] = useState(null);
  const [achList, setAchList] = useState([]);

  const [schedDoctor, setSchedDoctor] = useState(null);
  const [schedList, setSchedList] = useState([]);

  const [photoDoctor, setPhotoDoctor] = useState(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialty: '',
    qualification: '',
    experience_years: 0,
    registration_no: '',
    consultation_fee: 0,
    gender: 'male',
    dob: '',
    languages: '',
    bio: '',
    status: 'active',
    photo_url: '',
  });

  const loadDoctorsList = async (filters = activeFilters) => {
    try {
      setLoading(true);
      setError('');
      const res = await getDoctors(filters);
      const doctorsList = res?.data || (Array.isArray(res) ? res : []);

      setDoctors(doctorsList);
      setPagination({
        count: res?.count || doctorsList.length,
        currentPage: res?.currentPage || Number(filters.page) || 1,
        totalPages: res?.totalPages || 1,
        limit: Number(filters.limit) || 10,
      });

      // Load Assigned Clinic Departments dynamically
      try {
        const assignedRes = await getClinicDepartments().catch(() => null);
        if (Array.isArray(assignedRes) && assignedRes.length > 0) {
          const activeAssigned = assignedRes.filter(
            (d) => !d.status || d.status.toLowerCase() === 'active'
          );
          setDepartments(activeAssigned.length > 0 ? activeAssigned : assignedRes);
        } else {
          const deptRes = await getDepartments({ limit: 100 }).catch(() => null);
          if (deptRes && Array.isArray(deptRes.data)) {
            const activeDepts = deptRes.data.filter(
              (d) => !d.status || d.status.toLowerCase() === 'active'
            );
            setDepartments(activeDepts);
          } else {
            setDepartments([]);
          }
        }
      } catch (err) {
        setDepartments([]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load doctors.';
      setError(msg);
      showError(err, msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorsList(defaultFilters);
  }, []);

  // Filter Actions
  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
      page: 1,
      limit: activeFilters.limit,
    };
    setActiveFilters(filters);
    loadDoctorsList(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters(defaultFilters);
    loadDoctorsList(defaultFilters);
  };

  const handleLimitChange = (limit) => {
    const filters = {
      ...activeFilters,
      page: 1,
      limit: Number(limit),
    };
    setActiveFilters(filters);
    loadDoctorsList(filters);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    const filters = {
      ...activeFilters,
      page,
    };
    setActiveFilters(filters);
    loadDoctorsList(filters);
  };

  // Image Upload Reader & Backend API Uploader
  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showError(null, 'Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/upload/doctors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res?.data?.success && res.data.data?.url) {
        callback(res.data.data.url);
        return;
      }
    } catch (err) {
      console.warn('Direct upload API failed, using base64 fallback:', err);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      callback(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Modal Handlers
  const openAddModal = () => {
    setEditingDoctor(null);
    setFormError('');
    const defaultSpec = departments.length > 0 ? departments[0].name : '';
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      specialty: defaultSpec,
      qualification: '',
      experience_years: 0,
      registration_no: '',
      consultation_fee: 0,
      gender: 'male',
      dob: '',
      languages: '',
      bio: '',
      status: 'active',
      photo_url: '',
    });
    setPhotoPreview('');
    setShowDoctorModal(true);
  };

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setFormError('');
    setFormData({
      first_name: doc.first_name || '',
      last_name: doc.last_name || '',
      email: doc.email || '',
      phone: doc.phone || '',
      specialty: doc.specialty || (departments.length > 0 ? departments[0].name : ''),
      qualification: doc.qualification || '',
      experience_years: doc.experience_years || 0,
      registration_no: doc.registration_no || '',
      consultation_fee: doc.consultation_fee || 0,
      gender: doc.gender || 'male',
      dob: doc.dob || '',
      languages: doc.languages || '',
      bio: doc.bio || '',
      status: doc.status || 'active',
      photo_url: doc.photo_url || '',
    });
    setPhotoPreview(doc.photo_url || '');
    setShowDoctorModal(true);
    setOpenActionRowId(null);
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setFormError('First and Last name are required.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Email address is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      if (editingDoctor) {
        const result = await updateDoctor(editingDoctor.id, formData);
        showSuccess(result?.message || 'Doctor updated successfully');
      } else {
        const result = await createDoctor(formData);
        showSuccess(result?.message || 'Doctor created successfully');
      }
      setShowDoctorModal(false);
      await loadDoctorsList(activeFilters);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save doctor details.';
      setFormError(msg);
      showError(err, msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async (doc) => {
    setOpenActionRowId(null);
    const result = await Swal.fire({
      title: 'Delete doctor?',
      text: `"Dr. ${doc.first_name} ${doc.last_name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete doctor',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await deleteDoctor(doc.id);
      showSuccess(deleteResult?.message || 'Doctor deleted successfully.');
      await loadDoctorsList(activeFilters);
    } catch (err) {
      showError(err, 'Failed to delete doctor.');
    }
  };

  const toggleStatus = async (doc) => {
    const newStatus = formatStatus(doc.status) === 'Active' ? 'inactive' : 'active';

    try {
      const result = await updateDoctor(doc.id, { ...doc, status: newStatus });
      showSuccess(result?.message || 'Doctor status updated.');
      await loadDoctorsList(activeFilters);
    } catch (err) {
      showError(err, 'Failed to update status.');
    }
  };

  // Photo Upload Handler
  const openPhotoModal = (doc) => {
    setPhotoDoctor(doc);
    setPhotoUrlInput(doc.photo_url || '');
    setPhotoPreview(doc.photo_url || '');
    setOpenActionRowId(null);
  };

  const handleSavePhoto = async () => {
    if (photoDoctor) {
      try {
        const result = await updateDoctor(photoDoctor.id, { photo_url: photoUrlInput });
        showSuccess(result?.message || 'Doctor photo updated successfully.');
        setPhotoDoctor(null);
        await loadDoctorsList(activeFilters);
      } catch (err) {
        showError(err, 'Failed to update photo.');
      }
    }
  };

  // Experience Modal Handler
  const openExpModal = (doc) => {
    setExpDoctor(doc);
    setExpList(doc.experiences ? [...doc.experiences] : []);
    setOpenActionRowId(null);
  };

  const handleAddExpRow = () => {
    setExpList([...expList, { id: Date.now(), hospital: '', designation: '', duration: '' }]);
  };

  const handleSaveExp = async () => {
    if (expDoctor) {
      try {
        const result = await manageDoctorExperience(expDoctor.id, expList);
        showSuccess(result?.message || 'Experiences saved successfully.');
        setExpDoctor(null);
        await loadDoctorsList(activeFilters);
      } catch (err) {
        showError(err, 'Failed to save experience records.');
      }
    }
  };

  // Achievement Modal Handler
  const openAchModal = (doc) => {
    setAchDoctor(doc);
    setAchList(doc.achievements ? [...doc.achievements] : []);
    setOpenActionRowId(null);
  };

  const handleAddAchRow = () => {
    setAchList([...achList, { id: Date.now(), title: '', organization: '', year: new Date().getFullYear() }]);
  };

  const handleSaveAch = async () => {
    if (achDoctor) {
      try {
        const result = await manageDoctorAchievement(achDoctor.id, achList);
        showSuccess(result?.message || 'Achievements saved successfully.');
        setAchDoctor(null);
        await loadDoctorsList(activeFilters);
      } catch (err) {
        showError(err, 'Failed to save achievements.');
      }
    }
  };

  // Schedule Modal Handler
  const openSchedModal = (doc) => {
    setSchedDoctor(doc);
    setSchedList(doc.schedules ? [...doc.schedules] : []);
    setOpenActionRowId(null);
  };

  const handleAddSchedRow = () => {
    setSchedList([
      ...schedList,
      { id: Date.now(), day: 'Monday', start_time: '09:00 AM', end_time: '01:00 PM', slot_duration: 15, max_patients: 15 },
    ]);
  };

  const handleSaveSched = async () => {
    if (schedDoctor) {
      try {
        const result = await manageDoctorSchedule(schedDoctor.id, schedList);
        showSuccess(result?.message || 'Schedule saved successfully.');
        setSchedDoctor(null);
        await loadDoctorsList(activeFilters);
      } catch (err) {
        showError(err, 'Failed to save schedule.');
      }
    }
  };

  return (
    <div className="cities-manager">
      {/* Header matching Super Admin */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Doctor Management</h1>
          <p className="admin-subtitle">Add doctors, edit profiles, manage fees, schedules, achievements & experiences.</p>
        </div>
        <button className="admin-add-btn" onClick={openAddModal}>
          <span>+</span> Add New Doctor
        </button>
      </div>

      {/* Super Admin Filter Bar */}
      <div className="admin-filter-bar">
        <input
          className="admin-search-input"
          placeholder="Search by doctor name or specialty..."
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
          <option value="25">25 per page</option>
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

      {/* Super Admin Table Card */}
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialty & Qualification</th>
                <th>Fee</th>
                <th>Experience</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading doctors...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No doctors found matching your criteria.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => {
                  const status = formatStatus(doc.status);
                  const isActionOpen = openActionRowId === doc.id;

                  return (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ position: 'relative' }}>
                            {doc.photo_url ? (
                              <img
                                src={formatImageUrl(doc.photo_url)}
                                alt={doc.first_name}
                                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                  color: '#ffffff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: 16,
                                }}
                              >
                                {doc.first_name ? doc.first_name.charAt(0).toUpperCase() : 'D'}
                              </div>
                            )}
                            <button
                              onClick={() => openPhotoModal(doc)}
                              title="Upload / Change Photo"
                              style={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                background: '#6366f1',
                                color: '#fff',
                                border: '2px solid #fff',
                                fontSize: 10,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              📷
                            </button>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              Dr. {doc.first_name} {doc.last_name}
                            </div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{doc.email}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{doc.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#4f46e5' }}>{doc.specialty || 'N/A'}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{doc.qualification || 'N/A'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{doc.consultation_fee || 0}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{doc.experience_years} Years</span>
                      </td>
                      <td>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                          onClick={() => toggleStatus(doc)}
                          title="Click to toggle status"
                        >
                          <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                            {status}
                          </span>
                        </button>
                      </td>
                      <td style={{ textAlign: 'center', position: 'relative' }}>
                        {/* Three Dots Action Menu Trigger */}
                        <div style={{ display: 'inline-block', position: 'relative' }}>
                          <button
                            onClick={() => setOpenActionRowId(isActionOpen ? null : doc.id)}
                            style={{
                              background: isActionOpen ? '#e0e7ff' : '#f1f5f9',
                              color: isActionOpen ? '#4f46e5' : '#475569',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              width: '36px',
                              height: '36px',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                            }}
                            title="Actions Menu"
                          >
                            ⋮
                          </button>

                          {/* Action Menu Popover showing all buttons in one horizontal line */}
                          {isActionOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '44px',
                                zIndex: 999,
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                padding: '8px 12px',
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setViewDoctor(doc);
                                  setOpenActionRowId(null);
                                }}
                                className="admin-action-btn-view"
                                style={{ margin: 0 }}
                                title="View Details"
                              >
                                👁️ View
                              </button>
                              <button
                                onClick={() => openEditModal(doc)}
                                className="admin-action-btn-edit"
                                style={{ margin: 0 }}
                                title="Edit Profile"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => openExpModal(doc)}
                                className="admin-btn-apply"
                                style={{ padding: '6px 12px', fontSize: 13, margin: 0 }}
                                title="Manage Experience"
                              >
                                🏥 Exp
                              </button>
                              <button
                                onClick={() => openAchModal(doc)}
                                className="admin-btn-apply"
                                style={{ padding: '6px 12px', fontSize: 13, margin: 0 }}
                                title="Manage Achievements"
                              >
                                🏆 Ach
                              </button>
                              <button
                                onClick={() => openSchedModal(doc)}
                                className="admin-btn-apply"
                                style={{ padding: '6px 12px', fontSize: 13, margin: 0 }}
                                title="Manage Schedule"
                              >
                                🕒 Sched
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(doc)}
                                className="admin-action-btn-delete"
                                style={{ margin: 0 }}
                                title="Delete Doctor"
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

        {/* Super Admin Pagination Footer */}
        {!loading && !error && pagination.totalPages > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 14, color: '#64748b' }}>
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.count} total doctors)
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
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

      {/* Add / Edit Doctor Modal */}
      {showDoctorModal && (
        <div className="admin-modal-backdrop" onClick={() => !saving && setShowDoctorModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
            </h3>

            <form onSubmit={handleSaveDoctor}>
              <div className="admin-form-grid">
                <div>
                  <label className="admin-form-label">First Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Last Name *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Email Address *</label>
                  <input
                    type="email"
                    className="admin-input"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Phone Number *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Specialty / Department *</label>
                  <SearchableDepartmentSelect
                    departments={departments}
                    value={formData.specialty}
                    onChange={(val) => setFormData({ ...formData, specialty: val })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Qualification *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    placeholder="e.g. MBBS, MD (Cardiology)"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Registration No (License)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. GMC-12345"
                    value={formData.registration_no}
                    onChange={(e) => setFormData({ ...formData, registration_no: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    placeholder="e.g. 500"
                    value={formData.consultation_fee}
                    onChange={(e) => setFormData({ ...formData, consultation_fee: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Experience (Years)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Gender</label>
                  <select
                    className="admin-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="admin-form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-form-label">Languages Spoken</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. English, Hindi, Gujarati"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  />
                </div>
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

                {/* Local Photo Image Upload Input */}
                <div>
                  <label className="admin-form-label">Doctor Photo Upload</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-input"
                      style={{ padding: '8px' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(file, (dataUrl) => {
                            setFormData({ ...formData, photo_url: dataUrl });
                            setPhotoPreview(dataUrl);
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="admin-form-full">
                  <label className="admin-form-label">Doctor Bio / Short Overview</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    placeholder="Brief doctor description, specialties, background..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>

              {formError && (
                <p style={{ margin: '12px 0 0', color: '#dc2626', fontSize: 14 }}>{formError}</p>
              )}

              <div className="admin-form-actions">
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Save Doctor'}
                </button>
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setShowDoctorModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Doctor Profile Modal */}
      {viewDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setViewDoctor(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Doctor Profile Details</h3>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              {viewDoctor.photo_url ? (
                <img
                  src={viewDoctor.photo_url}
                  alt={viewDoctor.first_name}
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 28,
                  }}
                >
                  {viewDoctor.first_name ? viewDoctor.first_name.charAt(0).toUpperCase() : 'D'}
                </div>
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Dr. {viewDoctor.first_name} {viewDoctor.last_name}
                </h3>
                <p style={{ margin: '4px 0', color: '#4f46e5', fontWeight: 600 }}>{viewDoctor.specialty || 'N/A'}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{viewDoctor.qualification || 'N/A'}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
              <div><strong>Email:</strong> {viewDoctor.email}</div>
              <div><strong>Phone:</strong> {viewDoctor.phone || '—'}</div>
              <div><strong>Registration No:</strong> {viewDoctor.registration_no || 'N/A'}</div>
              <div><strong>Consultation Fee:</strong> ₹{viewDoctor.consultation_fee || 0}</div>
              <div><strong>Experience:</strong> {viewDoctor.experience_years} Years</div>
              <div><strong>Gender:</strong> {viewDoctor.gender ? viewDoctor.gender.toUpperCase() : 'N/A'}</div>
              <div><strong>Date of Birth:</strong> {viewDoctor.dob || 'N/A'}</div>
              <div><strong>Languages:</strong> {viewDoctor.languages || 'N/A'}</div>
              <div><strong>Status:</strong> {formatStatus(viewDoctor.status)}</div>
            </div>

            {viewDoctor.bio && (
              <div style={{ marginTop: 16 }}>
                <strong>Bio:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#475569', fontSize: 13 }}>{viewDoctor.bio}</p>
              </div>
            )}

            <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />
            <h4 style={{ margin: '0 0 10px 0', fontSize: 15 }}>Past Experiences</h4>
            {viewDoctor.experiences?.length > 0 ? (
              <ul>
                {viewDoctor.experiences.map((exp, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 13 }}>
                    <strong>{exp.designation}</strong> at {exp.hospital} ({exp.duration})
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>No experience records added.</p>
            )}

            <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />
            <h4 style={{ margin: '0 0 10px 0', fontSize: 15 }}>Achievements & Awards</h4>
            {viewDoctor.achievements?.length > 0 ? (
              <ul>
                {viewDoctor.achievements.map((ach, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 13 }}>
                    🏆 <strong>{ach.title}</strong> — {ach.organization} ({ach.year})
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>No achievements added.</p>
            )}

            <div className="admin-form-actions">
              <button className="admin-cancel-btn" onClick={() => setViewDoctor(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Doctor Photo Modal */}
      {photoDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setPhotoDoctor(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 450 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Update Doctor Photo</h3>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {photoPreview || photoUrlInput ? (
                <img
                  src={formatImageUrl(photoPreview || photoUrlInput)}
                  alt="Doctor Photo Preview"
                  style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1' }}
                />
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 36,
                    border: '3px solid #6366f1',
                  }}
                >
                  {photoDoctor.first_name ? photoDoctor.first_name.charAt(0).toUpperCase() : 'D'}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="admin-form-label">Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                className="admin-input"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileUpload(file, (dataUrl) => {
                      setPhotoUrlInput(dataUrl);
                      setPhotoPreview(dataUrl);
                    });
                  }
                }}
              />
            </div>

            <div className="admin-form-actions">
              <button className="admin-save-btn" onClick={handleSavePhoto}>
                Save Photo
              </button>
              <button className="admin-cancel-btn" onClick={() => setPhotoDoctor(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Experience Modal */}
      {expDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setExpDoctor(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              Manage Experiences — Dr. {expDoctor.first_name} {expDoctor.last_name}
            </h3>

            {expList.map((exp, idx) => (
              <div
                key={exp.id || idx}
                style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 40px', gap: 10, marginBottom: 12 }}
              >
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Hospital / Clinic Name"
                  value={exp.hospital}
                  onChange={(e) => {
                    const updated = [...expList];
                    updated[idx].hospital = e.target.value;
                    setExpList(updated);
                  }}
                />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Designation / Role"
                  value={exp.designation}
                  onChange={(e) => {
                    const updated = [...expList];
                    updated[idx].designation = e.target.value;
                    setExpList(updated);
                  }}
                />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. 2018 - 2022"
                  value={exp.duration}
                  onChange={(e) => {
                    const updated = [...expList];
                    updated[idx].duration = e.target.value;
                    setExpList(updated);
                  }}
                />
                <button
                  type="button"
                  className="admin-action-btn-delete"
                  style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setExpList(expList.filter((_, i) => i !== idx))}
                >
                  ✕
                </button>
              </div>
            ))}

            <button onClick={handleAddExpRow} className="admin-btn-apply" style={{ marginTop: 8 }}>
              + Add Experience Record
            </button>

            <div className="admin-form-actions">
              <button className="admin-save-btn" onClick={handleSaveExp}>
                Save Experiences
              </button>
              <button className="admin-cancel-btn" onClick={() => setExpDoctor(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Achievement Modal */}
      {achDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setAchDoctor(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              Manage Achievements — Dr. {achDoctor.first_name} {achDoctor.last_name}
            </h3>

            {achList.map((ach, idx) => (
              <div
                key={ach.id || idx}
                style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 40px', gap: 10, marginBottom: 12 }}
              >
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Achievement / Award Title"
                  value={ach.title}
                  onChange={(e) => {
                    const updated = [...achList];
                    updated[idx].title = e.target.value;
                    setAchList(updated);
                  }}
                />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Organization"
                  value={ach.organization}
                  onChange={(e) => {
                    const updated = [...achList];
                    updated[idx].organization = e.target.value;
                    setAchList(updated);
                  }}
                />
                <input
                  type="number"
                  className="admin-input"
                  placeholder="Year"
                  value={ach.year}
                  onChange={(e) => {
                    const updated = [...achList];
                    updated[idx].year = e.target.value;
                    setAchList(updated);
                  }}
                />
                <button
                  type="button"
                  className="admin-action-btn-delete"
                  style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setAchList(achList.filter((_, i) => i !== idx))}
                >
                  ✕
                </button>
              </div>
            ))}

            <button onClick={handleAddAchRow} className="admin-btn-apply" style={{ marginTop: 8 }}>
              + Add Achievement Record
            </button>

            <div className="admin-form-actions">
              <button className="admin-save-btn" onClick={handleSaveAch}>
                Save Achievements
              </button>
              <button className="admin-cancel-btn" onClick={() => setAchDoctor(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Schedule Modal */}
      {schedDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setSchedDoctor(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 750 }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              Manage Weekly Schedule — Dr. {schedDoctor.first_name} {schedDoctor.last_name}
            </h3>

            {schedList.map((sc, idx) => (
              <div
                key={sc.id || idx}
                style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 1fr 1fr 40px', gap: 10, marginBottom: 12 }}
              >
                <select
                  className="admin-select"
                  value={sc.day}
                  onChange={(e) => {
                    const updated = [...schedList];
                    updated[idx].day = e.target.value;
                    setSchedList(updated);
                  }}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Start Time (09:00 AM)"
                  value={sc.start_time}
                  onChange={(e) => {
                    const updated = [...schedList];
                    updated[idx].start_time = e.target.value;
                    setSchedList(updated);
                  }}
                />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="End Time (01:00 PM)"
                  value={sc.end_time}
                  onChange={(e) => {
                    const updated = [...schedList];
                    updated[idx].end_time = e.target.value;
                    setSchedList(updated);
                  }}
                />
                <input
                  type="number"
                  className="admin-input"
                  placeholder="Slot Mins"
                  title="Slot Duration in Minutes (e.g. 15)"
                  value={sc.slot_duration || 15}
                  onChange={(e) => {
                    const updated = [...schedList];
                    updated[idx].slot_duration = parseInt(e.target.value) || 15;
                    setSchedList(updated);
                  }}
                />
                <input
                  type="number"
                  className="admin-input"
                  placeholder="Max Patients"
                  value={sc.max_patients}
                  onChange={(e) => {
                    const updated = [...schedList];
                    updated[idx].max_patients = parseInt(e.target.value) || 10;
                    setSchedList(updated);
                  }}
                />
                <button
                  type="button"
                  className="admin-action-btn-delete"
                  style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setSchedList(schedList.filter((_, i) => i !== idx))}
                >
                  ✕
                </button>
              </div>
            ))}

            <button onClick={handleAddSchedRow} className="admin-btn-apply" style={{ marginTop: 8 }}>
              + Add Schedule Slot
            </button>

            <div className="admin-form-actions">
              <button className="admin-save-btn" onClick={handleSaveSched}>
                Save Schedule
              </button>
              <button className="admin-cancel-btn" onClick={() => setSchedDoctor(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
