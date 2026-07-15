'use client';
import { useState } from 'react';

const initialServices = [
  { id: 1, name: 'Laboratory (Blood Tests, Urinalysis)', status: 'Active' },
  { id: 2, name: 'Radiology / X-Ray', status: 'Active' },
  { id: 3, name: 'Ambulance 24/7 Support', status: 'Active' },
  { id: 4, name: 'Pharmacy (In-house)', status: 'Active' },
  { id: 5, name: 'Emergency Room (ER) Services', status: 'Active' },
  { id: 6, name: 'Ultrasound / Sonography', status: 'Active' },
  { id: 7, name: 'CT Scan & MRI Care', status: 'Inactive' },
];

export default function ServicesManager() {
  const [services, setServices] = useState(initialServices);
  const [newService, setNewService] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newService.trim()) return;

    setServices([
      ...services,
      { id: Date.now(), name: newService.trim(), status: 'Active' }
    ]);
    setNewService('');
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="services-manager">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Global Clinical Services</h1>
          <p className="admin-subtitle">Manage the master list of diagnostic and supportive services offered on the platform.</p>
        </div>
        <button className="admin-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          <span>+</span> Add Service
        </button>
      </div>

      {/* Add Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="admin-filter-bar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input 
            className="admin-search-input" 
            placeholder="Enter service name (e.g. Intensive Care Unit - ICU)..." 
            value={newService}
            onChange={e => setNewService(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="admin-save-btn" style={{ padding: '10px 16px', borderRadius: 8 }}>
            Add Service
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
          placeholder="Filter services by name..." 
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
                <th>Service Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                filteredServices.map(s => (
                  <tr key={s.id}>
                    <td style={{ color: '#94a3b8', fontSize: 13, width: 80 }}>SRV-{s.id}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                    </td>
                    <td>
                      <button 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                        onClick={() => toggleStatus(s.id)}
                        title="Click to toggle status"
                      >
                        <span className={`admin-badge ${s.status === 'Active' ? 'active' : 'inactive'}`}>
                          {s.status}
                        </span>
                      </button>
                    </td>
                    <td>
                      <button className="admin-action-btn-delete" onClick={() => handleDelete(s.id)}>
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
