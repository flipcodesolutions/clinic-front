'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  createConsultationRecord,
  getDoctorSchedules,
} from '@/services/doctor/appointmentService';
import { showError, showSuccess } from '@/utils/toast';

const VISIT_TYPES = [
  { key: '', label: 'All Visit Types' },
  { key: 'new', label: 'New Visit' },
  { key: 'follow_up', label: 'Follow Up' },
  { key: 'emergency', label: 'Emergency' },
];

const STATUS_FILTERS = [
  { key: '', label: 'All Statuses' },
  { key: 'booked', label: 'Booked' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'completed', label: 'Completed' },
  { key: 'no_show', label: 'No Show' },
];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({ search: '', status: '', visitType: '' });

  // Pagination & Page Size Limit (City Master Style)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Three Dots Dropdown Menu State
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // View Details Modal (SS1)
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Update Status Modal
  const [statusModalAppt, setStatusModalAppt] = useState(null);
  const [newStatus, setNewStatus] = useState('confirmed');
  const [statusRemarks, setStatusRemarks] = useState('');

  // Complete & Prescribe Modal
  const [completeModalAppt, setCompleteModalAppt] = useState(null);
  const [vitalsForm, setVitalsForm] = useState({
    height_cm: '',
    weight_kg: '',
    blood_pressure: '',
    pulse_rate: '',
    temperature: '',
  });
  const [recordForm, setRecordForm] = useState({
    symptoms: '',
    diagnosis: '',
    notes: '',
  });

  const fetchData = useCallback(async (filters = activeFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.visitType) params.visit_type = filters.visitType;

      const [apptRes, schedRes] = await Promise.all([
        getDoctorAppointments(params),
        getDoctorSchedules(),
      ]);

      if (apptRes?.success && Array.isArray(apptRes?.data)) {
        setAppointments(apptRes.data);
      }
      if (schedRes?.success && Array.isArray(schedRes?.data)) {
        setSchedules(schedRes.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showError(error, 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchData();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fetchData]);

  const handleApplyFilter = () => {
    const filters = { search: search.trim(), status: statusFilter, visitType: visitTypeFilter };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchData(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setVisitTypeFilter('');
    setItemsPerPage(10);
    const filters = { search: '', status: '', visitType: '' };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchData(filters);
  };

  // Status Modal Action
  const handleOpenStatusModal = (appt) => {
    setStatusModalAppt(appt);
    setNewStatus(appt.status || 'confirmed');
    setStatusRemarks(appt.remarks || '');
    setOpenDropdownId(null);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!statusModalAppt) return;

    try {
      setSaving(true);
      const res = await updateAppointmentStatus(statusModalAppt.id, {
        status: newStatus,
        remarks: statusRemarks,
      });

      if (res?.success) {
        showSuccess(res.message || `Appointment status updated to ${newStatus}`);
        setStatusModalAppt(null);
        fetchData(activeFilters);
      }
    } catch (error) {
      showError(error, 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  // Complete & Prescribe Action
  const handleOpenCompleteModal = (appt) => {
    setCompleteModalAppt(appt);
    setOpenDropdownId(null);
    const existingVital = appt.vital || {};
    const existingRecord = appt.medicalRecord || {};

    setVitalsForm({
      height_cm: existingVital.height_cm ? String(existingVital.height_cm) : '',
      weight_kg: existingVital.weight_kg ? String(existingVital.weight_kg) : '',
      blood_pressure: existingVital.blood_pressure || '',
      pulse_rate: existingVital.pulse_rate ? String(existingVital.pulse_rate) : '',
      temperature: existingVital.temperature ? String(existingVital.temperature) : '',
    });
    setRecordForm({
      symptoms: existingRecord.symptoms || appt.reason_for_visit || '',
      diagnosis: existingRecord.diagnosis || '',
      notes: existingRecord.notes || '',
    });
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!completeModalAppt) return;

    try {
      setSaving(true);
      const payload = {
        vitals: {
          height_cm: vitalsForm.height_cm ? parseFloat(vitalsForm.height_cm) : null,
          weight_kg: vitalsForm.weight_kg ? parseFloat(vitalsForm.weight_kg) : null,
          blood_pressure: vitalsForm.blood_pressure || null,
          pulse_rate: vitalsForm.pulse_rate ? parseInt(vitalsForm.pulse_rate, 10) : null,
          temperature: vitalsForm.temperature ? parseFloat(vitalsForm.temperature) : null,
        },
        medicalRecord: {
          symptoms: recordForm.symptoms,
          diagnosis: recordForm.diagnosis,
          notes: recordForm.notes,
        },
      };

      const res = await createConsultationRecord(completeModalAppt.id, payload);
      if (res?.success) {
        showSuccess('Consultation completed successfully');
        setCompleteModalAppt(null);
        fetchData(activeFilters);
      }
    } catch (error) {
      showError(error, 'Failed to save consultation details');
    } finally {
      setSaving(false);
    }
  };

  // Filtered Appointments client fallback
  const filteredAppointments = appointments.filter((apt) => {
    const statusMatch = !activeFilters.status ? true : apt.status === activeFilters.status;
    const visitMatch = !activeFilters.visitType ? true : apt.visit_type === activeFilters.visitType;

    const patientName = apt.patient?.user
      ? `${apt.patient.user.first_name || ''} ${apt.patient.user.last_name || ''}`.toLowerCase()
      : '';
    const aptNumber = (apt.appointment_number || '').toLowerCase();
    const searchMatch = !activeFilters.search
      ? true
      : patientName.includes(activeFilters.search.toLowerCase()) ||
        aptNumber.includes(activeFilters.search.toLowerCase());

    return statusMatch && visitMatch && searchMatch;
  });

  // Pagination Math
  const totalCount = filteredAppointments.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeClass = (st) => {
    switch (st) {
      case 'completed':
      case 'confirmed':
        return 'admin-badge active';
      case 'cancelled':
      case 'no_show':
        return 'admin-badge inactive';
      case 'booked':
      default:
        return 'admin-badge pending';
    }
  };

  return (
    <div className="doc-appointments" ref={dropdownRef}>
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Appointments & Consultations</h1>
          <p className="admin-subtitle">Track patient bookings, update statuses, and log consultation notes</p>
        </div>
      </div>

      {/* City Master Style Filter Bar with Items Per Page Dropdown */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search by patient name or appointment number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          className="admin-filter-select"
          value={visitTypeFilter}
          onChange={(e) => setVisitTypeFilter(e.target.value)}
        >
          {VISIT_TYPES.map((v) => (
            <option key={v.key} value={v.key}>
              {v.label}
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

      {/* Appointments List Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">Loading Appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">No appointments found.</p>
          </div>
        ) : (
          <div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Appt #</th>
                    <th>Patient Name</th>
                    <th>Clinic</th>
                    <th>Date & Time</th>
                    <th>Visit Type</th>
                    <th>Status</th>
                    <th className="admin-text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map((apt) => {
                    const patientUser = apt.patient?.user || {};
                    const patientName = patientUser.first_name
                      ? `${patientUser.first_name} ${patientUser.last_name || ''}`.trim()
                      : `Patient #${apt.patient_id}`;
                    const clinicName = apt.clinic?.name || 'Medi Growth Clinic';
                    const isDropdownOpen = openDropdownId === apt.id;

                    return (
                      <tr key={apt.id}>
                        <td className="admin-font-bold">
                          {apt.appointment_number || `#APT-${apt.id}`}
                        </td>
                        <td className="admin-font-bold">{patientName}</td>
                        <td>{clinicName}</td>
                        <td>
                          <div>{apt.appointment_date}</div>
                          <div className="admin-sub-text">{apt.start_time} - {apt.end_time}</div>
                        </td>
                        <td>
                          {(apt.visit_type || 'new').replace('_', ' ')}
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(apt.status)}>
                            {(apt.status || 'booked').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="admin-text-right">
                          <div className="admin-dots-dropdown-wrap">
                            <button
                              type="button"
                              className="admin-dots-btn"
                              onClick={() => setOpenDropdownId(isDropdownOpen ? null : apt.id)}
                              title="Actions Menu"
                            >
                              ⋮
                            </button>

                            {isDropdownOpen && (
                              <div className="admin-dots-dropdown-menu">
                                <button
                                  type="button"
                                  className="admin-dots-item"
                                  onClick={() => {
                                    setSelectedAppt(apt);
                                    setOpenDropdownId(null);
                                  }}
                                >
                                  👁️ View Details
                                </button>
                                <button
                                  type="button"
                                  className="admin-dots-item"
                                  onClick={() => handleOpenStatusModal(apt)}
                                >
                                  🔄 Update Status
                                </button>
                                {apt.status !== 'completed' && (
                                  <button
                                    type="button"
                                    className="admin-dots-item"
                                    onClick={() => handleOpenCompleteModal(apt)}
                                  >
                                    🩺 Log Consultation
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/*Pagination */}
            {totalPages > 0 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  Showing page {currentPage} of {totalPages} ({totalCount} total appointments)
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

      {/* MODAL 1: VIEW APPOINTMENT DETAILS */}
      {selectedAppt && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedAppt(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                Appointment Details
              </h3>
              <button type="button" className="admin-modal-close" onClick={() => setSelectedAppt(null)}>
                ✕
              </button>
            </div>

            <div className="admin-form-grid">
              <div>
                <label className="admin-form-label">Appointment Number</label>
                <input className="admin-input admin-input-disabled" value={selectedAppt.appointment_number || `#APT-${selectedAppt.id}`} disabled />
              </div>
              <div>
                <label className="admin-form-label">Clinic</label>
                <input className="admin-input admin-input-disabled" value={selectedAppt.clinic?.name || 'Medi Growth Clinic'} disabled />
              </div>
              <div>
                <label className="admin-form-label">Patient Details</label>
                <input
                  className="admin-input admin-input-disabled"
                  value={
                    selectedAppt.patient?.user
                      ? `${selectedAppt.patient.user.first_name} ${selectedAppt.patient.user.last_name || ''} (${selectedAppt.patient.user.phone || 'No Contact'})`
                      : `Patient #${selectedAppt.patient_id}`
                  }
                  disabled
                />
              </div>
              <div>
                <label className="admin-form-label">Department</label>
                <input className="admin-input admin-input-disabled" value={selectedAppt.department?.name || 'General OPD'} disabled />
              </div>
              <div>
                <label className="admin-form-label">Appointment Date</label>
                <input className="admin-input admin-input-disabled" value={selectedAppt.appointment_date || 'N/A'} disabled />
              </div>
              <div>
                <label className="admin-form-label">Start Time</label>
                <input className="admin-input admin-input-disabled" value={selectedAppt.start_time || 'N/A'} disabled />
              </div>
              <div>
                <label className="admin-form-label">End Time</label>
                <input className="admin-input admin-input-disabled" value={selectedAppt.end_time || 'N/A'} disabled />
              </div>
              <div>
                <label className="admin-form-label">Visit Type</label>
                <input className="admin-input admin-input-disabled" value={(selectedAppt.visit_type || 'new').replace('_', ' ')} disabled />
              </div>
              <div>
                <label className="admin-form-label">Consultation Type</label>
                <input className="admin-input admin-input-disabled" value={(selectedAppt.consultation_type || 'in_person').replace('_', ' ')} disabled />
              </div>
              <div>
                <label className="admin-form-label">Booked By</label>
                <input
                  className="admin-input admin-input-disabled"
                  value={
                    selectedAppt.bookedByUser
                      ? `${selectedAppt.bookedByUser.first_name} ${selectedAppt.bookedByUser.last_name || ''}`
                      : 'Patient Self-Booked'
                  }
                  disabled
                />
              </div>
              <div>
                <label className="admin-form-label">Current Status</label>
                <input className="admin-input admin-input-disabled" value={(selectedAppt.status || 'booked').replace('_', ' ')} disabled />
              </div>
              <div className="admin-form-full">
                <label className="admin-form-label">Reason for Visit</label>
                <textarea className="admin-textarea admin-input-disabled" rows="2" value={selectedAppt.reason_for_visit || 'Routine checkup'} disabled />
              </div>
              <div className="admin-form-full">
                <label className="admin-form-label">Doctor Remarks</label>
                <textarea className="admin-textarea admin-input-disabled" rows="2" value={selectedAppt.remarks || 'No remarks recorded'} disabled />
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-cancel-btn"
                onClick={() => setSelectedAppt(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE STATUS */}
      {statusModalAppt && (
        <div className="admin-modal-backdrop" onClick={() => setStatusModalAppt(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                Update Status: {statusModalAppt.appointment_number || `#APT-${statusModalAppt.id}`}
              </h3>
              <button type="button" className="admin-modal-close" onClick={() => setStatusModalAppt(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              <div className="admin-form-grid">
                <div>
                  <label className="admin-form-label">Select Status *</label>
                  <select
                    className="admin-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  >
                    <option value="booked">Booked</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>

                <div className="admin-form-full">
                  <label className="admin-form-label">Doctor Remarks / Notes</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={statusRemarks}
                    onChange={(e) => setStatusRemarks(e.target.value)}
                    placeholder="Enter instructions, cancellation reasons, or status notes..."
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setStatusModalAppt(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG CONSULTATION */}
      {completeModalAppt && (
        <div className="admin-modal-backdrop" onClick={() => setCompleteModalAppt(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                Log Consultation: {completeModalAppt.appointment_number || `#APT-${completeModalAppt.id}`}
              </h3>
              <button type="button" className="admin-modal-close" onClick={() => setCompleteModalAppt(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConsultation}>
              <h4 className="admin-font-bold">1. Patient Vitals</h4>
              <div className="admin-form-grid">
                <div>
                  <label className="admin-form-label">BP (mmHg)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={vitalsForm.blood_pressure}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, blood_pressure: e.target.value })}
                    placeholder="e.g. 120/80"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Pulse (bpm)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={vitalsForm.pulse_rate}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, pulse_rate: e.target.value })}
                    placeholder="e.g. 72"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="admin-input"
                    value={vitalsForm.weight_kg}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, weight_kg: e.target.value })}
                    placeholder="e.g. 68.5"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Height (cm)</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={vitalsForm.height_cm}
                    onChange={(e) => setVitalsForm({ ...vitalsForm, height_cm: e.target.value })}
                    placeholder="e.g. 172"
                  />
                </div>
              </div>

              <h4 className="admin-font-bold">2. Clinical Diagnosis & Record</h4>
              <div className="admin-form-grid">
                <div className="admin-form-full">
                  <label className="admin-form-label">Symptoms *</label>
                  <textarea
                    className="admin-textarea"
                    rows="2"
                    value={recordForm.symptoms}
                    onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })}
                    placeholder="Fever, cough, chest pain..."
                    required
                  />
                </div>

                <div className="admin-form-full">
                  <label className="admin-form-label">Diagnosis *</label>
                  <textarea
                    className="admin-textarea"
                    rows="2"
                    value={recordForm.diagnosis}
                    onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                    placeholder="Clinical diagnosis..."
                    required
                  />
                </div>

                <div className="admin-form-full">
                  <label className="admin-form-label">Notes & Advice</label>
                  <textarea
                    className="admin-textarea"
                    rows="2"
                    value={recordForm.notes}
                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                    placeholder="Dietary instructions, follow up advice..."
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() => setCompleteModalAppt(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-save-btn" disabled={saving}>
                  {saving ? 'Saving Record...' : 'Complete & Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
