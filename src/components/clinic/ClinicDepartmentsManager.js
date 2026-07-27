'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  getClinicDepartments,
  assignDepartmentToClinic,
  removeDepartmentFromClinic,
  toggleClinicDepartmentStatus,
} from '@/services/clinicAdminService';
import { getDepartments } from '@/services/departmentService';
import apiClient from '@/services/apiClient';



const defaultFilters = {
  search: '',
  status: '',
  page: 1,
  limit: 10,
};

export default function ClinicDepartmentsManager() {
  const [assignedDepartments, setAssignedDepartments] = useState([]);
  const [globalDepartments, setGlobalDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Checkbox State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignIds, setSelectedAssignIds] = useState([]);
  const [modalSearch, setModalSearch] = useState('');



  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const loadDeptData = useCallback(async (filters = activeFilters) => {
    setLoading(true);
    const assigned = await getClinicDepartments(filters);
    const assignedList = Array.isArray(assigned) ? assigned : (assigned?.data || []);
    setAssignedDepartments(assignedList);
    if (assigned && !Array.isArray(assigned)) {
      setPagination({
        count: assigned.count ?? assignedList.length,
        currentPage: assigned.currentPage ?? 1,
        totalPages: assigned.totalPages ?? 1,
        limit: assigned.limit ?? filters.limit ?? 10,
      });
    }

    // Fetch master departments via clinic-authorized endpoint
    try {
      const globalRes = await apiClient.get('/clinic/master-departments', { params: { limit: 100 } }).catch(() => null);
      if (globalRes?.data?.success && Array.isArray(globalRes.data.data)) {
        setGlobalDepartments(globalRes.data.data);
      } else {
        setGlobalDepartments([]);
      }
    } catch (err) {
      console.error('Failed to load master departments', err);
      setGlobalDepartments([]);
    }
    setLoading(false);
  }, [activeFilters]);

  useEffect(() => {
    loadDeptData(defaultFilters);
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
      page: 1,
      limit: activeFilters.limit,
    };
    setActiveFilters(filters);
    loadDeptData(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters(defaultFilters);
    loadDeptData(defaultFilters);
  };

  const handleLimitChange = (limit) => {
    const filters = {
      ...activeFilters,
      page: 1,
      limit: Number(limit),
    };
    setActiveFilters(filters);
    loadDeptData(filters);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    const filters = {
      ...activeFilters,
      page,
    };
    setActiveFilters(filters);
    loadDeptData(filters);
  };

  // --- Assign Modal Handlers ---
  const handleOpenAssignModal = () => {
    setSelectedAssignIds([]);
    setModalSearch('');
    setShowAssignModal(true);
  };

  const availableDepartments = globalDepartments.filter(
    (gd) => !assignedDepartments.some((ad) => ad.id === gd.id || ad.name?.toLowerCase() === gd.name?.toLowerCase())
  );

  const filteredAvailable = availableDepartments.filter((d) => {
    const q = modalSearch.toLowerCase();
    return d.name.toLowerCase().includes(q) || (d.description && d.description.toLowerCase().includes(q));
  });

  const toggleSelectAllAssignModal = () => {
    if (selectedAssignIds.length === filteredAvailable.length && filteredAvailable.length > 0) {
      setSelectedAssignIds([]);
    } else {
      setSelectedAssignIds(filteredAvailable.map((d) => d.id));
    }
  };

  const toggleAssignSelection = (id) => {
    setSelectedAssignIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAssignDepartment = async (e) => {
    e.preventDefault();
    if (selectedAssignIds.length === 0) return;
    const res = await assignDepartmentToClinic({ department_ids: selectedAssignIds });
    if (!res.success) {
      alert(res.message);
    } else {
      setShowAssignModal(false);
      setSelectedAssignIds([]);
      loadDeptData();
    }
  };

  const handleRemoveDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department from your clinic?')) {
      await removeDepartmentFromClinic(id);
      loadDeptData();
    }
  };

  const toggleStatus = async (dept) => {
    const currentStatus = (dept.status || 'active').toLowerCase();
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const res = await toggleClinicDepartmentStatus(dept.id, newStatus);
    if (!res.success) {
      alert(res.message);
    } else {
      loadDeptData();
    }
  };

  return (
    <div className="clinic-departments-manager">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Clinic Departments</h1>
          <p className="clinic-subtitle">Assign medical specialties and departments available at your clinic.</p>
        </div>
        <button onClick={handleOpenAssignModal} className="clinic-btn clinic-btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Assign Departments
        </button>
      </div>

      {/* Filter & Bulk Actions Bar */}
      <div className="admin-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <input
          className="admin-search-input"
          placeholder="Search assigned specialties by name..."
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

      {/* Departments Table Card */}
      <div className="clinic-table-card">
        <div className="clinic-table-header">
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            🏢 Assigned Specialties ({assignedDepartments.length})
          </h3>
        </div>

        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading assigned departments...
                  </td>
                </tr>
              ) : assignedDepartments.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No departments assigned to this clinic yet. Click Assign Departments to add.
                  </td>
                </tr>
              ) : (
                assignedDepartments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>🏢</span>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{dept.name}</div>
                      </div>
                    </td>
                    <td style={{ color: '#475569', fontSize: 13 }}>{dept.description}</td>
                    <td>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        onClick={() => toggleStatus(dept)}
                        title="Click to toggle status"
                      >
                        <span className={`admin-badge ${(dept.status === 'active' || dept.status === 'Active') ? 'active' : 'inactive'}`}>
                          {(dept.status === 'active' || dept.status === 'Active') ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-action-btn-delete"
                        onClick={() => handleRemoveDepartment(dept.id)}
                        title="Delete Department"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && pagination.totalPages > 0 && (
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
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.count} total departments)
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

      {/* Bulk Assign Departments Modal */}
      {showAssignModal && (
        <div className="clinic-modal-overlay">
          <div className="clinic-modal" style={{ maxWidth: 580, width: '90%' }}>
            <div className="clinic-modal-header">
              <div>
                <h3 className="clinic-modal-title">Assign Departments to Clinic</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Select multiple medical specialties to add to your clinic at once.
                </p>
              </div>
              <button className="clinic-modal-close" onClick={() => setShowAssignModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAssignDepartment}>
              <div className="clinic-modal-body">
                {availableDepartments.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', margin: '20px 0' }}>
                    All available system departments are already assigned to this clinic.
                  </p>
                ) : (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <input
                        className="admin-search-input"
                        style={{ width: '100%' }}
                        placeholder="Search available departments by name or description..."
                        value={modalSearch}
                        onChange={(e) => setModalSearch(e.target.value)}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 10,
                        padding: '8px 12px',
                        background: '#f8fafc',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#334155' }}>
                        <input
                          type="checkbox"
                          checked={selectedAssignIds.length === filteredAvailable.length && filteredAvailable.length > 0}
                          onChange={toggleSelectAllAssignModal}
                          style={{ cursor: 'pointer', width: 16, height: 16 }}
                        />
                        Select All ({filteredAvailable.length})
                      </label>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb' }}>
                        {selectedAssignIds.length} Selected
                      </span>
                    </div>

                    <div style={{ maxHeight: 280, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
                      {filteredAvailable.length === 0 ? (
                        <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                          No matching departments found.
                        </div>
                      ) : (
                        filteredAvailable.map((dept) => {
                          const isChecked = selectedAssignIds.includes(dept.id);
                          return (
                            <div
                              key={dept.id}
                              onClick={() => toggleAssignSelection(dept.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                borderRadius: 6,
                                cursor: 'pointer',
                                background: isChecked ? '#eff6ff' : 'transparent',
                                border: isChecked ? '1px solid #bfdbfe' : '1px solid transparent',
                                marginBottom: 4,
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                style={{ width: 18, height: 18, cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: 20 }}>🏢</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{dept.name}</div>
                                {dept.description && (
                                  <div style={{ fontSize: 12, color: '#64748b' }}>{dept.description}</div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="clinic-modal-footer">
                <button
                  type="button"
                  className="clinic-btn clinic-btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                {availableDepartments.length > 0 && (
                  <button
                    type="submit"
                    className="clinic-btn clinic-btn-primary"
                    disabled={selectedAssignIds.length === 0}
                  >
                    Assign Selected ({selectedAssignIds.length})
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
