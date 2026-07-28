'use client';
import { useCallback, useEffect, useState } from 'react';
import { getClinicServices, syncClinicServices } from '@/services/clinic/serviceService';
import apiClient from '@/services/apiClient';
import AlphaGroupList from '@/components/common/AlphaGroupList';

export default function ClinicServicesManager() {
  const [allServices, setAllServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Filter bar
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Load master services from backend with search parameter
  const loadData = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setNotification({ type: '', message: '' });
    try {
      // 1. Fetch assigned clinic services
      const assignedRes = await getClinicServices({ limit: 1000 });
      const assignedList = Array.isArray(assignedRes)
        ? assignedRes
        : assignedRes?.data || [];
      const assignedIds = assignedList.map((s) => s.service_id || s.id).filter(Boolean);

      // 2. Fetch master services from backend API with search query
      let masterList = [];
      try {
        const masterRes = await apiClient.get('/clinic/master-services', {
          params: { limit: 1000, search: searchTerm.trim() },
        });
        if (masterRes?.data?.success && Array.isArray(masterRes.data.data)) {
          masterList = masterRes.data.data;
        }
      } catch (err) {
        console.error('Failed to load master services from API', err);
      }

      // Fallback if master list is empty on initial load
      if (masterList.length === 0 && assignedList.length > 0 && !searchTerm.trim()) {
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
    loadData('');
  }, [loadData]);

  // Apply Filter button handler
  const handleApplyFilter = () => {
    const term = search.trim();
    setActiveSearch(term);
    loadData(term);
  };

  // Reset Filter button handler
  const handleResetFilter = () => {
    setSearch('');
    setActiveSearch('');
    loadData('');
  };

  // Handle Enter key on search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilter();
    }
  };

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

  // Custom service card render matching UI screenshot style
  const renderServiceItem = (svc, isChecked, onToggle) => (
    <div
      key={svc.id}
      className={`alpha-item-card ${isChecked ? 'selected' : ''}`}
      onClick={() => onToggle(svc.id)}
    >
      <div className={`alpha-item-checkbox ${isChecked ? 'checked' : ''}`}>
        {isChecked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <div className="alpha-item-info">
        <div className="alpha-item-name-row">
          <span className="alpha-item-name">{svc.name}</span>
          {svc.price !== undefined && svc.price !== null && (
            <span className="alpha-item-price">₹{svc.price}</span>
          )}
        </div>
        {svc.description && (
          <span className="alpha-item-desc">{svc.description}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="clinic-services-page">
      {/* Outer Page Header */}
      <div className="clinic-services-header">
        <h1 className="clinic-services-title">Clinic Services & Pricing</h1>
        <p className="clinic-services-subtitle">
          Select and assign medical procedures, consultations & diagnostic services available at your clinic.
        </p>
      </div>

      {/* Main White Card Container */}
      <div className="clinic-services-card">
        {/* Card Header with Save Button */}
        <div className="clinic-services-card-header">
          <div>
            <h2 className="clinic-services-card-title">Assign Services</h2>
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

                Save Changes
              </>
            )}
          </button>
        </div>

        {/* City Page Style Filter Bar */}
        <div className="admin-filter-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search services by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button type="button" className="admin-btn-apply" onClick={handleApplyFilter}>
            Filter
          </button>
          <button type="button" className="admin-btn-reset" onClick={handleResetFilter}>
            Reset
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

        {/* A-Z Accordion List */}
        {loading ? (
          <div className="clinic-dashboard-loading-cell">Loading services...</div>
        ) : (
          <AlphaGroupList
            items={allServices}
            selectedIds={selectedServiceIds}
            onToggle={toggleSelectService}
            renderItem={renderServiceItem}
            emptyMessage={activeSearch ? `No services match "${activeSearch}"` : "No services found."}
            isFiltered={!!activeSearch}
          />
        )}


      </div>
    </div>
  );
}
