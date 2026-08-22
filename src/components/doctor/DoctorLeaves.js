'use client';
import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  getDoctorLeaves,
  createDoctorLeave,
  deleteDoctorLeave,
} from '@/services/doctor/leaveService';
import { showError, showSuccess } from '@/utils/toast';

export default function DoctorLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({ search: '', status: '' });

  // Pagination & Page Size Limit (City Master Style)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Exactly 3 fields state
  const [form, setForm] = useState({
    from_date: '',
    to_date: '',
    reason: '',
  });

  const fetchLeaves = useCallback(async (filters = activeFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const res = await getDoctorLeaves(params);
      if (res?.success && Array.isArray(res?.data)) {
        setLeaves(res.data);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      showError(error, 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleApplyFilter = () => {
    const filters = { search: search.trim(), status: statusFilter };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchLeaves(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setItemsPerPage(10);
    const filters = { search: '', status: '' };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchLeaves(filters);
  };

  const resetForm = () => {
    setForm({
      from_date: '',
      to_date: '',
      reason: '',
    });
    setShowForm(false);
  };

  const handleDelete = async (l) => {
    const result = await Swal.fire({
      title: 'Cancel Leave Request?',
      text: `Leave request from ${l.from_date} to ${l.to_date} will be cancelled.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteDoctorLeave(l.id);
      if (res?.success) {
        showSuccess(res.message || 'Leave request cancelled');
        fetchLeaves(activeFilters);
      }
    } catch (error) {
      showError(error, 'Failed to cancel leave request');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.from_date || !form.to_date || !form.reason) {
      showError(null, 'Please fill all required fields');
      return;
    }

    if (new Date(form.to_date) < new Date(form.from_date)) {
      showError(null, 'To Date cannot be earlier than From Date');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        from_date: form.from_date,
        to_date: form.to_date,
        reason: form.reason,
      };

      const res = await createDoctorLeave(payload);
      if (res?.success) {
        showSuccess('Leave request submitted successfully for Clinic Admin approval');
        resetForm();
        fetchLeaves(activeFilters);
      }
    } catch (error) {
      showError(error, 'Failed to submit leave request');
    } finally {
      setSaving(false);
    }
  };

  const calculateDays = (fromStr, toStr) => {
    if (!fromStr || !toStr) return 1;
    const start = new Date(fromStr);
    const end = new Date(toStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const getStatusBadge = (st) => {
    switch ((st || '').toLowerCase()) {
      case 'approved':
        return <span className="admin-badge active">Approved</span>;
      case 'rejected':
        return <span className="admin-badge inactive">Rejected</span>;
      case 'pending':
      default:
        return <span className="admin-badge pending">Pending Approval</span>;
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const statusMatch = !activeFilters.status
      ? true
      : (l.status || '').toLowerCase() === activeFilters.status.toLowerCase();
    
    const reasonText = (l.reason || '').toLowerCase();
    const dateText = `${l.from_date || ''} ${l.to_date || ''}`.toLowerCase();
    const searchMatch = !activeFilters.search
      ? true
      : reasonText.includes(activeFilters.search.toLowerCase()) ||
        dateText.includes(activeFilters.search.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Pagination Math
  const totalCount = filteredLeaves.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaves = filteredLeaves.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="doc-leaves">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Doctor Leave Requests</h1>
          <p className="admin-subtitle">Apply for leave and track approval status from Clinic Administration</p>
        </div>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
           Apply For Leave
        </button>
      </div>

      {/*Filter Bar with Items Per Page Dropdown */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by reason or date..."
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
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
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

      {/*Add Leave Request Modal */}
      {showForm && (
        <div className="admin-modal-backdrop" onClick={resetForm}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                New Leave Application
              </h3>
              <button type="button" className="admin-modal-close" onClick={resetForm}>
                X
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                {/* 1. From Date */}
                <div>
                  <label className="admin-form-label">
                    From Date *
                  </label>
                  <input
                    type="date"
                    className="admin-input"
                    value={form.from_date}
                    onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                    required
                  />
                </div>

                {/* 2. To Date */}
                <div>
                  <label className="admin-form-label">
                    To Date *
                  </label>
                  <input
                    type="date"
                    className="admin-input"
                    value={form.to_date}
                    onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                    required
                  />
                </div>

                {/* 3. Reason */}
                <div className="admin-form-full">
                  <label className="admin-form-label">
                    Reason *
                  </label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Provide a clear reason for your leave application..."
                    required
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
                  {saving ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Requests History Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">Loading Leave Applications...</p>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">No leave applications found.</p>
          </div>
        ) : (
          <div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th className="admin-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeaves.map((l) => {
                    const numDays = calculateDays(l.from_date, l.to_date);

                    return (
                      <tr key={l.id}>
                        <td className="admin-font-bold">{l.from_date}</td>
                        <td className="admin-font-bold">{l.to_date}</td>
                        <td>{numDays} {numDays === 1 ? 'Day' : 'Days'}</td>
                        <td>
                          {l.reason || '-'}
                        </td>
                        <td>{getStatusBadge(l.status)}</td>
                        <td className="admin-text-right">
                          {l.status === 'pending' && (
                            <button
                              type="button"
                              className="admin-action-btn-delete"
                              onClick={() => handleDelete(l)}
                            >
                              Cancel Request
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/*  Pagination */}
            {totalPages > 0 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing page {currentPage} of {totalPages} ({totalCount} total leave applications)
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
