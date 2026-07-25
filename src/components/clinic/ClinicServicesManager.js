'use client';
import { useEffect, useState } from 'react';
import {
  getClinicServices,
  assignServiceToClinic,
  removeServiceFromClinic,
} from '@/services/clinicAdminService';
import { getServices } from '@/services/serviceService';

export default function ClinicServicesManager() {
  const [assignedServices, setAssignedServices] = useState([]);
  const [globalServices, setGlobalServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 500,
    duration: '20 mins',
    category: 'Consultation',
  });

  const loadServicesData = async () => {
    setLoading(true);
    const assigned = await getClinicServices();
    const assignedList = Array.isArray(assigned) ? assigned : (assigned?.data || []);
    setAssignedServices(assignedList);

    // Fetch system services
    const globalRes = await getServices({ limit: 50 }).catch(() => null);
    const globalList = Array.isArray(globalRes?.data) ? globalRes.data : [
      { id: 1, name: 'General OPD Consultation', price: 500, category: 'Consultation' },
      { id: 2, name: '12-Lead ECG Test', price: 800, category: 'Diagnostics' },
      { id: 3, name: 'Complete Blood Count (CBC)', price: 400, category: 'Lab Test' },
      { id: 4, name: 'Chest X-Ray', price: 600, category: 'Radiology' },
      { id: 5, name: 'Ultrasound Scan', price: 1500, category: 'Radiology' },
    ];
    setGlobalServices(globalList);
    setLoading(false);
  };

  useEffect(() => {
    loadServicesData();
  }, []);

  const handleSelectPredefinedService = (serviceId) => {
    const selected = globalServices.find((s) => s.id === parseInt(serviceId));
    if (selected) {
      setFormData({
        name: selected.name,
        price: selected.price || 500,
        duration: '20 mins',
        category: selected.category || 'General',
      });
    }
  };

  const handleAssignService = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    await assignServiceToClinic(formData);
    setShowAssignModal(false);
    loadServicesData();
  };

  const handleRemoveService = async (id) => {
    if (window.confirm('Are you sure you want to remove this service from your clinic?')) {
      await removeServiceFromClinic(id);
      loadServicesData();
    }
  };

  return (
    <div className="clinic-services-manager">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Clinic Services & Pricing</h1>
          <p className="clinic-subtitle">Assign medical procedures, consultations & diagnostic services with custom prices.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', price: 500, duration: '20 mins', category: 'Consultation' });
            setShowAssignModal(true);
          }}
          className="clinic-btn clinic-btn-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Assign New Service
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
                <th>Category</th>
                <th>Estimated Duration</th>
                <th>Service Fee</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading clinic services...
                  </td>
                </tr>
              ) : assignedServices.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No services configured for this clinic yet. Click 'Assign New Service' to add one.
                  </td>
                </tr>
              ) : (
                assignedServices.map((svc) => (
                  <tr key={svc.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{svc.name}</div>
                    </td>
                    <td>
                      <span className="clinic-gallery-tag">{svc.category}</span>
                    </td>
                    <td style={{ color: '#475569', fontSize: 13 }}>{svc.duration}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0d9488', fontSize: 15 }}>
                        ₹{svc.price}
                      </span>
                    </td>
                    <td>
                      <span className="clinic-badge active">{svc.status || 'Active'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveService(svc.id)}
                        className="clinic-btn clinic-btn-danger clinic-btn-sm"
                        title="Remove Service"
                      >
                        Remove Service
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Service Modal */}
      {showAssignModal && (
        <div className="clinic-modal-overlay">
          <div className="clinic-modal">
            <div className="clinic-modal-header">
              <h3 className="clinic-modal-title">Assign Service to Clinic</h3>
              <button className="clinic-modal-close" onClick={() => setShowAssignModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAssignService}>
              <div className="clinic-modal-body">
                <div className="clinic-form-group">
                  <label>Quick Select Predefined Service</label>
                  <select
                    className="clinic-form-control"
                    onChange={(e) => handleSelectPredefinedService(e.target.value)}
                  >
                    <option value="">-- Choose from Master Services --</option>
                    {globalServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Default ₹{s.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="clinic-form-group">
                  <label>Service Name *</label>
                  <input
                    type="text"
                    className="clinic-form-control"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="clinic-form-grid">
                  <div className="clinic-form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      className="clinic-form-control"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="clinic-form-group">
                    <label>Estimated Duration</label>
                    <input
                      type="text"
                      className="clinic-form-control"
                      placeholder="e.g. 20 mins"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="clinic-form-group">
                  <label>Category</label>
                  <select
                    className="clinic-form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Procedure">Procedure</option>
                  </select>
                </div>
              </div>
              <div className="clinic-modal-footer">
                <button
                  type="button"
                  className="clinic-btn clinic-btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="clinic-btn clinic-btn-primary">
                  Assign Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
