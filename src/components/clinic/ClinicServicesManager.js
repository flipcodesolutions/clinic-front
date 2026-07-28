'use client';
import { useCallback, useEffect, useState } from 'react';
import { getClinicServices, syncClinicServices } from '@/services/clinic/serviceService';
import apiClient from '@/services/apiClient';

export default function ClinicServicesManager() {
  const [allServices, setAllServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Load master services and currently assigned clinic services
  const loadData = useCallback(async () => {
    setLoading(true);
    setNotification({ type: '', message: '' });
    try {
      // 1. Fetch assigned clinic services
      const assignedRes = await getClinicServices({ limit: 1000 });
      const assignedList = Array.isArray(assignedRes)
        ? assignedRes
        : assignedRes?.data || [];
      const assignedIds = assignedList.map((s) => s.service_id || s.id).filter(Boolean);

      // 2. Fetch master services
      let masterList = [];
      try {
        const masterRes = await apiClient.get('/clinic/master-services', { params: { limit: 1000 } });
        if (masterRes?.data?.success && Array.isArray(masterRes.data.data)) {
          masterList = masterRes.data.data;
        }
      } catch (err) {
        console.error('Failed to load master services from API', err);
      }

      // Fallback if master list is empty
      if (masterList.length === 0 && assignedList.length > 0) {
        masterList = assignedList.map((as) => ({
          id: as.service_id || as.id,
          name: as.name,
          price: as.price || 0,
          description: as.description || '',
          status: as.status || 'active',
        }));
      }

      setAllServices(masterList);
      setSelectedServiceIds(assignedIds);
    } catch (err) {
      console.error('Error loading services:', err);
      setNotification({ type: 'error', message: 'Failed to load services list.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Toggle single service selection
  const toggleSelectService = (id) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Save selected services
  const handleSave = async () => {
    setSaving(true);
    setNotification({ type: '', message: '' });

    const res = await syncClinicServices(selectedServiceIds);
    setSaving(false);

    if (res.success) {
      setNotification({
        type: 'success',
        message: '✅ Services saved successfully!',
      });

      setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000);
    } else {
      setNotification({
        type: 'error',
        message: `❌ ${res.message || 'Failed to save services.'}`,
      });
    }
  };

  return (
    <div className="clinic-services-page">
      {/* Outer Page Header */}
      <div className="clinic-services-header">
        <h1 className="clinic-services-title">
          Clinic Services & Pricing
        </h1>
        <p className="clinic-services-subtitle">
          Select and assign medical procedures, consultations & diagnostic services available at your clinic.
        </p>
      </div>

      {/* Main White Card Container */}
      <div className="clinic-services-card">
        {/* Card Header with Save Button */}
        <div className="clinic-services-card-header">
          <div>
            <h2 className="clinic-services-card-title">
              Assign Services
            </h2>
            <p className="clinic-services-card-desc">
              Select the services you want to assign to your clinic.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="clinic-services-save-btn"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Toast Banner Alert */}
        {notification.message && (
          <div className={`clinic-services-toast ${notification.type}`}>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ type: '', message: '' })}
              className="clinic-services-toast-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Grid of Services */}
        {loading ? (
          <div className="clinic-dashboard-loading-cell">
            Loading services...
          </div>
        ) : allServices.length === 0 ? (
          <div className="clinic-dashboard-empty-cell">
            No services found.
          </div>
        ) : (
          <div className="clinic-services-grid">
            {allServices.map((svc) => {
              const isChecked = selectedServiceIds.includes(svc.id);
              return (
                <div
                  key={svc.id}
                  onClick={() => toggleSelectService(svc.id)}
                  className="clinic-services-item"
                >
                  <div className="clinic-services-item-left">
                    {/* Styled Teal Checkbox */}
                    <div className={`clinic-services-checkbox ${isChecked ? 'checked' : ''}`}>
                      {isChecked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>

                    {/* Service Icon */}
                    <div className="clinic-services-icon">
                      🩺
                    </div>

                    {/* Service Name */}
                    <div className="clinic-services-name">
                      {svc.name}
                    </div>
                  </div>

                  {/* Price Tag if available */}
                  {svc.price !== undefined && (
                    <div className="clinic-services-price">
                      ₹{svc.price}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Selected Counter */}
        {!loading && (
          <div className="clinic-services-counter">
            <div className="clinic-services-counter-badge">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span>{selectedServiceIds.length} services selected</span>
          </div>
        )}
      </div>
    </div>
  );
}
