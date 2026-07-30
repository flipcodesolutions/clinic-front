'use client';
import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import {
  getDoctorSchedules,
  createDoctorSchedule,
  updateDoctorSchedule,
  deleteDoctorSchedule,
} from '@/services/doctor/scheduleService';
import { getDoctorProfile } from '@/services/doctor/profileService';
import { showError, showSuccess } from '@/utils/toast';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const SLOT_DURATIONS = [10, 15, 20, 30, 45, 60];

export default function DoctorSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [dayFilter, setDayFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({ search: '', day: '' });

  // Pagination & Page Size Limit (City Master Style)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Exactly 7 fields state
  const [form, setForm] = useState({
    clinic_id: '',
    day_of_week: 'monday',
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: '15',
    maximum_booking: '20',
    is_available: true,
  });

  const loadData = useCallback(async (filters = activeFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.day) params.day = filters.day;

      const [schedRes, profileRes] = await Promise.all([
        getDoctorSchedules(params),
        getDoctorProfile(),
      ]);

      if (schedRes?.success && Array.isArray(schedRes?.data)) {
        setSchedules(schedRes.data);
      }

      if (profileRes?.success && profileRes?.data) {
        const userClinics = profileRes.data.user?.clinics || profileRes.data.clinics || [];
        if (userClinics.length > 0) {
          setClinics(userClinics);
          setForm((prev) => ({ ...prev, clinic_id: prev.clinic_id || String(userClinics[0].id) }));
        } else {
          const fallbackClinic = [{ id: 1, name: 'Medi Growth Main Clinic' }];
          setClinics(fallbackClinic);
          setForm((prev) => ({ ...prev, clinic_id: prev.clinic_id || '1' }));
        }
      }
    } catch (error) {
      console.error('Error loading schedule data:', error);
      showError(error, 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApplyFilter = () => {
    const filters = { search: search.trim(), day: dayFilter };
    setActiveFilters(filters);
    setCurrentPage(1);
    loadData(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setDayFilter('');
    setItemsPerPage(10);
    const filters = { search: '', day: '' };
    setActiveFilters(filters);
    setCurrentPage(1);
    loadData(filters);
  };

  const resetForm = () => {
    setForm({
      clinic_id: clinics[0]?.id ? String(clinics[0].id) : '',
      day_of_week: 'monday',
      start_time: '09:00',
      end_time: '17:00',
      slot_duration: '15',
      maximum_booking: '20',
      is_available: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (sch) => {
    setEditingId(sch.id);
    setForm({
      clinic_id: sch.clinic_id ? String(sch.clinic_id) : (clinics[0]?.id ? String(clinics[0].id) : ''),
      day_of_week: sch.day_of_week || 'monday',
      start_time: sch.start_time || '09:00',
      end_time: sch.end_time || '17:00',
      slot_duration: sch.slot_duration ? String(sch.slot_duration) : '15',
      maximum_booking: sch.maximum_booking ? String(sch.maximum_booking) : '20',
      is_available: sch.is_available !== undefined ? Boolean(sch.is_available) : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (sch) => {
    const result = await Swal.fire({
      title: 'Delete Schedule Slot?',
      text: `Slot for ${sch.day_of_week} (${sch.start_time} - ${sch.end_time}) will be deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteDoctorSchedule(sch.id);
      if (res?.success) {
        showSuccess(res.message || 'Schedule deleted successfully');
        loadData(activeFilters);
      }
    } catch (error) {
      showError(error, 'Failed to delete schedule');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clinic_id || !form.day_of_week || !form.start_time || !form.end_time) {
      showError(null, 'Please fill all required fields');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        clinic_id: parseInt(form.clinic_id, 10),
        day_of_week: form.day_of_week,
        start_time: form.start_time,
        end_time: form.end_time,
        slot_duration: parseInt(form.slot_duration, 10),
        maximum_booking: parseInt(form.maximum_booking, 10),
        is_available: Boolean(form.is_available),
      };

      if (editingId) {
        const res = await updateDoctorSchedule(editingId, payload);
        showSuccess(res?.message || 'Schedule updated successfully');
      } else {
        const res = await createDoctorSchedule(payload);
        showSuccess(res?.message || 'Schedule added successfully');
      }

      resetForm();
      loadData(activeFilters);
    } catch (error) {
      showError(error, 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const filteredSchedules = schedules.filter((sch) => {
    const dayMatch = !activeFilters.day ? true : sch.day_of_week === activeFilters.day;
    const clinicName = (sch.clinic?.name || '').toLowerCase();
    const searchMatch = !activeFilters.search
      ? true
      : clinicName.includes(activeFilters.search.toLowerCase()) ||
        sch.day_of_week.includes(activeFilters.search.toLowerCase());

    return dayMatch && searchMatch;
  });

  // Pagination Math
  const totalCount = filteredSchedules.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="doc-schedule">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Schedule & Slots</h1>
          <p className="admin-subtitle">Set your clinic consultation timing, slot duration, and booking limits</p>
        </div>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Schedule Slot
        </button>
      </div>

      {/* Filter Bar with Items Per Page Dropdown */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by clinic or day..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
        >
          <option value="">All Days</option>
          {DAYS_OF_WEEK.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
        <select
          className="admin-filter-select"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
        <button type="button" className="admin-btn-apply" onClick={handleApplyFilter}>
          Apply Filter
        </button>
        <button type="button" className="admin-btn-reset" onClick={handleResetFilter}>
          Reset
        </button>
      </div>

      {/*  Add / Edit Modal */}
      {showForm && (
        <div className="admin-modal-backdrop" onClick={resetForm}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingId ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}
              </h3>
              <button type="button" className="admin-modal-close" onClick={resetForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                {/* 1. Clinic Dropdown */}
                <div>
                  <label className="admin-form-label">
                    Clinic *
                  </label>
                  <select
                    className="admin-select"
                    value={form.clinic_id}
                    onChange={(e) => setForm({ ...form, clinic_id: e.target.value })}
                    required
                  >
                    <option value="">Select Clinic</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Day Dropdown */}
                <div>
                  <label className="admin-form-label">
                    Day *
                  </label>
                  <select
                    className="admin-select"
                    value={form.day_of_week}
                    onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                    required
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Start Time */}
                <div>
                  <label className="admin-form-label">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    className="admin-input"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    required
                  />
                </div>

                {/* 4. End Time */}
                <div>
                  <label className="admin-form-label">
                    End Time *
                  </label>
                  <input
                    type="time"
                    className="admin-input"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    required
                  />
                </div>

                {/* 5. Slot Duration Dropdown */}
                <div>
                  <label className="admin-form-label">
                    Slot Duration *
                  </label>
                  <select
                    className="admin-select"
                    value={form.slot_duration}
                    onChange={(e) => setForm({ ...form, slot_duration: e.target.value })}
                    required
                  >
                    {SLOT_DURATIONS.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur} Minutes
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Maximum Booking */}
                <div>
                  <label className="admin-form-label">
                    Maximum Booking *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="admin-input"
                    value={form.maximum_booking}
                    onChange={(e) => setForm({ ...form, maximum_booking: e.target.value })}
                    placeholder="e.g. 20"
                    required
                  />
                </div>

                {/* 7. Available Switch */}
                <div>
                  <label className="admin-form-label">
                    Available Status *
                  </label>
                  <select
                    className="admin-select"
                    value={form.is_available ? 'true' : 'false'}
                    onChange={(e) => setForm({ ...form, is_available: e.target.value === 'true' })}
                    required
                  >
                    <option value="true">Active (Available)</option>
                    <option value="false">Inactive (Unavailable)</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Schedule' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule List Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">Loading Schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">No schedule slots created yet.</p>
          </div>
        ) : (
          <div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Clinic</th>
                    <th>Day</th>
                    <th>Timing</th>
                    <th>Slot Duration</th>
                    <th>Max Booking</th>
                    <th>Status</th>
                    <th className="admin-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSchedules.map((sch) => {
                    const dayObj = DAYS_OF_WEEK.find((d) => d.key === sch.day_of_week);
                    const dayLabel = dayObj ? dayObj.label : sch.day_of_week;
                    const clinicName = sch.clinic?.name || 'Medi Growth Clinic';

                    return (
                      <tr key={sch.id}>
                        <td className="admin-font-bold">{clinicName}</td>
                        <td className="admin-visit-type">{dayLabel}</td>
                        <td>
                          {sch.start_time} - {sch.end_time}
                        </td>
                        <td>{sch.slot_duration || 15} Mins</td>
                        <td>{sch.maximum_booking || '-'} Patients</td>
                        <td>
                          <span className={`admin-badge ${sch.is_available ? 'active' : 'inactive'}`}>
                            {sch.is_available ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="admin-text-right">
                          <div className="admin-table-actions-cell">
                            <button
                              type="button"
                              className="admin-action-btn-edit"
                              onClick={() => handleEdit(sch)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn-delete"
                              onClick={() => handleDelete(sch)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Style Pagination */}
            {totalPages > 0 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing page {currentPage} of {totalPages} ({totalCount} total schedule slots)
                </span>
                <div className="admin-pagination-actions">
                  <button
                    type="button"
                    className="admin-btn-reset"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="admin-btn-apply"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
