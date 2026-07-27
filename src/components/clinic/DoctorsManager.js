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
import { getClinics } from '@/services/clinicService';
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

function formatLanguages(val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    const items = val.flatMap((item) => formatLanguages(item));
    return items.filter(Boolean).join(', ');
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{') || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return formatLanguages(parsed);
      } catch (e) {
        return trimmed;
      }
    }
    return trimmed;
  }
  return String(val);
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

  const selectedDept = departments.find((d) => String(d.id) === String(value));
  const displayLabel = selectedDept ? selectedDept.name : '';

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

  return (
    <div ref={wrapperRef} className="clinic-search-select-wrap">
      <div className="clinic-search-select-box">
        <input
          type="text"
          className="admin-input"
          placeholder="Select Department..."
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
            <span>🏢</span>
            <span>Select Department</span>
          </div>
          {filtered.length === 0 ? (
            <div className="clinic-search-select-no-results">
              No matching department found
            </div>
          ) : (
            filtered.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  onChange(dept.id);
                  setIsOpen(false);
                }}
                className={`clinic-search-select-item ${String(value) === String(dept.id) ? 'selected' : ''}`}
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

export default function DoctorsManager() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clinics, setClinics] = useState([]);
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

  // Form State (Exact 17 Fields)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    photo_url: '',
    registration_no: '',
    qualification: '',
    specialty: '',
    experience_years: 0,
    consultation_fee: 0,
    bio: '',
    languages: '',
    gender: 'male',
    dob: '',
    department_id: '',
    clinic_id: '',
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

      // Load Clinics dynamically
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

      // Load strictly Assigned Clinic Departments dynamically
      try {
        const assignedRes = await getClinicDepartments({ limit: 100 }).catch(() => null);
        const assignedList = assignedRes?.data || (Array.isArray(assignedRes) ? assignedRes : []);
        const activeAssigned = assignedList.filter(
          (d) => !d.status || d.status.toLowerCase() === 'active'
        );
        setDepartments(activeAssigned);
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
    Promise.resolve().then(() => {
      loadDoctorsList(defaultFilters);
    });
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
        console.warn('Direct upload API failed, using base64 preview fallback:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Modal Handlers
  const openAddModal = () => {
    setEditingDoctor(null);
    setFormError('');
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      photo_url: '',
      registration_no: '',
      qualification: '',
      specialty: '',
      experience_years: 0,
      consultation_fee: 0,
      bio: '',
      languages: '',
      gender: 'male',
      dob: '',
      department_id: '',
      clinic_id: '',
      status: 'active',
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
      password: '',
      photo_url: doc.photo_url || '',
      registration_no: doc.registration_no || '',
      qualification: doc.qualification || '',
      specialty: doc.specialty || '',
      experience_years: doc.experience_years || 0,
      consultation_fee: doc.consultation_fee || 0,
      bio: doc.bio || '',
      languages: formatLanguages(doc.languages),
      gender: doc.gender || 'male',
      dob: doc.dob || '',
      department_id: doc.department_id || (departments.length > 0 ? departments[0].id : ''),
      clinic_id: doc.clinic_id || (clinics.length > 0 ? clinics[0].id : ''),
      status: (doc.status || 'active').toLowerCase(),
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

    const cleanPhone = String(formData.phone).replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Mobile number must be exactly 10 digits.');
      return;
    }

    if (!editingDoctor && (!formData.password || formData.password.trim().length < 6)) {
      setFormError('Password is required (minimum 6 characters).');
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
    const formattedExps = (doc.experiences || []).map((e) => ({
      id: e.id || Date.now() + Math.random(),
      hospital_name: e.hospital_name || e.hospital || '',
      designation: e.designation || '',
      start_date: e.start_date || e.startDate || '',
      end_date: e.end_date || e.endDate || '',
      description: e.description || '',
    }));
    setExpList(formattedExps);
    setOpenActionRowId(null);
  };

  const handleAddExpRow = () => {
    setExpList([
      ...expList,
      { id: Date.now(), hospital_name: '', designation: '', start_date: '', end_date: '', description: '' },
    ]);
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
    const formattedAch = (doc.achievements || []).map((a) => ({
      id: a.id || Date.now() + Math.random(),
      title: a.title || '',
      organization: a.organization || a.description || '',
      year: a.year || new Date().getFullYear(),
    }));
    setAchList(formattedAch);
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
    const formattedSched = (doc.schedules || []).map((s) => ({
      id: s.id || Date.now() + Math.random(),
      day: s.day ? s.day : (s.day_of_week ? s.day_of_week.charAt(0).toUpperCase() + s.day_of_week.slice(1) : 'Monday'),
      start_time: s.start_time || '09:00 AM',
      end_time: s.end_time || '05:00 PM',
      slot_duration: s.slot_duration || 15,
      max_patients: s.max_patients || s.maximum_booking || 10,
    }));
    setSchedList(formattedSched);
    setOpenActionRowId(null);
  };

  const handleAddSchedRow = () => {
    setSchedList([
      ...schedList,
      { id: Date.now(), day: 'Monday', start_time: '09:00 AM', end_time: '05:00 PM', slot_duration: 15, max_patients: 10 },
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
                          <div className="doctor-avatar-box">
                            {doc.photo_url ? (
                              <img
                                src={formatImageUrl(doc.photo_url)}
                                alt={doc.first_name}
                                className="doctor-avatar-img"
                              />
                            ) : (
                              <div className="doctor-avatar-initials">
                                {doc.first_name ? doc.first_name.charAt(0).toUpperCase() : 'D'}
                              </div>
                            )}
                            <button
                              onClick={() => openPhotoModal(doc)}
                              title="Upload / Change Photo"
                              className="doctor-photo-btn"
                            >
                              📷
                            </button>
                          </div>
                          <div className="doctor-info-box">
                            <div className="doctor-info-name">
                              Dr. {doc.first_name} {doc.last_name}
                            </div>
                            <div className="doctor-info-sub">{doc.email}</div>
                            <div className="doctor-info-sub">{doc.phone}</div>
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
                        <div className="admin-action-menu-wrap">
                          <button
                            onClick={() => setOpenActionRowId(isActionOpen ? null : doc.id)}
                            className={`admin-action-trigger-btn ${isActionOpen ? 'active' : ''}`}
                            title="Actions Menu"
                          >
                            ⋮
                          </button>

                          {/* Action Menu Popover showing all buttons in one horizontal line */}
                          {isActionOpen && (
                            <div className="admin-action-popover">
                              <button
                                onClick={() => {
                                  setViewDoctor(doc);
                                  setOpenActionRowId(null);
                                }}
                                className="admin-action-btn-view"
                                title="View Details"
                              >
                                👁️ View
                              </button>
                              <button
                                onClick={() => openEditModal(doc)}
                                className="admin-action-btn-edit"
                                title="Edit Profile"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => openExpModal(doc)}
                                className="admin-btn-apply"
                                title="Manage Experience"
                              >
                                🏥 Exp
                              </button>
                              <button
                                onClick={() => openAchModal(doc)}
                                className="admin-btn-apply"
                                title="Manage Achievements"
                              >
                                🏆 Ach
                              </button>
                              <button
                                onClick={() => openSchedModal(doc)}
                                className="admin-btn-apply"
                                title="Manage Schedule"
                              >
                                🕒 Sched
                              </button>
                              <button
                                onClick={() => handleDeleteDoctor(doc)}
                                className="admin-action-btn-delete"
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
          <div className="admin-pagination-footer">
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

      {/* Add / Edit Doctor Modal (Strict 17 Fields) */}
      {showDoctorModal && (
        <div className="admin-modal-backdrop" onClick={() => !saving && setShowDoctorModal(false)}>
          <div className="admin-modal-card admin-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
            </h3>

            <form onSubmit={handleSaveDoctor}>
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
                    placeholder="doctor@example.com"
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
                    Password {editingDoctor ? '(Leave blank to keep unchanged)' : '*'}
                  </label>
                  <input
                    type="password"
                    className="admin-input"
                    required={!editingDoctor}
                    placeholder={editingDoctor ? '••••••••' : 'Enter login password'}
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

                {/* Registration No */}
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

                {/* Qualification */}
                <div>
                  <label className="admin-form-label">Qualification</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. MBBS, MD (Cardiology)"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="admin-form-label">Specialization</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Cardiologist, Neurologist, Pediatrician"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>

                {/* Experience Years */}
                <div>
                  <label className="admin-form-label">Experience (Years)</label>
                  <input
                    type="number"
                    className="admin-input"
                    min="0"
                    placeholder="e.g. 5"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="admin-form-label">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    className="admin-input"
                    min="0"
                    placeholder="e.g. 500"
                    value={formData.consultation_fee}
                    onChange={(e) => setFormData({ ...formData, consultation_fee: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                {/* Languages */}
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

                {/* Gender */}
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

                {/* Date of Birth */}
                <div>
                  <label className="admin-form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="admin-form-label">Department</label>
                  <SearchableDepartmentSelect
                    departments={departments}
                    value={formData.department_id}
                    onChange={(val) => setFormData({ ...formData, department_id: val })}
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

                {/* Bio */}
                <div className="admin-form-full">
                  <label className="admin-form-label">Doctor Bio</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    placeholder="Brief description, background summary..."
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
          <div className="admin-modal-card admin-modal-card-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Doctor Profile Details</h3>

            <div className="doctor-view-header">
              {viewDoctor.photo_url ? (
                <img
                  src={formatImageUrl(viewDoctor.photo_url)}
                  alt={viewDoctor.first_name}
                  className="doctor-view-avatar-img"
                />
              ) : (
                <div className="doctor-view-avatar-initials">
                  {viewDoctor.first_name ? viewDoctor.first_name.charAt(0).toUpperCase() : 'D'}
                </div>
              )}
              <div>
                <h3 className="doctor-view-title">
                  Dr. {viewDoctor.first_name} {viewDoctor.last_name}
                </h3>
                <p className="doctor-view-specialty">{viewDoctor.specialty || 'N/A'}</p>
                <p className="doctor-view-qualification">{viewDoctor.qualification || 'N/A'}</p>
              </div>
            </div>

            <div className="doctor-view-profile-grid">
              <div><strong>First Name:</strong> {viewDoctor.first_name}</div>
              <div><strong>Last Name:</strong> {viewDoctor.last_name}</div>
              <div><strong>Email:</strong> {viewDoctor.email}</div>
              <div><strong>Mobile:</strong> {viewDoctor.phone || '—'}</div>
              <div><strong>Registration No:</strong> {viewDoctor.registration_no || 'N/A'}</div>
              <div><strong>Qualification:</strong> {viewDoctor.qualification || 'N/A'}</div>
              <div><strong>Specialization:</strong> {viewDoctor.specialty || 'N/A'}</div>
              <div><strong>Experience:</strong> {viewDoctor.experience_years} Years</div>
              <div><strong>Consultation Fee:</strong> ₹{viewDoctor.consultation_fee || 0}</div>
              <div><strong>Languages:</strong> {formatLanguages(viewDoctor.languages) || 'N/A'}</div>
              <div><strong>Gender:</strong> {viewDoctor.gender ? viewDoctor.gender.toUpperCase() : 'N/A'}</div>
              <div><strong>Date of Birth:</strong> {viewDoctor.dob || 'N/A'}</div>
              <div><strong>Status:</strong> {formatStatus(viewDoctor.status)}</div>
            </div>

            {viewDoctor.bio && (
              <div className="doctor-view-bio-box">
                <strong>Bio:</strong>
                <p className="doctor-view-bio-text">{viewDoctor.bio}</p>
              </div>
            )}

            <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />
            <h4 style={{ margin: '0 0 10px 0', fontSize: 15 }}>Past Experiences</h4>
            {viewDoctor.experiences?.length > 0 ? (
              <ul>
                {viewDoctor.experiences.map((exp, i) => (
                  <li key={i} className="doctor-view-exp-item">
                    <strong>{exp.designation ? `${exp.designation} — ` : ''}{exp.hospital_name || exp.hospital || 'Hospital'}</strong>
                    <div><small className="doctor-view-exp-period">Period: {exp.start_date || 'N/A'} to {exp.end_date || 'Present'}</small></div>
                    {exp.description && <div className="doctor-view-exp-desc">{exp.description}</div>}
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
          <div className="admin-modal-card admin-modal-card-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Update Doctor Photo</h3>

            <div className="photo-modal-preview-box">
              {photoPreview || photoUrlInput ? (
                <img
                  src={formatImageUrl(photoPreview || photoUrlInput)}
                  alt="Doctor Photo Preview"
                  className="photo-modal-preview-img"
                />
              ) : (
                <div className="photo-modal-preview-initials">
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

      {/* Manage Experience Modal (`DoctorExperience` Table Schema) */}
      {expDoctor && (
        <div className="admin-modal-backdrop" onClick={() => setExpDoctor(null)}>
          <div className="admin-modal-card admin-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              Manage Doctor Experience — Dr. {expDoctor.first_name} {expDoctor.last_name}
            </h3>

            {expList.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>No experience records added yet. Click below to add.</p>
            ) : (
              expList.map((exp, idx) => (
                <div key={exp.id || idx} className="exp-row-card">
                  <div className="exp-row-grid">
                    <div>
                      <label className="exp-row-label">Hospital Name *</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Hospital Name"
                        value={exp.hospital_name}
                        onChange={(e) => {
                          const updated = [...expList];
                          updated[idx].hospital_name = e.target.value;
                          setExpList(updated);
                        }}
                      />
                    </div>

                    <div>
                      <label className="exp-row-label">Designation</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Designation"
                        value={exp.designation}
                        onChange={(e) => {
                          const updated = [...expList];
                          updated[idx].designation = e.target.value;
                          setExpList(updated);
                        }}
                      />
                    </div>

                    <div>
                      <label className="exp-row-label">Start Date</label>
                      <input
                        type="date"
                        className="admin-input"
                        value={exp.start_date}
                        onChange={(e) => {
                          const updated = [...expList];
                          updated[idx].start_date = e.target.value;
                          setExpList(updated);
                        }}
                      />
                    </div>

                    <div>
                      <label className="exp-row-label">End Date</label>
                      <input
                        type="date"
                        className="admin-input"
                        value={exp.end_date}
                        onChange={(e) => {
                          const updated = [...expList];
                          updated[idx].end_date = e.target.value;
                          setExpList(updated);
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label className="exp-row-label">Description</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Key responsibilities, department, achievements..."
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...expList];
                          updated[idx].description = e.target.value;
                          setExpList(updated);
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="admin-action-btn-delete exp-row-remove-btn"
                      title="Remove experience"
                      onClick={() => setExpList(expList.filter((_, i) => i !== idx))}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}

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
          <div className="admin-modal-card admin-modal-card-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              Manage Achievements — Dr. {achDoctor.first_name} {achDoctor.last_name}
            </h3>

            {achList.map((ach, idx) => (
              <div key={ach.id || idx} className="ach-row-grid">
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
                  className="admin-action-btn-delete row-delete-icon-btn"
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
          <div className="admin-modal-card admin-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              Manage Weekly Schedule — Dr. {schedDoctor.first_name} {schedDoctor.last_name}
            </h3>

            {schedList.map((sc, idx) => (
              <div key={sc.id || idx} className="sched-row-grid">
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
                  className="admin-action-btn-delete row-delete-icon-btn"
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
