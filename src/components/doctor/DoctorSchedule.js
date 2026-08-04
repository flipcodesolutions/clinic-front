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

const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return hours * 60 + minutes;
};

const calculateMaxSlots = (startStr, endStr, durationStr) => {
  const startMins = timeToMinutes(startStr);
  const endMins = timeToMinutes(endStr);
  const duration = Number(durationStr);

  if (startMins !== null && endMins !== null && startMins < endMins && duration > 0 && !isNaN(duration)) {
    const totalWorkingMinutes = endMins - startMins;
    if (totalWorkingMinutes % duration === 0) {
      return totalWorkingMinutes / duration;
    }
  }
  return null;
};

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

  // Pagination & Page Size Limit
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [form, setForm] = useState({
    clinic_id: '',
    day_of_week: 'monday',
    shift_type: 'morning',
    start_time: '09:00',
    end_time: '17:00',
    slot_duration: '15',
    maximum_booking: '32',
    is_available: true,
  });

  const [errors, setErrors] = useState({});

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
    const initialStart = '09:00';
    const initialEnd = '17:00';
    const initialDur = '15';
    const computedSlots = calculateMaxSlots(initialStart, initialEnd, initialDur) || 32;

    setForm({
      clinic_id: clinics[0]?.id ? String(clinics[0].id) : '',
      day_of_week: 'monday',
      shift_type: 'morning',
      start_time: initialStart,
      end_time: initialEnd,
      slot_duration: initialDur,
      maximum_booking: String(computedSlots),
      is_available: true,
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (sch) => {
    setEditingId(sch.id);
    const sStart = sch.start_time || '09:00';
    const sEnd = sch.end_time || '17:00';
    const sDur = sch.slot_duration ? String(sch.slot_duration) : '15';
    const autoSlots = calculateMaxSlots(sStart, sEnd, sDur);
    const maxVal = sch.maximum_booking ? String(sch.maximum_booking) : (autoSlots ? String(autoSlots) : '20');

    setForm({
      clinic_id: sch.clinic_id ? String(sch.clinic_id) : (clinics[0]?.id ? String(clinics[0].id) : ''),
      day_of_week: sch.day_of_week || 'monday',
      shift_type: sch.shift_type || 'morning',
      start_time: sStart,
      end_time: sEnd,
      slot_duration: sDur,
      maximum_booking: maxVal,
      is_available: sch.is_available !== undefined ? Boolean(sch.is_available) : true,
    });
    setErrors({});
    setShowForm(true);
  };

  // Helper to handle time & duration changes with Auto-Calculation of Max Booking
  const handleTimeOrDurationChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      const autoSlots = calculateMaxSlots(updated.start_time, updated.end_time, updated.slot_duration);
      if (autoSlots !== null && autoSlots > 0) {
        updated.maximum_booking = String(autoSlots);
      }
      return updated;
    });

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      start_time: undefined,
      end_time: undefined,
      slot_duration: undefined,
      maximum_booking: undefined,
    }));
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

  // Comprehensive Frontend Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Clinic
    if (!form.clinic_id) {
      newErrors.clinic_id = 'Clinic selection is required';
    } else {
      const clinicExists = clinics.some((c) => String(c.id) === String(form.clinic_id));
      if (!clinicExists) {
        newErrors.clinic_id = 'Selected clinic does not exist or belong to doctor';
      }
    }

    // 2. Day
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!form.day_of_week || !validDays.includes(String(form.day_of_week).toLowerCase())) {
      newErrors.day_of_week = 'Please select a valid day of the week';
    }

    // 3. Shift / Session
    if (!form.shift_type) {
      newErrors.shift_type = 'Please select a slot shift / session';
    }

    // 4 & 5. Start Time & End Time
    const startMins = timeToMinutes(form.start_time);
    const endMins = timeToMinutes(form.end_time);

    if (startMins === null) {
      newErrors.start_time = 'Please select a valid start time';
    }
    if (endMins === null) {
      newErrors.end_time = 'Please select a valid end time';
    }
    if (startMins !== null && endMins !== null) {
      if (startMins === endMins) {
        newErrors.end_time = 'Start Time and End Time cannot be the same';
      } else if (startMins > endMins) {
        newErrors.start_time = 'Start Time must be earlier than End Time';
        newErrors.end_time = 'End Time must be greater than Start Time';
      }
    }

    // 6. Slot Duration
    const duration = Number(form.slot_duration);
    if (!form.slot_duration || isNaN(duration) || duration <= 0 || !Number.isInteger(duration)) {
      newErrors.slot_duration = 'Slot Duration must be a positive integer';
    } else if (startMins !== null && endMins !== null && startMins < endMins) {
      const totalWorkingMinutes = endMins - startMins;
      if (totalWorkingMinutes % duration !== 0) {
        newErrors.slot_duration = `Slot duration (${duration} mins) does not divide working time (${totalWorkingMinutes} mins) evenly`;
      }
    }

    // 7. Maximum Booking with Upper Limit Auto-Check
    const maxBooking = Number(form.maximum_booking);
    const maxPossibleSlots = calculateMaxSlots(form.start_time, form.end_time, form.slot_duration);

    if (
      form.maximum_booking === '' ||
      form.maximum_booking === null ||
      form.maximum_booking === undefined ||
      isNaN(maxBooking) ||
      !Number.isInteger(maxBooking) ||
      maxBooking <= 0
    ) {
      newErrors.maximum_booking = 'Maximum Booking must be a positive integer greater than 0';
    } else if (maxPossibleSlots !== null && maxBooking > maxPossibleSlots) {
      newErrors.maximum_booking = `Maximum Booking (${maxBooking}) cannot exceed total available slots (${maxPossibleSlots} slots between ${form.start_time} and ${form.end_time})`;
    }

    // 8. Available Status: DO NOT add any validation for Available Status.

    // 9 & 10. Overlapping / Duplicate check
    if (form.clinic_id && form.day_of_week && startMins !== null && endMins !== null && startMins < endMins) {
      const overlap = schedules.find((sch) => {
        if (editingId && String(sch.id) === String(editingId)) return false;
        if (String(sch.clinic_id) !== String(form.clinic_id)) return false;
        if (String(sch.day_of_week).toLowerCase() !== String(form.day_of_week).toLowerCase()) return false;

        const existStart = timeToMinutes(sch.start_time);
        const existEnd = timeToMinutes(sch.end_time);

        if (existStart === null || existEnd === null || existStart >= existEnd) return false;

        return startMins < existEnd && endMins > existStart;
      });

      if (overlap) {
        const dayLabel = DAYS_OF_WEEK.find((d) => d.key === form.day_of_week)?.label || form.day_of_week;
        const overlapMsg = `Slot timing (${form.start_time} - ${form.end_time}) clashes with existing schedule (${overlap.start_time} - ${overlap.end_time}) on ${dayLabel}. Please choose a different time!`;
        newErrors.start_time = overlapMsg;
        newErrors.end_time = overlapMsg;
      }
    }

    setErrors(newErrors);
    return { valid: Object.keys(newErrors).length === 0, newErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { valid, newErrors } = validateForm();
    if (!valid) {
      const firstErrorMessage =
        newErrors.start_time ||
        newErrors.end_time ||
        newErrors.clinic_id ||
        newErrors.day_of_week ||
        newErrors.shift_type ||
        newErrors.slot_duration ||
        newErrors.maximum_booking ||
        'Please fix the validation errors before submitting';

      showError(null, firstErrorMessage);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        clinic_id: parseInt(form.clinic_id, 10),
        day_of_week: form.day_of_week,
        shift_type: form.shift_type,
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
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to save schedule';
      showError(null, errorMsg);
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

  const currentComputedMax = calculateMaxSlots(form.start_time, form.end_time, form.slot_duration);

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

      {/* Filter Bar */}
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

      {/* Add / Edit Modal */}
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

            <form onSubmit={handleSubmit} noValidate>
              <div className="admin-form-grid">
                {/* 1. Clinic Dropdown */}
                <div>
                  <label className="admin-form-label">
                    Clinic *
                  </label>
                  <select
                    className="admin-select"
                    value={form.clinic_id}
                    onChange={(e) => {
                      setForm({ ...form, clinic_id: e.target.value });
                      setErrors((prev) => ({ ...prev, clinic_id: undefined }));
                    }}
                  >
                    <option value="">Select Clinic</option>
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.clinic_id && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      {errors.clinic_id}
                    </span>
                  )}
                </div>

                {/* 2. Day Dropdown */}
                <div>
                  <label className="admin-form-label">
                    Day *
                  </label>
                  <select
                    className="admin-select"
                    value={form.day_of_week}
                    onChange={(e) => {
                      setForm({ ...form, day_of_week: e.target.value });
                      setErrors((prev) => ({ ...prev, day_of_week: undefined }));
                    }}
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  {errors.day_of_week && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      {errors.day_of_week}
                    </span>
                  )}
                </div>

                {/* 3. Shift / Session Dropdown */}
                <div>
                  <label className="admin-form-label">
                    Shift / Session *
                  </label>
                  <select
                    className="admin-select"
                    value={form.shift_type}
                    onChange={(e) => {
                      setForm({ ...form, shift_type: e.target.value });
                      setErrors((prev) => ({ ...prev, shift_type: undefined }));
                    }}
                  >
                    <option value="morning">☀️ Morning</option>
                    <option value="evening">🌙 Evening</option>
                    <option value="afternoon">🌤️ Afternoon</option>
                  </select>
                  {errors.shift_type && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      {errors.shift_type}
                    </span>
                  )}
                </div>

                {/* 4. Start Time */}
                <div>
                  <label className="admin-form-label">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    className="admin-input"
                    value={form.start_time}
                    onChange={(e) => handleTimeOrDurationChange('start_time', e.target.value)}
                  />
                  {errors.start_time && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      {errors.start_time}
                    </span>
                  )}
                </div>

                {/* 5. End Time */}
                <div>
                  <label className="admin-form-label">
                    End Time *
                  </label>
                  <input
                    type="time"
                    className="admin-input"
                    value={form.end_time}
                    onChange={(e) => handleTimeOrDurationChange('end_time', e.target.value)}
                  />
                  {errors.end_time && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      {errors.end_time}
                    </span>
                  )}
                </div>

                {/* 6. Slot Duration Dropdown */}
                <div>
                  <label className="admin-form-label">
                    Slot Duration *
                  </label>
                  <select
                    className="admin-select"
                    value={form.slot_duration}
                    onChange={(e) => handleTimeOrDurationChange('slot_duration', e.target.value)}
                  >
                    {SLOT_DURATIONS.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur} Minutes
                      </option>
                    ))}
                  </select>
                  {errors.slot_duration && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      {errors.slot_duration}
                    </span>
                  )}
                </div>

                {/* 7. Maximum Booking (Auto-Calculated & Validated Upper Limit) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="admin-form-label">
                      Maximum Booking *
                    </label>
                    {currentComputedMax !== null && (
                      <span style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: '600' }}>
                        Auto-slots: {currentComputedMax}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    className="admin-input"
                    value={form.maximum_booking}
                    onChange={(e) => {
                      setForm({ ...form, maximum_booking: e.target.value });
                      setErrors((prev) => ({ ...prev, maximum_booking: undefined }));
                    }}
                    placeholder="e.g. 20"
                  />
                  {errors.maximum_booking && (
                    <span style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      {errors.maximum_booking}
                    </span>
                  )}
                </div>

                {/* 8. Available Status */}
                <div>
                  <label className="admin-form-label">
                    Available Status *
                  </label>
                  <select
                    className="admin-select"
                    value={form.is_available ? 'true' : 'false'}
                    onChange={(e) => setForm({ ...form, is_available: e.target.value === 'true' })}
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
                    <th>Timing & Shift</th>
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
                    const shiftType = sch.shift_type || 'morning';

                    return (
                      <tr key={sch.id}>
                        <td className="admin-font-bold">{clinicName}</td>
                        <td className="admin-visit-type">{dayLabel}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{sch.start_time} - {sch.end_time}</span>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: '600',
                                color: (shiftType === 'evening' ? '#4f46e5' : shiftType === 'afternoon' ? '#0284c7' : '#d97706'),
                                backgroundColor: (shiftType === 'evening' ? '#e0e7ff' : shiftType === 'afternoon' ? '#e0f2fe' : '#fef3c7'),
                                padding: '2px 8px',
                                borderRadius: '10px',
                                textTransform: 'capitalize',
                              }}
                            >
                              {shiftType === 'evening' ? '🌙 Evening' : shiftType === 'afternoon' ? '🌤️ Afternoon' : '☀️ Morning'}
                            </span>
                          </div>
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

            {/* Pagination */}
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
