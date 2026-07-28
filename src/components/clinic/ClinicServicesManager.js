'use client';
import { useCallback, useEffect, useState } from 'react';
import { getClinicServices, syncClinicServices } from '@/services/clinicAdminService';
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
    <div style={{ padding: '24px 32px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}>
      {/* Outer Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
          Clinic Services & Pricing
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
          Select and assign medical procedures, consultations & diagnostic services available at your clinic.
        </p>
      </div>

      {/* Main White Card Container */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          padding: 32,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Card Header with Save Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a' }}>
              Assign Services
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
              Select the services you want to assign to your clinic.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            style={{
              background: '#0d9488',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease',
              opacity: saving || loading ? 0.7 : 1,
            }}
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
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: notification.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: notification.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ type: '', message: '' })}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* 2-Column Grid of Services */}
        {loading ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
            Loading services...
          </div>
        ) : allServices.length === 0 ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
            No services found.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {allServices.map((svc) => {
              const isChecked = selectedServiceIds.includes(svc.id);
              return (
                <div
                  key={svc.id}
                  onClick={() => toggleSelectService(svc.id)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Styled Teal Checkbox */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: isChecked ? 'none' : '2px solid #cbd5e1',
                        background: isChecked ? '#0d9488' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isChecked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>

                    {/* Service Icon */}
                    <div style={{ fontSize: 24, flexShrink: 0 }}>
                      🩺
                    </div>

                    {/* Service Name */}
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                      {svc.name}
                    </div>
                  </div>

                  {/* Price Tag if available */}
                  {svc.price !== undefined && (
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0d9488' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0d9488', fontSize: 14, fontWeight: 600 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '1.5px solid #0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
