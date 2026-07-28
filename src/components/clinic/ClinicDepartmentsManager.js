'use client';
import { useCallback, useEffect, useState } from 'react';
import { getClinicDepartments, syncClinicDepartments } from '@/services/clinic/departmentService';
import apiClient from '@/services/apiClient';

export default function ClinicDepartmentsManager() {
  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDeptIds, setSelectedDeptIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Load master departments and currently assigned clinic departments
  const loadData = useCallback(async () => {
    setLoading(true);
    setNotification({ type: '', message: '' });
    try {
      // 1. Fetch assigned clinic departments
      const assignedRes = await getClinicDepartments({ limit: 1000 });
      const assignedList = Array.isArray(assignedRes)
        ? assignedRes
        : assignedRes?.data || [];
      const assignedIds = assignedList.map((d) => d.id).filter(Boolean);

      // 2. Fetch master departments
      let masterList = [];
      try {
        const masterRes = await apiClient.get('/clinic/master-departments', { params: { limit: 1000 } });
        if (masterRes?.data?.success && Array.isArray(masterRes.data.data)) {
          masterList = masterRes.data.data;
        }
      } catch (err) {
        console.error('Failed to load master departments from API', err);
      }

      // Fallback if master list empty
      if (masterList.length === 0 && assignedList.length > 0) {
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
    loadData();
  }, [loadData]);

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

  return (
    <div className="clinic-departments-page">
      {/* Outer Page Header */}
      <div className="clinic-departments-header">
        <h1 className="clinic-departments-title">
          Departments
        </h1>
        <p className="clinic-departments-subtitle">
          Select and assign departments to your clinic.
        </p>
      </div>

      {/* Main White Card Container */}
      <div className="clinic-departments-card">
        {/* Card Header with Save Button */}
        <div className="clinic-departments-card-header">
          <div>
            <h2 className="clinic-departments-card-title">
              Assign Departments
            </h2>
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

        {/* 2-Column Grid of Departments */}
        {loading ? (
          <div className="clinic-dashboard-loading-cell">
            Loading departments...
          </div>
        ) : allDepartments.length === 0 ? (
          <div className="clinic-dashboard-empty-cell">
            No departments found.
          </div>
        ) : (
          <div className="clinic-departments-grid">
            {allDepartments.map((dept) => {
              const isChecked = selectedDeptIds.includes(dept.id);
              return (
                <div
                  key={dept.id}
                  onClick={() => toggleSelectDept(dept.id)}
                  className="clinic-departments-item"
                >
                  {/* Styled Teal Checkbox */}
                  <div className={`clinic-departments-checkbox ${isChecked ? 'checked' : ''}`}>
                    {isChecked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
 
                  {/* Department Name */}
                  <div className="clinic-departments-name">
                    {dept.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Selected Counter */}
        {!loading && (
          <div className="clinic-departments-counter">
           
            {/* <span>{selectedDeptIds.length} departments selected</span> */}
          </div>
        )}
      </div>
    </div>
  );
}
