'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createCity, deleteCity, getCities, updateCity } from '@/services/cityService';

function formatStatus(status) {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const emptyForm = {
  name: '',
  status: 'active',
};

export default function CitiesManager() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingCity, setEditingCity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const loadCities = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await getCities(filters);
      setCities(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong while loading cities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
    };
    setActiveFilters(filters);
    loadCities(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters({});
    loadCities();
  };

  const handleOpenAdd = () => {
    setEditingCity(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

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
    if (saving) return;
    setShowModal(false);
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
      await deleteCity(city.id);
      await loadCities(activeFilters);

      Swal.fire({
        title: 'Deleted!',
        text: 'City has been removed successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to delete city.',
        icon: 'error',
      });
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
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading cities...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              ) : cities.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
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
      </div>

      {showModal && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()}>
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
