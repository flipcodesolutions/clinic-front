'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createService, deleteService, getServices, updateService } from '@/services/serviceService';

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

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const loadServices = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await getServices(filters);
      setServices(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong while loading services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
    };
    setActiveFilters(filters);
    loadServices(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters({});
    loadServices();
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingItem(service);
    setForm({
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      status: service.status || 'active',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingItem(null);
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

      if (editingItem) {
        await updateService(editingItem.id, payload);
        await loadServices(activeFilters);
      } else {
        const newService = await createService(payload);
        setServices(prev => [newService, ...prev]);
      }

      setForm(emptyForm);
      setEditingItem(null);
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || `Failed to ${editingItem ? 'update' : 'add'} service.`);
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
      await deleteService(service.id);
      await loadServices(activeFilters);

      Swal.fire({
        title: 'Deleted!',
        text: 'Service has been removed successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to delete service.',
        icon: 'error',
      });
    }
  };

  const toggleStatus = async (service) => {
    try {
      const currentIsActive = formatStatus(service.status) === 'Active';
      const newStatus = currentIsActive ? 'inactive' : 'active';

      await updateService(service.id, {
        name: service.name,
        description: service.description,
        price: service.price,
        status: newStatus,
      });

      await loadServices(activeFilters);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to update service status.',
        icon: 'error',
      });
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
      </div>

      {showModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="admin-modal-title">{editingItem ? 'Edit Service' : 'Add New Service'}</h3>
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
                  {saving ? 'Saving...' : editingItem ? 'Update Service' : 'Save Service'}
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
          </div>
        </div>
      )}
    </div>
  );
}
