'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDoctorSchedules,
  createDoctorSchedule,
  updateDoctorSchedule,
  deleteDoctorSchedule,
} from '@/services/doctor/scheduleService';
import { getDoctorProfile } from '@/services/doctor/profileService';
import { showError, showSuccess } from '@/utils/toast';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday', short: 'Mon', icon: '' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue', icon: '' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed', icon: '' },
  { key: 'thursday', label: 'Thursday', short: 'Thu', icon: '' },
  { key: 'friday', label: 'Friday', short: 'Fri', icon: '' },
  { key: 'saturday', label: 'Saturday', short: 'Sat', icon: '' },
  { key: 'sunday', label: 'Sunday', short: 'Sun', icon: '' },
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
  const [clinics, setClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [rawSchedules, setRawSchedules] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [deletedScheduleIds, setDeletedScheduleIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Initialize weekly plan structure for table view
  const buildInitialWeeklyPlan = useCallback((schedulesList = [], clinicId = '') => {
    const plan = {};

    DAYS_OF_WEEK.forEach((d) => {
      const daySchedules = schedulesList.filter(
        (s) =>
          String(s.day_of_week).toLowerCase() === d.key &&
          (!clinicId || String(s.clinic_id) === String(clinicId))
      );

      const morningSched = daySchedules.find((s) => (s.shift_type || 'morning').toLowerCase() === 'morning');
      const eveningSched = daySchedules.find((s) => (s.shift_type || '').toLowerCase() === 'evening');

      const isAvailable = daySchedules.length > 0
        ? daySchedules.some((s) => Boolean(s.is_available))
        : false;

      const slotDuration = daySchedules[0]?.slot_duration
        ? String(daySchedules[0].slot_duration)
        : '15';

      const maxBooking = daySchedules[0]?.maximum_booking
        ? String(daySchedules[0].maximum_booking)
        : '16';

      plan[d.key] = {
        is_available: isAvailable,
        slot_duration: slotDuration,
        maximum_booking: maxBooking,
        morning: {
          enabled: Boolean(morningSched),
          id: morningSched ? morningSched.id : null,
          start_time: morningSched?.start_time || null,
          end_time: morningSched?.end_time || null,
        },
        evening: {
          enabled: Boolean(eveningSched),
          id: eveningSched ? eveningSched.id : null,
          start_time: eveningSched?.start_time || null,
          end_time: eveningSched?.end_time || null,
        },
      };
    });

    return plan;
  }, []);

  // Fetch schedules and profile data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setDeletedScheduleIds([]);
      const [schedRes, profileRes] = await Promise.all([
        getDoctorSchedules(),
        getDoctorProfile(),
      ]);

      let userClinics = [];
      if (profileRes?.success && profileRes?.data) {
        userClinics = profileRes.data.user?.clinics || profileRes.data.clinics || [];
      }

      setClinics(userClinics);

      const defaultClinicId = userClinics[0]?.id ? String(userClinics[0].id) : '';
      setSelectedClinicId((prev) => prev || defaultClinicId);

      const fetchedSchedules = (schedRes?.success && Array.isArray(schedRes?.data)) ? schedRes.data : [];
      setRawSchedules(fetchedSchedules);

      const initialPlan = buildInitialWeeklyPlan(fetchedSchedules, selectedClinicId || defaultClinicId);
      setWeeklyPlan(initialPlan);
    } catch (error) {
      console.error('Error loading doctor schedule:', error);
      showError(error, 'Failed to load schedule planner');
    } finally {
      setLoading(false);
    }
  }, [buildInitialWeeklyPlan, selectedClinicId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle clinic dropdown change
  const handleClinicChange = (e) => {
    const newClinicId = e.target.value;
    setSelectedClinicId(newClinicId);
    setDeletedScheduleIds([]);
    const updatedPlan = buildInitialWeeklyPlan(rawSchedules, newClinicId);
    setWeeklyPlan(updatedPlan);
  };

  // Toggle Day Available (Clinic On / Off Checkbox)
  const handleToggleDayAvailable = (dayKey) => {
    setWeeklyPlan((prev) => {
      const currentDay = prev[dayKey];
      const nextAvailable = !currentDay.is_available;

      if (!nextAvailable) {
        const idsToDelete = [];
        if (currentDay.morning.id) idsToDelete.push(currentDay.morning.id);
        if (currentDay.evening.id) idsToDelete.push(currentDay.evening.id);

        if (idsToDelete.length > 0) {
          setDeletedScheduleIds((prevIds) => [...new Set([...prevIds, ...idsToDelete])]);
        }
      }

      return {
        ...prev,
        [dayKey]: {
          ...currentDay,
          is_available: nextAvailable,
        },
      };
    });
  };

  // Toggle Morning or Evening Shift for a day
  const handleToggleShift = (dayKey, shiftType) => {
    setWeeklyPlan((prev) => {
      const currentDay = prev[dayKey];
      const shiftData = currentDay[shiftType];
      const nextEnabled = !shiftData.enabled;

      if (!nextEnabled && shiftData.id) {
        setDeletedScheduleIds((prevIds) => [...new Set([...prevIds, shiftData.id])]);
      }

      return {
        ...prev,
        [dayKey]: {
          ...currentDay,
          [shiftType]: {
            ...shiftData,
            enabled: nextEnabled,
          },
        },
      };
    });
  };

  // Update specific input fields for a day
  const handleUpdateDayField = (dayKey, field, value) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }));
  };

  // Update Morning or Evening Time
  const handleUpdateTime = (dayKey, shiftType, timeField, value) => {
    setWeeklyPlan((prev) => {
      const currentDay = prev[dayKey];
      const currentShift = currentDay[shiftType];
      const updatedShift = { ...currentShift, [timeField]: value };

      // Auto compute slots if timing changes
      const mSlots = shiftType === 'morning'
        ? calculateMaxSlots(updatedShift.start_time, updatedShift.end_time, currentDay.slot_duration)
        : calculateMaxSlots(currentDay.morning.start_time, currentDay.morning.end_time, currentDay.slot_duration);

      const eSlots = shiftType === 'evening'
        ? calculateMaxSlots(updatedShift.start_time, updatedShift.end_time, currentDay.slot_duration)
        : calculateMaxSlots(currentDay.evening.start_time, currentDay.evening.end_time, currentDay.slot_duration);

      const totalSlots = (currentDay.morning.enabled && mSlots ? mSlots : 0) + (currentDay.evening.enabled && eSlots ? eSlots : 0);

      return {
        ...prev,
        [dayKey]: {
          ...currentDay,
          maximum_booking: totalSlots > 0 ? String(totalSlots) : currentDay.maximum_booking,
          [shiftType]: updatedShift,
        },
      };
    });
  };

  // Clear/Disable a day's schedule (sets is_available = false, tracks IDs for delete)
  const handleClearDay = (dayKey) => {
    setWeeklyPlan((prev) => {
      const currentDay = prev[dayKey];
      const idsToDelete = [];
      if (currentDay.morning.id) idsToDelete.push(currentDay.morning.id);
      if (currentDay.evening.id) idsToDelete.push(currentDay.evening.id);

      if (idsToDelete.length > 0) {
        setDeletedScheduleIds((prevIds) => [...new Set([...prevIds, ...idsToDelete])]);
      }

      return {
        ...prev,
        [dayKey]: {
          ...currentDay,
          is_available: false,
          morning: { ...currentDay.morning, enabled: false },
          evening: { ...currentDay.evening, enabled: false },
        },
      };
    });
  };

  // Quick Action: Copy Monday to Weekdays (Mon -> Tue-Fri)
  const handleCopyMonToWeekdays = () => {
    const mon = weeklyPlan['monday'];
    if (!mon) return;

    setWeeklyPlan((prev) => {
      const updated = { ...prev };
      ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((dayKey) => {
        updated[dayKey] = {
          ...mon,
          morning: { ...mon.morning, id: prev[dayKey]?.morning?.id || null },
          evening: { ...mon.evening, id: prev[dayKey]?.evening?.id || null },
        };
      });
      return updated;
    });

    showSuccess('Copied Monday schedule to Tue, Wed, Thu & Fri!');
  };

  // Quick Action: Copy Monday to All Days (Mon -> Tue-Sun)
  const handleCopyMonToAllDays = () => {
    const mon = weeklyPlan['monday'];
    if (!mon) return;

    setWeeklyPlan((prev) => {
      const updated = { ...prev };
      ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach((dayKey) => {
        updated[dayKey] = {
          ...mon,
          morning: { ...mon.morning, id: prev[dayKey]?.morning?.id || null },
          evening: { ...mon.evening, id: prev[dayKey]?.evening?.id || null },
        };
      });
      return updated;
    });

    showSuccess('Copied Monday schedule to all days (Tue-Sun)!');
  };

  // Save Weekly Schedule
  const handleSaveAllSchedules = async () => {
    if (!selectedClinicId) {
      showError(null, 'Please select a valid clinic before saving');
      return;
    }

    try {
      setSaving(true);
      const clinicIdNum = parseInt(selectedClinicId, 10);
      const savePromises = [];

      // A. Process deleted schedule IDs tracked from unticking checkboxes
      deletedScheduleIds.forEach((id) => {
        savePromises.push(deleteDoctorSchedule(id));
      });

      // B. Process current weekly plan state
      DAYS_OF_WEEK.forEach((d) => {
        const dayPlan = weeklyPlan[d.key];
        if (!dayPlan) return;

        const buildPayload = (shiftType, shiftData) => ({
          clinic_id: clinicIdNum,
          day_of_week: d.key,
          shift_type: shiftType,
          start_time: shiftData.start_time,
          end_time: shiftData.end_time,
          slot_duration: parseInt(dayPlan.slot_duration, 10),
          maximum_booking:
            calculateMaxSlots(shiftData.start_time, shiftData.end_time, dayPlan.slot_duration) || 16,
          is_available: true,
        });

        if (dayPlan.is_available) {
          // ── Morning Shift ──
          if (dayPlan.morning.enabled && dayPlan.morning.start_time && dayPlan.morning.end_time) {
            const payload = buildPayload('morning', dayPlan.morning);
            if (dayPlan.morning.id) {
              savePromises.push(updateDoctorSchedule(dayPlan.morning.id, payload));
            } else {
              savePromises.push(createDoctorSchedule(payload));
            }
          } else if (dayPlan.morning.id) {
            savePromises.push(deleteDoctorSchedule(dayPlan.morning.id));
          }

          // ── Evening Shift ──
          if (dayPlan.evening.enabled && dayPlan.evening.start_time && dayPlan.evening.end_time) {
            const payload = buildPayload('evening', dayPlan.evening);
            if (dayPlan.evening.id) {
              savePromises.push(updateDoctorSchedule(dayPlan.evening.id, payload));
            } else {
              savePromises.push(createDoctorSchedule(payload));
            }
          } else if (dayPlan.evening.id) {
            savePromises.push(deleteDoctorSchedule(dayPlan.evening.id));
          }

        } else {
          // ── Day is OFF → DELETE both shift records if they exist ──
          if (dayPlan.morning.id) {
            savePromises.push(deleteDoctorSchedule(dayPlan.morning.id));
          }
          if (dayPlan.evening.id) {
            savePromises.push(deleteDoctorSchedule(dayPlan.evening.id));
          }
        }
      });

      if (savePromises.length === 0) {
        showSuccess('Weekly Schedule saved successfully!');
        setDeletedScheduleIds([]);
        await loadData();
        return;
      }

      const results = await Promise.allSettled(savePromises);
      const successful = results.filter((r) => r.status === 'fulfilled');
      const failed = results.filter((r) => r.status === 'rejected');

      if (successful.length > 0) {
        showSuccess(`Weekly Schedule saved successfully! (${successful.length} shift(s) updated)`);
      }
      if (failed.length > 0) {
        const firstErr =
          failed[0]?.reason?.response?.data?.message ||
          failed[0]?.reason?.message ||
          'Some shift slots failed to save';
        showError(null, `Save notice: ${firstErr}`);
      }

      setDeletedScheduleIds([]);
      await loadData();
    } catch (error) {
      console.error('Error saving weekly schedule:', error);
      showError(error, 'Failed to save weekly schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="doc-schedule-container">
      {/* Top Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Weekly Schedule Planner</h1>
          <p className="admin-subtitle">
            Manage your clinic availability, morning & evening session timings, slot duration, and max booking limit for all 7 days
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="doc-planner-toolbar">
        <div className="doc-toolbar-left">
          <div className="doc-clinic-select-group">
            <label className="doc-clinic-select-label"> Select Clinic:</label>
            <select
              className="doc-clinic-select"
              value={selectedClinicId}
              onChange={handleClinicChange}
            >
              <option value="">-- Select Clinic --</option>
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="doc-toolbar-actions">
            <button
              type="button"
              className="doc-toolbar-btn"
              onClick={handleCopyMonToWeekdays}
              title="Copy Monday timings to Tue, Wed, Thu & Fri"
            >
              Copy Mon → Weekdays
            </button>
            <button
              type="button"
              className="doc-toolbar-btn"
              onClick={handleCopyMonToAllDays}
              title="Copy Monday timings to all other 6 days"
            >
              Copy Mon → All Days
            </button>
          </div>
        </div>

        <button
          type="button"
          className="doc-save-all-btn"
          onClick={handleSaveAllSchedules}
          disabled={saving || loading}
        >
          {saving ? 'Saving Changes...' : ' Save Weekly Schedule'}
        </button>
      </div>

      {/* 7 Days Table View */}
      {loading ? (
        <div className="admin-table-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p className="admin-empty-state">Loading Weekly Schedule Data...</p>
        </div>
      ) : (
        <div className="doc-table-card">
          <table className="doc-schedule-table">
            <thead>
              <tr>
                <th className="doc-th-center" style={{ width: '100px' }}>Clinic On/Off</th>
                <th style={{ width: '120px' }}>Days</th>
                <th>Morning Shift (Start - End)</th>
                <th>Evening Shift (Start - End)</th>
                <th style={{ width: '130px' }}>Slot Duration</th>
                <th style={{ width: '140px' }}>Max Patients</th>
              </tr>
            </thead>
            <tbody>
              {DAYS_OF_WEEK.map((d) => {
                const dayPlan = weeklyPlan[d.key] || {
                  is_available: false,
                  slot_duration: '15',
                  maximum_booking: '16',
                  morning: { enabled: false, id: null, start_time: null, end_time: null },
                  evening: { enabled: false, id: null, start_time: null, end_time: null },
                };

                const isOff = !dayPlan.is_available;

                const mSlots = dayPlan.morning.enabled
                  ? calculateMaxSlots(dayPlan.morning.start_time, dayPlan.morning.end_time, dayPlan.slot_duration)
                  : null;

                const eSlots = dayPlan.evening.enabled
                  ? calculateMaxSlots(dayPlan.evening.start_time, dayPlan.evening.end_time, dayPlan.slot_duration)
                  : null;

                const calculatedTotalSlots = (mSlots || 0) + (eSlots || 0);

                return (
                  <tr key={d.key} className={`doc-schedule-tr ${isOff ? 'row-off' : ''}`}>
                    {/* 1. Clinic Off / On Checkbox */}
                    <td className="doc-td-center">
                      <label className="doc-checkbox-wrapper">
                        <input
                          type="checkbox"
                          className="doc-checkbox-input"
                          checked={dayPlan.is_available}
                          onChange={() => handleToggleDayAvailable(d.key)}
                        />
                        <span className={`doc-status-tag ${dayPlan.is_available ? 'tag-on' : 'tag-off'}`}>
                          {dayPlan.is_available ? 'ON' : 'OFF'}
                        </span>
                      </label>
                    </td>

                    {/* 2. Days */}
                    <td>
                      <div className="doc-day-cell">
                        <span className="doc-day-icon">{d.icon}</span>
                        <span className="doc-day-label">{d.label}</span>
                      </div>
                    </td>

                    {/* 3. Morning Shift */}
                    <td>
                      <div className="doc-shift-cell-group">
                        <label className="doc-shift-checkbox-label">
                          <input
                            type="checkbox"
                            checked={dayPlan.morning.enabled}
                            disabled={isOff}
                            onChange={() => handleToggleShift(d.key, 'morning')}
                          />
                          <span>Morning</span>
                        </label>
                        {dayPlan.morning.enabled && !isOff && (
                          <div className="doc-time-inputs-pair">
                            <input
                              type="time"
                              className="doc-table-time-input"
                              value={dayPlan.morning.start_time ?? ''}
                              onChange={(e) => handleUpdateTime(d.key, 'morning', 'start_time', e.target.value)}
                            />
                            <span className="doc-time-separator">to</span>
                            <input
                              type="time"
                              className="doc-table-time-input"
                              value={dayPlan.morning.end_time ?? ''}
                              onChange={(e) => handleUpdateTime(d.key, 'morning', 'end_time', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 4. Evening Shift */}
                    <td>
                      <div className="doc-shift-cell-group">
                        <label className="doc-shift-checkbox-label">
                          <input
                            type="checkbox"
                            checked={dayPlan.evening.enabled}
                            disabled={isOff}
                            onChange={() => handleToggleShift(d.key, 'evening')}
                          />
                          <span>Evening</span>
                        </label>
                        {dayPlan.evening.enabled && !isOff && (
                          <div className="doc-time-inputs-pair">
                            <input
                              type="time"
                              className="doc-table-time-input"
                              value={dayPlan.evening.start_time ?? ''}
                              onChange={(e) => handleUpdateTime(d.key, 'evening', 'start_time', e.target.value)}
                            />
                            <span className="doc-time-separator">to</span>
                            <input
                              type="time"
                              className="doc-table-time-input"
                              value={dayPlan.evening.end_time ?? ''}
                              onChange={(e) => handleUpdateTime(d.key, 'evening', 'end_time', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* 5. Slot Duration */}
                    <td>
                      <select
                        className="doc-table-select"
                        value={dayPlan.slot_duration}
                        disabled={isOff}
                        onChange={(e) => handleUpdateDayField(d.key, 'slot_duration', e.target.value)}
                      >
                        {SLOT_DURATIONS.map((dur) => (
                          <option key={dur} value={dur}>
                            {dur} Mins
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* 6. Max Patients / Slots */}
                    <td>
                      <div className="doc-max-patients-cell">
                        <input
                          type="number"
                          min="1"
                          className="doc-table-number-input"
                          value={calculatedTotalSlots > 0 ? calculatedTotalSlots : dayPlan.maximum_booking}
                          readOnly
                          disabled={isOff}
                          title="Max Patients automatically matches total calculated slots"
                        />
                        <span className="doc-slots-badge">
                          Slots: {calculatedTotalSlots > 0 ? calculatedTotalSlots : dayPlan.maximum_booking}
                        </span>
                      </div>
                    </td>


                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
