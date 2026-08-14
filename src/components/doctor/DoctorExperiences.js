'use client';
import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  getDoctorExperiences,
  createDoctorExperience,
  updateDoctorExperience,
  deleteDoctorExperience,
} from '@/services/doctor/experienceService';
import { showError, showSuccess } from '@/utils/toast';

const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DoctorExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({ search: '' });

  // Pagination & Page Size Limit State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [form, setForm] = useState({
    hospital_name: '',
    designation: '',
    start_date: '',
    end_date: '',
    currently_working: false,
    description: '',
  });

  const fetchExperiences = useCallback(async (filters = activeFilters, page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };
      if (filters.search) params.search = filters.search;
      const res = await getDoctorExperiences(params);
      if (res?.success && Array.isArray(res?.data)) {
        setExperiences(res.data);
        const count = res.count !== undefined ? res.count : res.data.length;
        setTotalCount(count);
        setTotalPages(res.totalPages !== undefined ? res.totalPages : (Math.ceil(count / limit) || 1));
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      showError(error, 'Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  }, [activeFilters, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchExperiences(activeFilters, currentPage, itemsPerPage);
  }, [fetchExperiences, activeFilters, currentPage, itemsPerPage]);

  const handleApplyFilter = () => {
    const filters = { search: search.trim() };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchExperiences(filters, 1, itemsPerPage);
  };

  const handleResetFilter = () => {
    setSearch('');
    setItemsPerPage(10);
    const filters = { search: '' };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchExperiences(filters, 1, 10);
  };

  const resetForm = () => {
    setForm({
      hospital_name: '',
      designation: '',
      start_date: '',
      end_date: '',
      currently_working: false,
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setForm({
      hospital_name: exp.hospital_name || '',
      designation: exp.designation || '',
      start_date: exp.start_date ? exp.start_date.split('T')[0] : '',
      end_date: exp.end_date ? exp.end_date.split('T')[0] : '',
      currently_working: !exp.end_date,
      description: exp.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (exp) => {
    const result = await Swal.fire({
      title: 'Delete Experience?',
      text: `"${exp.hospital_name} - ${exp.designation}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteDoctorExperience(exp.id);
      if (res?.success) {
        showSuccess(res.message || 'Experience deleted successfully');
        fetchExperiences(activeFilters, currentPage, itemsPerPage);
      }
    } catch (error) {
      showError(error, 'Failed to delete experience');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hospitalNameTrimmed = form.hospital_name.trim();
    const designationTrimmed = form.designation.trim();

    if (!hospitalNameTrimmed) {
      showError(null, 'Hospital/Clinic name is required');
      return;
    }
    if (hospitalNameTrimmed.length > 150) {
      showError(null, 'Hospital name cannot exceed 150 characters');
      return;
    }

    if (!designationTrimmed) {
      showError(null, 'Designation is required');
      return;
    }
    if (designationTrimmed.length > 100) {
      showError(null, 'Designation cannot exceed 100 characters');
      return;
    }

    const todayStr = getTodayStr();

    if (!form.start_date) {
      showError(null, 'Start date is required');
      return;
    }

    if (form.start_date > todayStr) {
      showError(null, 'Start date cannot be a future date');
      return;
    }

    if (!form.currently_working && form.end_date) {
      if (form.end_date > todayStr) {
        showError(null, 'End date cannot be a future date');
        return;
      }
      if (form.end_date < form.start_date) {
        showError(null, 'End date cannot be earlier than start date');
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        hospital_name: hospitalNameTrimmed,
        designation: designationTrimmed,
        start_date: form.start_date,
        end_date: form.currently_working ? null : form.end_date || null,
        description: form.description ? form.description.trim() : '',
      };

      if (editingId) {
        const res = await updateDoctorExperience(editingId, payload);
        showSuccess(res?.message || 'Experience updated successfully');
      } else {
        const res = await createDoctorExperience(payload);
        showSuccess(res?.message || 'Experience added successfully');
      }

      resetForm();
      fetchExperiences(activeFilters, currentPage, itemsPerPage);
    } catch (error) {
      showError(error, 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  
  const displayedExperiences = experiences;

  return (
    <div className="doc-experiences">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Doctor Experiences</h1>
          <p className="admin-subtitle">Manage your medical practice, clinic work, and hospital history</p>
        </div>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add Experience
        </button>
      </div>

      {/*  Filter Bar with Items Per Page Dropdown pagination */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search experience by hospital or designation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
        <button type="button" className="admin-btn-apply" onClick={handleApplyFilter}>
          Apply Filter
        </button>
        <button type="button" className="admin-btn-reset" onClick={handleResetFilter}>
          Reset
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="admin-modal-backdrop" onClick={resetForm}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingId ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button type="button" className="admin-modal-close" onClick={resetForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                {/* 1. Hospital / Clinic Name */}
                <div>
                  <label className="admin-form-label">
                    Hospital / Clinic Name *
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.hospital_name}
                    onChange={(e) => setForm({ ...form, hospital_name: e.target.value })}
                    placeholder="e.g. City General Hospital"
                    required
                  />
                </div>

                {/* 2. Designation */}
                <div>
                  <label className="admin-form-label">
                    Designation *
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Senior Cardiologist"
                    required
                  />
                </div>

                {/* 3. Start Date */}
                <div>
                  <label className="admin-form-label">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    max={getTodayStr()}
                    className="admin-input"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    required
                  />
                </div>

                {/* 4. End Date */}
                <div>
                  <label className="admin-form-label">End Date</label>
                  <input
                    type="date"
                    min={form.start_date || undefined}
                    max={getTodayStr()}
                    className="admin-input"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    disabled={form.currently_working}
                  />
                </div>

                {/* 5. Currently Working Here */}
                <div className="admin-form-full">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.currently_working}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          currently_working: e.target.checked,
                          end_date: e.target.checked ? '' : form.end_date,
                        })
                      }
                      className="admin-checkbox-input"
                    />
                    <span>Currently Working Here (Present Job)</span>
                  </label>
                </div>

                {/* 6. Description */}
                <div className="admin-form-full">
                  <label className="admin-form-label">Description / Responsibilities</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Key responsibilities, clinical achievements, or procedures performed..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Experience' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience List Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">Loading Experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">No experiences found.</p>
          </div>
        ) : (
          <div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hospital / Clinic</th>
                    <th>Designation</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th className="admin-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((exp) => {
                    const startDate = exp.start_date ? exp.start_date.split('T')[0] : 'N/A';
                    const endDate = exp.end_date ? exp.end_date.split('T')[0] : 'Present';

                    return (
                      <tr key={exp.id}>
                        <td className="admin-font-bold">{exp.hospital_name}</td>
                        <td>{exp.designation}</td>
                        <td>
                          <span className="admin-badge active admin-badge-sm">
                            {startDate}  To  {endDate}
                          </span>
                        </td>
                        <td>
                          {exp.description || '-'}
                        </td>
                        <td className="admin-text-right">
                          <div className="admin-table-actions-cell">
                            <button
                              type="button"
                              className="admin-action-btn-edit"
                              onClick={() => handleEdit(exp)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn-delete"
                              onClick={() => handleDelete(exp)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/*Pagination */}
            {totalPages > 0 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing page {currentPage} of {totalPages} ({totalCount} total experiences)
                </span>npm run dev 
                <div className="admin-pagination-actions">
                  <button
                    type="button"
                    className="admin-btn-reset"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="admin-btn-apply"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
