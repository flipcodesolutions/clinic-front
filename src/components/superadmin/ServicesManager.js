'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  createService,
  deleteService,
  getServices,
  getServiceById,
  updateService,
} from '@/services/superadmin/serviceService';
import { showError, showSuccess } from '@/utils/toast';

function formatStatus(status) {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const emptyForm = {
  name: '',
  description: '',
  price: '',
  status: 'active',
};

const defaultFilters = {
  search: '',
  status: '',
  page: 1,
  limit: 10,
};

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
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

  const loadServices = async (filters = activeFilters) => {
    try {
      setLoading(true);
      setError('');
      const result = await getServices(filters);
      setServices(result.data || []);
      setPagination({
        count: result.count ?? 0,
        currentPage: result.currentPage ?? 1,
        totalPages: result.totalPages ?? 1,
        limit: result.limit ?? filters.limit ?? 10,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong while loading services.';
      setError(message);
      showError(err, message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getServices(defaultFilters)
      .then((result) => {
        if (isMounted) {
          setServices(result.data || []);
          setPagination({
            count: result.count ?? 0,
            currentPage: result.currentPage ?? 1,
            totalPages: result.totalPages ?? 1,
            limit: result.limit ?? defaultFilters.limit ?? 10,
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          const message = err.response?.data?.message || err.message || 'Something went wrong while loading services.';
          setError(message);
          showError(err, message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
      page: 1,
      limit: activeFilters.limit,
    };
    setActiveFilters(filters);
    loadServices(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters(defaultFilters);
    loadServices(defaultFilters);
  };

  const handleLimitChange = (limit) => {
    const filters = {
      ...activeFilters,
      page: 1,
      limit: Number(limit),
    };
    setActiveFilters(filters);
    loadServices(filters);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    const filters = {
      ...activeFilters,
      page,
    };
    setActiveFilters(filters);
    loadServices(filters);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = async (service) => {
    setEditingId(service.id);
    setFormError('');
    setShowModal(true);
    setLoadingForm(true);

    try {
      const data = await getServiceById(service.id);
      setForm({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        status: data.status || 'active',
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load service details.';
      setFormError(message);
      showError(err, message);
      setForm({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        status: service.status || 'active',
      });
    } finally {
      setLoadingForm(false);
    }
  };

  const handleCloseModal = () => {
    if (saving || loadingForm) return;
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFormError('Service name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price ? parseFloat(form.price) : 0,
        status: form.status,
      };

      if (editingId) {
        const result = await updateService(editingId, payload);
        showSuccess(result.message);
        await loadServices(activeFilters);
      } else {
        const result = await createService(payload);
        showSuccess(result.message);
        await loadServices(activeFilters);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        (editingId ? 'Failed to update service.' : 'Failed to add service.');
      setFormError(message);
      showError(err, message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    const result = await Swal.fire({
      title: 'Delete service?',
      text: `"${service.name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await deleteService(service.id);
      await loadServices(activeFilters);
      showSuccess(deleteResult.message);
    } catch (err) {
      showError(err, 'Failed to delete service.');
    }
  };

  const toggleStatus = async (service) => {
    const newStatus = formatStatus(service.status) === 'Active' ? 'inactive' : 'active';

    try {
      const result = await updateService(service.id, {
        name: service.name,
        description: service.description,
        price: service.price,
        status: newStatus,
      });
      showSuccess(result.message);
      await loadServices(activeFilters);
    } catch (err) {
      showError(err, 'Failed to update status');
    }
  };

  return (
    <div className="services-manager">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Global Clinical Services</h1>
          <p className="admin-subtitle">Manage the master list of diagnostic and supportive services offered on the platform.</p>
        </div>
        <button className="admin-add-btn" onClick={handleOpenAdd}>
          <span>+</span> Add Service
        </button>
      </div>

      <div className="admin-filter-bar">
        <input
          className="admin-search-input"
          placeholder="Filter services by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="admin-filter-select"
          value={activeFilters.limit}
          onChange={e => handleLimitChange(e.target.value)}
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

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading services...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                services.map(s => {
                  const status = formatStatus(s.status);

                  return (
                    <tr key={s.id}>
                      <td style={{ color: '#94a3b8', fontSize: 13, width: 80 }}>SRV-{s.id}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: '#64748b' }}>{s.description || '—'}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>
                          {s.price ? `₹${s.price}` : 'Free'}
                        </span>
                      </td>
                      <td>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                          onClick={() => toggleStatus(s)}
                          title="Click to toggle status"
                        >
                          <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                            {status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button className="admin-action-btn-edit" onClick={() => handleOpenEdit(s)}>
                          Edit
                        </button>
                        <button className="admin-action-btn-delete" onClick={() => handleDelete(s)}>
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

      {showModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingId ? 'Edit Service' : 'Add New Service'}
            </h3>

            {loadingForm ? (
              <p style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                Loading service details...
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                  <div className="admin-form-full">
                    <label className="admin-form-label">Service Name *</label>
                    <input
                      className="admin-input"
                      placeholder="e.g. Intensive Care Unit (ICU)"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Description</label>
                    <textarea
                      className="admin-textarea"
                      placeholder="Short description of this service..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="admin-input"
                      placeholder="e.g. 500"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-select"
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
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
                    {saving ? 'Saving...' : editingId ? 'Update Service' : 'Save Service'}
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
