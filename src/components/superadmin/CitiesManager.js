'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  createCity,
  deleteCity,
  getCities,
  getCityById,
  updateCity,
} from '@/services/cityService';
import { showError, showSuccess } from '@/utils/toast';
import { createCity, deleteCity, getCities, updateCity } from '@/services/cityService';

function formatStatus(status) {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const emptyForm = {
  name: '',
  status: 'active',
};

const defaultFilters = {
  search: '',
  status: '',
  page: 1,
  limit: 10,
};

export default function CitiesManager() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingCity, setEditingCity] = useState(null);
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

  const loadCities = async (filters = activeFilters) => {
    try {
      setLoading(true);
      setError('');
      const result = await getCities(filters);
      setCities(result.data);
      setPagination({
        count: result.count,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        limit: result.limit,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong while loading cities.';
      setError(message);
      showError(err, message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities(defaultFilters);
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
      page: 1,
      limit: activeFilters.limit,
    };
    setActiveFilters(filters);
    loadCities(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters(defaultFilters);
    loadCities(defaultFilters);
  };

  const handleLimitChange = (limit) => {
    const filters = {
      ...activeFilters,
      page: 1,
      limit: Number(limit),
    };
    setActiveFilters(filters);
    loadCities(filters);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    const filters = {
      ...activeFilters,
      page,
    };
    setActiveFilters(filters);
    loadCities(filters);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setEditingCity(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = async (city) => {
    setEditingId(city.id);
    setFormError('');
    setShowModal(true);
    setLoadingForm(true);

    try {
      const data = await getCityById(city.id);
      setForm({
        name: data.name || '',
        status: data.status || 'active',
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load city details.';
      setFormError(message);
      showError(err, message);
      setForm({
        name: city.name || '',
        status: city.status || 'active',
      });
    } finally {
      setLoadingForm(false);
    }
  const handleOpenEdit = (city) => {
    setEditingCity(city);
    setForm({
      name: city.name,
      status: city.status || 'active',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving || loadingForm) return;
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    setEditingCity(null);
    setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setFormError('City name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        name: form.name.trim(),
        status: form.status,
      };

      if (editingId) {
        const result = await updateCity(editingId, payload);
        showSuccess(result.message);
        await loadCities(activeFilters);
      } else {
        const result = await createCity(payload);
        showSuccess(result.message);
        await loadCities(activeFilters);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        (editingId ? 'Failed to update city.' : 'Failed to add city.');
      setFormError(message);
      showError(err, message);
      if (editingCity) {
        const updated = await updateCity(editingCity.id, payload);
        setCities(prev => prev.map(c => (c.id === editingCity.id ? updated : c)));
      } else {
        const newCity = await createCity(payload);
        setCities(prev => [newCity, ...prev]);
      }

      setForm(emptyForm);
      setEditingCity(null);
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save city.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (city) => {
    const result = await Swal.fire({
      title: 'Delete city?',
      text: `"${city.name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await deleteCity(city.id);
      await loadCities(activeFilters);
      showSuccess(deleteResult.message);
    } catch (err) {
      showError(err, 'Failed to delete city.');
    }
  };

  const toggleStatus = async (city) => {
    const newStatus = formatStatus(city.status) === 'Active' ? 'inactive' : 'active';
    try {
      const updated = await updateCity(city.id, { name: city.name, status: newStatus });
      setCities(prev => prev.map(c => (c.id === city.id ? updated : c)));
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to update status',
        icon: 'error',
      });
    }
  };

  return (
    <div className="cities-manager">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">City Directory</h1>
          <p className="admin-subtitle">Manage cities available for clinic registration and search.</p>
        </div>
        <button className="admin-add-btn" onClick={handleOpenAdd}>
          <span>+</span> Add City
        </button>
      </div>

      <div className="admin-filter-bar">
        <input
          className="admin-search-input"
          placeholder="Search cities by name..."
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
          <option value="20">25 per page</option>
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
                <th>City Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading cities...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              ) : cities.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No cities found.
                  </td>
                </tr>
              ) : (
                cities.map(c => {
                  const status = formatStatus(c.status);

                  return (
                    <tr key={c.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </td>
                      <td>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                          onClick={() => toggleStatus(c)}
                          title="Click to toggle status"
                        >
                          <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                            {status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button className="admin-action-btn-edit" onClick={() => handleOpenEdit(c)}>
                          Edit
                        </button>
                        <button className="admin-action-btn-delete" onClick={() => handleDelete(c)}>
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
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.count} total cities)
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
              {editingId ? 'Edit City' : 'Add New City'}
            </h3>

            {loadingForm ? (
              <p style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                Loading city details...
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="admin-form-grid">
                  <div className="admin-form-full">
                    <label className="admin-form-label">City Name *</label>
                    <input
                      className="admin-input"
                      placeholder="e.g. Surendranagar"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      autoFocus
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
            <h3 className="admin-modal-title">{editingCity ? 'Edit City' : 'Add New City'}</h3>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-full">
                  <label className="admin-form-label">City Name *</label>
                  <input
                    className="admin-input"
                    placeholder="e.g. Surendranagar"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                {formError && (
                  <p style={{ margin: '12px 0 0', color: '#dc2626', fontSize: 14 }}>{formError}</p>
                )}

                <div className="admin-form-actions">
                  <button type="submit" className="admin-save-btn" disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Update City' : 'Save City'}
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

              {formError && (
                <p style={{ margin: '12px 0 0', color: '#dc2626', fontSize: 14 }}>{formError}</p>
              )}

              <div className="admin-form-actions">
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingCity ? 'Update City' : 'Save City'}
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
