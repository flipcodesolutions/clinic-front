'use client';
import { useState } from 'react';

const initialDepartments = [
  { id: 1, name: 'General Physician', status: 'Active' },
  { id: 2, name: 'Cardiologist', status: 'Active' },
  { id: 3, name: 'Dentist', status: 'Active' },
  { id: 4, name: 'Dermatologist', status: 'Active' },
  { id: 5, name: 'Orthopedic', status: 'Active' },
  { id: 6, name: 'Gynecologist', status: 'Active' },
  { id: 7, name: 'Pediatrician', status: 'Active' },
  { id: 8, name: 'Neurologist', status: 'Inactive' },
];

export default function DepartmentsManager() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [newDept, setNewDept] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newDept.trim()) return;

    setDepartments([
      ...departments,
      { id: Date.now(), name: newDept.trim(), status: 'Active' }
    ]);
    setNewDept('');
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this department? This will affect listings.')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setDepartments(departments.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d));
  };

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="departments-manager">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">System Departments</h1>
          <p className="admin-subtitle">Manage the master list of clinical departments/specialties.</p>
        </div>
        <button className="admin-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <span>+</span> Add Department
        </button>
      </div>

      {/* Add Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="admin-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input 
            className="admin-search-input" 
            placeholder="Enter department name (e.g. Ophthalmology)..." 
            value={newDept}
            onChange={e => setNewDept(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="admin-save-btn" style={{ padding: '10px 16px', borderRadius: 8 }}>
            Add Department
          </button>
          <button type="button" className="admin-cancel-btn" style={{ padding: '10px 16px', borderRadius: 8 }} onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Search Input */}
      <div className="admin-filter-bar">
        <input 
          className="admin-search-input" 
          placeholder="Filter departments by name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="admin-btn-reset" onClick={() => setSearch('')}>
            Clear
          </button>
        )}
      </div>

      {/* Grid or Table list */}
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepts.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No departments found.
                  </td>
                </tr>
              ) : (
                filteredDepts.map(d => (
                  <tr key={d.id}>
                    <td style={{ color: '#94a3b8', fontSize: 13, width: 80 }}>DEP-{d.id}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{d.name}</span>
                    </td>
                    <td>
                      <button 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        onClick={() => toggleStatus(d.id)}
                        title="Click to toggle status"
                      >
                        <span className={`admin-badge ${d.status === 'Active' ? 'active' : 'inactive'}`}>
                          {d.status}
                        </span>
                      </button>
                    </td>
                    <td>
                      <button className="admin-action-btn-delete" onClick={() => handleDelete(d.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
