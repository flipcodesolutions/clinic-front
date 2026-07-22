'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from '@/services/departmentService';

function formatStatus(status) {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const emptyForm = {
  name: '',
  description: '',
  status: 'active',
};

export default function DepartmentsManager() {
  const [departments, setDepartments] = useState([]);
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

  const loadDepartments = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await getDepartments(filters);
      setDepartments(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong while loading departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleApplyFilter = () => {
    const filters = {
      search: search.trim(),
      status: statusFilter,
    };
    setActiveFilters(filters);
    loadDepartments(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setActiveFilters({});
    loadDepartments();
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (department) => {
    setEditingItem(department);
    setForm({
      name: department.name || '',
      description: department.description || '',
      status: department.status || 'active',
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
      setFormError('Department name is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
      };

      if (editingItem) {
        await updateDepartment(editingItem.id, payload);
        await loadDepartments(activeFilters);
      } else {
        const newDepartment = await createDepartment(payload);
        setDepartments(prev => [newDepartment, ...prev]);
      }

      setForm(emptyForm);
      setEditingItem(null);
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || `Failed to ${editingItem ? 'update' : 'add'} department.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (department) => {
    const result = await Swal.fire({
      title: 'Delete department?',
      text: `"${department.name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteDepartment(department.id);
      await loadDepartments(activeFilters);

      Swal.fire({
        title: 'Deleted!',
        text: 'Department has been removed successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to delete department.',
        icon: 'error',
      });
    }
  };

  const toggleStatus = async (department) => {
    try {
      const currentIsActive = formatStatus(department.status) === 'Active';
      const newStatus = currentIsActive ? 'inactive' : 'active';

      await updateDepartment(department.id, {
        name: department.name,
        description: department.description,
        status: newStatus,
      });

      await loadDepartments(activeFilters);
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || err.message || 'Failed to update department status.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="departments-manager">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">System Departments</h1>
          <p className="admin-subtitle">Manage the master list of clinical departments/specialties.</p>
        </div>
        <button className="admin-add-btn" onClick={handleOpenAdd}>
          <span>+</span> Add Department
        </button>
      </div>

      <div className="admin-filter-bar">
        <input
          className="admin-search-input"
          placeholder="Search departments by name..."
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
                <th>Department Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading departments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#dc2626' }}>
                    {error}
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No departments found.
                  </td>
                </tr>
              ) : (
                departments.map(d => {
                  const status = formatStatus(d.status);

                  return (
                    <tr key={d.id}>
                      <td style={{ color: '#94a3b8', fontSize: 13, width: 80 }}>DEP-{d.id}</td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{d.name}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: '#64748b' }}>{d.description || '—'}</span>
                      </td>
                      <td>
                        <button
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                          onClick={() => toggleStatus(d)}
                          title="Click to toggle status"
                        >
                          <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                            {status}
                          </span>
                        </button>
                      </td>
                      <td>
                        <button className="admin-action-btn-edit" onClick={() => handleOpenEdit(d)}>
                          Edit
                        </button>
                        <button className="admin-action-btn-delete" onClick={() => handleDelete(d)}>
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
            <h3 className="admin-modal-title">{editingItem ? 'Edit Department' : 'Add New Department'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-full">
                  <label className="admin-form-label">Department Name *</label>
                  <input
                    className="admin-input"
                    placeholder="e.g. Ophthalmology"
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
                    placeholder="Short description of this department..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
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
                  {saving ? 'Saving...' : editingItem ? 'Update Department' : 'Save Department'}
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
