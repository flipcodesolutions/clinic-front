'use client';
import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  getDoctorAchievements,
  createDoctorAchievement,
  updateDoctorAchievement,
  deleteDoctorAchievement,
} from '@/services/doctor/achievementService';
import { showError, showSuccess } from '@/utils/toast';

export default function DoctorAchievements() {
  const [achievements, setAchievements] = useState([]);
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
    title: '',
    year: '',
    description: '',
  });

  const fetchAchievements = useCallback(async (filters = activeFilters, page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };
      if (filters.search) params.search = filters.search;
      const res = await getDoctorAchievements(params);
      if (res?.success && Array.isArray(res?.data)) {
        setAchievements(res.data);
        const count = res.count !== undefined ? res.count : res.data.length;
        setTotalCount(count);
        setTotalPages(res.totalPages !== undefined ? res.totalPages : (Math.ceil(count / limit) || 1));
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      showError(error, 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  }, [activeFilters, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAchievements(activeFilters, currentPage, itemsPerPage);
  }, [fetchAchievements, activeFilters, currentPage, itemsPerPage]);

  const handleApplyFilter = () => {
    const filters = { search: search.trim() };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchAchievements(filters, 1, itemsPerPage);
  };

  const handleResetFilter = () => {
    setSearch('');
    setItemsPerPage(10);
    const filters = { search: '' };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchAchievements(filters, 1, 10);
  };

  const resetForm = () => {
    setForm({
      title: '',
      year: '',
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (ach) => {
    setEditingId(ach.id);
    setForm({
      title: ach.title || '',
      year: ach.year !== undefined ? String(ach.year) : '',
      description: ach.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (ach) => {
    const result = await Swal.fire({
      title: 'Delete Achievement?',
      text: `"${ach.title}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteDoctorAchievement(ach.id);
      if (res?.success) {
        showSuccess(res.message || 'Achievement deleted successfully');
        fetchAchievements(activeFilters, currentPage, itemsPerPage);
      }
    } catch (error) {
      showError(error, 'Failed to delete achievement');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const titleTrimmed = form.title.trim();
    const parsedYear = parseInt(form.year, 10);

    if (!titleTrimmed) {
      showError(null, 'Achievement Title is required');
      return;
    }
    if (titleTrimmed.length > 150) {
      showError(null, 'Title cannot exceed 150 characters');
      return;
    }
    if (!form.year) {
      showError(null, 'Year is required');
      return;
    }
    const currentYear = new Date().getFullYear();
    if (isNaN(parsedYear) || parsedYear <= 0) {
      showError(null, 'Please enter a valid year');
      return;
    }
    if (parsedYear > currentYear) {
      showError(null, `Year cannot be in the future (Maximum allowed year is ${currentYear})`);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: titleTrimmed,
        year: parsedYear,
        description: form.description ? form.description.trim() : '',
      };

      if (editingId) {
        const res = await updateDoctorAchievement(editingId, payload);
        showSuccess(res?.message || 'Achievement updated successfully');
      } else {
        const res = await createDoctorAchievement(payload);
        showSuccess(res?.message || 'Achievement added successfully');
      }

      resetForm();
      fetchAchievements(activeFilters, currentPage, itemsPerPage);
    } catch (error) {
      showError(error, 'Failed to save achievement');
    } finally {
      setSaving(false);
    }
  };

  // Data returned from backend is already filtered & paginated
  const displayedAchievements = achievements;

  return (
    <div className="doc-achievements">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Doctor Achievements</h1>
          <p className="admin-subtitle">Manage your awards, honors, and professional achievements</p>
        </div>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Achievement
        </button>
      </div>

      {/* City Master Style Filter Bar with Items Per Page Dropdown */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search achievements by title, year, or description..."
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

      {/* City Master Style Add / Edit Modal */}
      {showForm && (
        <div className="admin-modal-backdrop" onClick={resetForm}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingId ? 'Edit Achievement' : 'Add New Achievement'}
              </h3>
              <button type="button" className="admin-modal-close" onClick={resetForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                {/*Achievement Title */}
                <div>
                  <label className="admin-form-label">
                    Achievement Title *
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Best Doctor Award / Gold Medalist"
                    required
                  />
                </div>

                {/*Year */}
                <div>
                  <label className="admin-form-label">
                    Year *
                  </label>
                  <input
                    type="number"
                    max={new Date().getFullYear()}
                    className="admin-input"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder={`e.g. ${new Date().getFullYear()}`}
                    required
                  />
                </div>

                {/*Description */}
                <div className="admin-form-full">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Write a brief description of the achievement..."
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
                  {saving ? 'Saving...' : editingId ? 'Update Achievement' : 'Save Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievement List Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">Loading Achievements...</p>
          </div>
        ) : achievements.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">No achievements found.</p>
          </div>
        ) : (
          <div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Achievement Title</th>
                    <th>Year</th>
                    <th>Description</th>
                    <th className="admin-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((ach) => (
                    <tr key={ach.id}>
                      <td className="admin-font-bold">{ach.title}</td>
                      <td>
                        <span className="admin-badge active admin-badge-sm">
                          {ach.year}
                        </span>
                      </td>
                      <td>
                        {ach.description || '-'}
                      </td>
                      <td className="admin-text-right">
                        <div className="admin-table-actions-cell">
                          <button
                            type="button"
                            className="admin-action-btn-edit"
                            onClick={() => handleEdit(ach)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn-delete"
                            onClick={() => handleDelete(ach)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* City Master Style Pagination */}
            {totalPages > 0 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing page {currentPage} of {totalPages} ({totalCount} total achievements)
                </span>
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
