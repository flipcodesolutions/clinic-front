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

  // Pagination & Page Size Limit (City Master Style)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Exactly 3 fields state
  const [form, setForm] = useState({
    title: '',
    year: '',
    description: '',
  });

  const fetchAchievements = useCallback(async (filters = activeFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      const res = await getDoctorAchievements(params);
      if (res?.success && Array.isArray(res?.data)) {
        setAchievements(res.data);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      showError(error, 'Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleApplyFilter = () => {
    const filters = { search: search.trim() };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchAchievements(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setItemsPerPage(10);
    const filters = { search: '' };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchAchievements(filters);
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
        fetchAchievements(activeFilters);
      }
    } catch (error) {
      showError(error, 'Failed to delete achievement');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.year) {
      showError(null, 'Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        year: parseInt(form.year, 10),
        description: form.description,
      };

      if (editingId) {
        const res = await updateDoctorAchievement(editingId, payload);
        showSuccess(res?.message || 'Achievement updated successfully');
      } else {
        const res = await createDoctorAchievement(payload);
        showSuccess(res?.message || 'Achievement added successfully');
      }

      resetForm();
      fetchAchievements(activeFilters);
    } catch (error) {
      showError(error, 'Failed to save achievement');
    } finally {
      setSaving(false);
    }
  };

  const filteredAchievements = achievements.filter((ach) => {
    if (!activeFilters.search) return true;
    const term = activeFilters.search.toLowerCase();
    return (
      (ach.title || '').toLowerCase().includes(term) ||
      (ach.description || '').toLowerCase().includes(term) ||
      (ach.year ? String(ach.year) : '').includes(term)
    );
  });

  // Pagination Math
  const totalCount = filteredAchievements.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAchievements = filteredAchievements.slice(startIndex, startIndex + itemsPerPage);

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
                    min="1950"
                    max="2099"
                    className="admin-input"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="e.g. 2023"
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
        ) : filteredAchievements.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">No achievements added yet.</p>
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
                  {paginatedAchievements.map((ach) => (
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
