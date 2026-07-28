'use client';
import { useCallback, useEffect, useState } from 'react';
import { getClinicDepartments, syncClinicDepartments } from '@/services/clinic/departmentService';
import apiClient from '@/services/apiClient';
import AlphaGroupList from '@/components/common/AlphaGroupList';

export default function ClinicDepartmentsManager() {
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDeptIds, setSelectedDeptIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Filter bar
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Load master departments from backend with search parameter
  const loadData = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setNotification({ type: '', message: '' });
    try {
      // 1. Fetch assigned clinic departments
      const assignedRes = await getClinicDepartments({ limit: 1000 });
      const assignedList = Array.isArray(assignedRes)
        ? assignedRes
        : assignedRes?.data || [];
      const assignedIds = assignedList.map((d) => d.id).filter(Boolean);

      // 2. Fetch master departments from backend API with search query
      let masterList = [];
      try {
        const masterRes = await apiClient.get('/clinic/master-departments', {
          params: { limit: 1000, search: searchTerm.trim() },
        });
        if (masterRes?.data?.success && Array.isArray(masterRes.data.data)) {
          masterList = masterRes.data.data;
        }
      } catch (err) {
        console.error('Failed to load master departments from API', err);
      }

      // Fallback if master list is empty on initial load
      if (masterList.length === 0 && assignedList.length > 0 && !searchTerm.trim()) {
        masterList = assignedList.map((ad) => ({
          id: ad.id,
          name: ad.name,
          description: ad.description,
          status: ad.status || 'active',
        }));
      }

      setAllDepartments(masterList);
      setSelectedDeptIds(assignedIds);
    } catch (err) {
      console.error('Error loading departments:', err);
      setNotification({ type: 'error', message: 'Failed to load department list.' });
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

  // Toggle single department selection
  const toggleSelectDept = (id) => {
    setSelectedDeptIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Save selected departments
  const handleSave = async () => {
    setSaving(true);
    setNotification({ type: '', message: '' });

    const res = await syncClinicDepartments(selectedDeptIds);
    setSaving(false);

    if (res.success) {
      setNotification({
        type: 'success',
        message: '✅ Departments saved successfully!',
      });
      setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000);
    } else {
      setNotification({
        type: 'error',
        message: `❌ ${res.message || 'Failed to save departments.'}`,
      });
    }
  };

  // Custom department card render
  const renderDeptItem = (dept, isChecked, onToggle) => (
    <div
      key={dept.id}
      className={`alpha-item-card ${isChecked ? 'selected' : ''}`}
      onClick={() => onToggle(dept.id)}
    >
      <div className={`alpha-item-checkbox ${isChecked ? 'checked' : ''}`}>
        {isChecked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff"
            strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div className="alpha-item-info">
        <span className="alpha-item-name">{dept.name}</span>
        {dept.description && (
          <span className="alpha-item-desc">{dept.description}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="clinic-departments-page">
      {/* Outer Page Header */}
      <div className="clinic-departments-header">
        <h1 className="clinic-departments-title">Departments</h1>
        <p className="clinic-departments-subtitle">
          Select and assign departments to your clinic.
        </p>
      </div>

      {/* Main White Card Container */}
      <div className="clinic-departments-card">
        {/* Card Header with Save Button */}
        <div className="clinic-departments-card-header">
          <div>
            <h2 className="clinic-departments-card-title">Assign Departments</h2>
            <p className="clinic-departments-card-desc">
              Select the departments you want to assign to your clinic.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="clinic-departments-save-btn"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>Save Changes</>
            )}
          </button>
        </div>

        {/*Filter Bar */}
        <div className="admin-filter-bar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search departments by name..."
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
          <div className={`clinic-departments-toast ${notification.type}`}>
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification({ type: '', message: '' })}
              className="clinic-departments-toast-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* A–Z Accordion List */}
        {loading ? (
          <div className="clinic-dashboard-loading-cell">Loading departments...</div>
        ) : (
          <AlphaGroupList
            items={allDepartments}
            selectedIds={selectedDeptIds}
            onToggle={toggleSelectDept}
            renderItem={renderDeptItem}
            emptyMessage={activeSearch ? `No departments match "${activeSearch}"` : "No departments found."}
            isFiltered={!!activeSearch}
          />
        )}
      </div>
    </div>
  );
}
