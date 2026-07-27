'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  getClinicServices,
  assignServiceToClinic,
  removeServiceFromClinic,
  toggleClinicServiceStatus,
} from '@/services/clinicAdminService';
import apiClient from '@/services/apiClient';

const defaultFilters = {
  search: '',
  status: '',
  page: 1,
  limit: 10,
};

export default function ClinicServicesManager() {
  const [assignedServices, setAssignedServices] = useState([]);
  const [globalServices, setGlobalServices] = useState([]);
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

  const loadServicesData = useCallback(async (filters = activeFilters) => {
    setLoading(true);
    const assigned = await getClinicServices(filters);
    const assignedList = Array.isArray(assigned) ? assigned : (assigned?.data || []);
    setAssignedServices(assignedList);
    if (assigned && !Array.isArray(assigned)) {
      setPagination({
        count: assigned.count ?? assignedList.length,
        currentPage: assigned.currentPage ?? 1,
        totalPages: assigned.totalPages ?? 1,
        limit: assigned.limit ?? filters.limit ?? 10,
      });
    }

    // Fetch master services via clinic-authorized endpoint
    try {
      const globalRes = await apiClient.get('/clinic/master-services', { params: { limit: 100 } }).catch(() => null);
      if (globalRes?.data?.success && Array.isArray(globalRes.data.data)) {
        setGlobalServices(globalRes.data.data);
      } else {
        setGlobalServices([]);
      }
    } catch (err) {
      console.error('Failed to load master services', err);
      setGlobalServices([]);
    }
    setLoading(false);
  }, [activeFilters]);

  useEffect(() => {
    loadServicesData(defaultFilters);
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
      page: 1,
      limit: activeFilters.limit,
    };
    setActiveFilters(filters);
    loadServicesData(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters(defaultFilters);
    loadServicesData(defaultFilters);
  };

  const handleLimitChange = (limit) => {
    const filters = {
      ...activeFilters,
      page: 1,
      limit: Number(limit),
    };
    setActiveFilters(filters);
    loadServicesData(filters);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    const filters = {
      ...activeFilters,
      page,
    };
    setActiveFilters(filters);
    loadServicesData(filters);
  };

  // --- Assign Modal Handlers ---
  const handleOpenAssignModal = () => {
    setSelectedAssignIds([]);
    setModalSearch('');
    setShowAssignModal(true);
  };

  const availableServices = globalServices.filter(
    (gs) => !assignedServices.some(
      (as) => parseInt(as.service_id) === parseInt(gs.id) || as.name?.toLowerCase() === gs.name?.toLowerCase()
    )
  );

  const filteredAvailable = availableServices.filter((s) => {
    const q = modalSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
  });

  const toggleSelectAllAssignModal = () => {
    if (selectedAssignIds.length === filteredAvailable.length && filteredAvailable.length > 0) {
      setSelectedAssignIds([]);
    } else {
      setSelectedAssignIds(filteredAvailable.map((s) => s.id));
    }
  };

  const toggleAssignSelection = (id) => {
    setSelectedAssignIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAssignServices = async (e) => {
    e.preventDefault();
    if (selectedAssignIds.length === 0) return;
    const res = await assignServiceToClinic({ service_ids: selectedAssignIds });
    if (!res.success) {
      alert(res.message);
    } else {
      setShowAssignModal(false);
      setSelectedAssignIds([]);
      loadServicesData();
    }
  };

  const handleRemoveService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service from your clinic?')) {
      await removeServiceFromClinic(id);
      loadServicesData();
    }
  };

  const toggleStatus = async (svc) => {
    const currentStatus = (svc.status || 'active').toLowerCase();
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const res = await toggleClinicServiceStatus(svc.id, newStatus);
    if (!res.success) {
      alert(res.message);
    } else {
      loadServicesData();
    }
  };

  return (
    <div className="clinic-services-manager">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Clinic Services & Pricing</h1>
          <p className="clinic-subtitle">Assign medical procedures, consultations & diagnostic services available at your clinic.</p>
        </div>
        <button onClick={handleOpenAssignModal} className="clinic-btn clinic-btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Assign Services
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <input
          className="admin-search-input"
          placeholder="Search assigned services by name..."
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

      {/* Services Table Card */}
      <div className="clinic-table-card">
        <div className="clinic-table-header">
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            ⚙️ Active Clinic Services ({assignedServices.length})
          </h3>
        </div>

        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Service Fee</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading clinic services...
                  </td>
                </tr>
              ) : assignedServices.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No services configured for this clinic yet. Click &apos;Assign Services&apos; to add.
                  </td>
                </tr>
              ) : (
                assignedServices.map((svc) => (
                  <tr key={svc.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{svc.name}</div>
                      {svc.description && <div style={{ fontSize: 12, color: '#64748b' }}>{svc.description}</div>}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0d9488', fontSize: 15 }}>
                        ₹{svc.price}
                      </span>
                    </td>
                    <td>
                      <button
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        onClick={() => toggleStatus(svc)}
                        title="Click to toggle status"
                      >
                        <span className={`admin-badge ${(svc.status === 'active' || svc.status === 'Active') ? 'active' : 'inactive'}`}>
                          {(svc.status === 'active' || svc.status === 'Active') ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="admin-action-btn-delete"
                        onClick={() => handleRemoveService(svc.id)}
                        title="Delete Service"
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
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.count} total services)
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

      {/* Bulk Assign Services Modal */}
      {showAssignModal && (
        <div className="clinic-modal-overlay">
          <div className="clinic-modal" style={{ maxWidth: 580, width: '90%' }}>
            <div className="clinic-modal-header">
              <div>
                <h3 className="clinic-modal-title">Assign Services to Clinic</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Select multiple master services created by Super Admin to add to your clinic.
                </p>
              </div>
              <button className="clinic-modal-close" onClick={() => setShowAssignModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAssignServices}>
              <div className="clinic-modal-body">
                {availableServices.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', margin: '20px 0' }}>
                    All available master services are already assigned to this clinic.
                  </p>
                ) : (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <input
                        className="admin-search-input"
                        style={{ width: '100%' }}
                        placeholder="Search available services by name or description..."
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
                          No matching services found.
                        </div>
                      ) : (
                        filteredAvailable.map((svc) => {
                          const isChecked = selectedAssignIds.includes(svc.id);
                          return (
                            <div
                              key={svc.id}
                              onClick={() => toggleAssignSelection(svc.id)}
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
                              <span style={{ fontSize: 20 }}>⚙️</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{svc.name}</div>
                                {svc.price && (
                                  <div style={{ fontSize: 12, color: '#64748b' }}>
                                    Fee: ₹{svc.price}
                                  </div>
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
                {availableServices.length > 0 && (
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
