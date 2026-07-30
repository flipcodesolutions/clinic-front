'use client';
import { useState, useEffect, useCallback } from 'react';
import { getDoctorPatients, getDoctorPatientDetails } from '@/services/doctor/patientService';
import { showError } from '@/utils/toast';
import { API_BASE_URL } from '@/config/api';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({ search: '', gender: '' });

  // Pagination & Page Size Limit (City Master Style)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selected Patient Details View State
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientDetailData, setPatientDetailData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchPatients = useCallback(async (filters = activeFilters) => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.gender) params.gender = filters.gender;

      const res = await getDoctorPatients(params);
      if (res?.success && Array.isArray(res?.data)) {
        setPatients(res.data);
      }
    } catch (error) {
      console.error('Error fetching patients list:', error);
      showError(error, 'Failed to fetch patient list');
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleApplyFilter = () => {
    const filters = { search: search.trim(), gender: genderFilter };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchPatients(filters);
  };

  const handleResetFilter = () => {
    setSearch('');
    setGenderFilter('');
    setItemsPerPage(10);
    const filters = { search: '', gender: '' };
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchPatients(filters);
  };

  const handleSelectPatient = async (patientId) => {
    setSelectedPatientId(patientId);
    try {
      setLoadingDetails(true);
      const res = await getDoctorPatientDetails(patientId);
      if (res?.success && res?.data) {
        setPatientDetailData(res.data);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      showError(error, 'Failed to fetch patient details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleBackToList = () => {
    setSelectedPatientId(null);
    setPatientDetailData(null);
  };

  const getFullImageUrl = (url) => {
    if (!url) return '';
    const cleanUrl = String(url).trim();
    if (cleanUrl.startsWith('data:') || cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    const backendHost = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : '';
    const cleanPath = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
    return `${backendHost}${cleanPath}`;
  };

  // Filtered patients client-side fallback
  const filteredPatients = patients.filter((pt) => {
    const user = pt.user || {};
    const genderMatch = !activeFilters.gender ? true : (pt.gender || '').toLowerCase() === activeFilters.gender.toLowerCase();
    
    const name = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phone || pt.emergency_contact || '').toLowerCase();

    const searchMatch = !activeFilters.search
      ? true
      : name.includes(activeFilters.search.toLowerCase()) ||
        email.includes(activeFilters.search.toLowerCase()) ||
        phone.includes(activeFilters.search.toLowerCase());

    return genderMatch && searchMatch;
  });

  // Pagination Math
  const totalCount = filteredPatients.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  //  PATIENT DETAILS VIEW
  if (selectedPatientId) {
    const pt = patientDetailData?.patient;
    const user = pt?.user || {};
    const appts = patientDetailData?.appointmentsHistory || [];

    return (
      <div className="doc-patient-details-view">
        {/* Top Header & Back Button */}
        <div className="admin-header">
          <div>
            <button
              type="button"
              className="admin-action-btn-view"
              onClick={handleBackToList}
            >
              ← Back to Patient List
            </button>
            <h1 className="admin-title">
              Patient Details: {user.first_name ? `${user.first_name} ${user.last_name || ''}` : `Patient #${selectedPatientId}`}
            </h1>
            <p className="admin-subtitle">View patient summary, vitals, medical records, and appointment history</p>
          </div>
        </div>

        {loadingDetails ? (
          <div className="admin-table-card admin-empty-state">
            <p>Loading Patient Details...</p>
          </div>
        ) : (
          <div>
            {/* Patient Personal Summary Card */}
            <div className="doc-profile-card">
              <div className="doc-profile-header-banner">
                <div className="doc-photo-upload-wrap">
                  {user.profile_image ? (
                    <img src={getFullImageUrl(user.profile_image)} alt="Patient" className="doc-photo-img" />
                  ) : (
                    <div className="doc-photo-placeholder">
                      {user.first_name ? user.first_name[0].toUpperCase() : 'P'}
                    </div>
                  )}
                </div>

                <div className="doc-profile-info-wrap">
                  <h2 className="doc-profile-name">
                    {user.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Patient Profile'}
                  </h2>
                  <p className="doc-profile-spec">
                    📧 {user.email || 'N/A'} • 📱 {user.phone || 'N/A'}
                  </p>
                  <div className="doc-profile-meta">
                    <span>Gender: <strong>{pt?.gender || 'N/A'}</strong></span>
                    <span>•</span>
                    <span>DOB: <strong>{pt?.dob ? pt.dob.split('T')[0] : 'N/A'}</strong></span>
                    <span>•</span>
                    <span>Blood Group: <strong>{pt?.blood_group || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Extra Details Grid */}
              <div className="admin-form-grid">
                <div>
                  <label className="admin-form-label">Emergency Contact</label>
                  <input className="admin-input admin-input-disabled" value={pt?.emergency_contact || 'N/A'} disabled />
                </div>
                <div>
                  <label className="admin-form-label">City / Location</label>
                  <input className="admin-input admin-input-disabled" value={pt?.city || 'N/A'} disabled />
                </div>
                <div className="admin-form-full">
                  <label className="admin-form-label">Address</label>
                  <input className="admin-input admin-input-disabled" value={pt?.address || 'N/A'} disabled />
                </div>
                <div className="admin-form-full">
                  <label className="admin-form-label">Known Allergies / Medical History</label>
                  <textarea className="admin-textarea admin-input-disabled" rows="2" value={pt?.medical_history || 'No allergies recorded'} disabled />
                </div>
              </div>
            </div>

            {/* Appointment & Medical History Table */}
            <div className="admin-table-card">
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">
                  Appointment & Medical History ({appts.length})
                </h3>
              </div>

              {appts.length === 0 ? (
                <div className="admin-empty-state">
                  <p>No appointment records found for this patient.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Appt #</th>
                        <th>Date & Time</th>
                        <th>Clinic</th>
                        <th>Visit Type</th>
                        <th>Status</th>
                        <th>Vitals / Diagnosis</th>
                        <th>Prescriptions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appts.map((apt) => {
                        const vital = apt.vital;
                        const rec = apt.medicalRecord;
                        const rx = apt.prescription;

                        return (
                          <tr key={apt.id}>
                            <td className="admin-font-bold">
                              {apt.appointment_number || `#APT-${apt.id}`}
                            </td>
                            <td>
                              <div>{apt.appointment_date}</div>
                              <div className="admin-sub-text">{apt.start_time}</div>
                            </td>
                            <td>{apt.clinic?.name || 'Clinic'}</td>
                            <td>
                              {(apt.visit_type || 'new').replace('_', ' ')}
                            </td>
                            <td>
                              <span className={`admin-badge ${apt.status === 'completed' || apt.status === 'confirmed' ? 'active' : 'pending'}`}>
                                {(apt.status || 'scheduled').replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              {vital && (
                                <div>BP: {vital.blood_pressure || '-'} | Pulse: {vital.pulse_rate || '-'}</div>
                              )}
                              {rec && (
                                <div className="admin-font-bold">Diag: {rec.diagnosis || '-'}</div>
                              )}
                              {!vital && !rec && '-'}
                            </td>
                            <td>
                              {rx?.medicines && rx.medicines.length > 0 ? (
                                <div>{rx.medicines.map((m) => m.medicine_name).join(', ')}</div>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIEW 1: PATIENT LIST VIEW (Default)
  return (
    <div className="doc-patients-list-view">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">My Patients</h1>
          <p className="admin-subtitle">View patient directory, profile details, and consultation records</p>
        </div>
      </div>

      {/* Filter Bar with Items Per Page Dropdown */}
      <div className="admin-filter-bar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search patients by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
        />
        <select
          className="admin-filter-select"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
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

      {/* Patients List Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">Loading Patient List...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="admin-table-wrap">
            <p className="admin-empty-state">No patients found.</p>
          </div>
        ) : (
          <div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Contact Phone</th>
                    <th>Email Address</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Blood Group</th>
                    <th className="admin-text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPatients.map((pt) => {
                    const user = pt.user || {};
                    const fullName = user.first_name
                      ? `${user.first_name} ${user.last_name || ''}`.trim()
                      : `Patient #${pt.id}`;

                    return (
                      <tr key={pt.id}>
                        <td className="admin-font-bold">
                          {fullName}
                        </td>
                        <td>{user.phone || pt.emergency_contact || 'N/A'}</td>
                        <td>{user.email || 'N/A'}</td>
                        <td>{pt.gender || 'N/A'}</td>
                        <td>{pt.dob ? pt.dob.split('T')[0] : 'N/A'}</td>
                        <td>
                          <span className="admin-badge active admin-badge-sm">
                            {pt.blood_group || 'N/A'}
                          </span>
                        </td>
                        <td className="admin-text-right">
                          <button
                            type="button"
                            className="admin-action-btn-view"
                            onClick={() => handleSelectPatient(pt.id)}
                          >
                            View Details →
                          </button>
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
                  Showing page {currentPage} of {totalPages} ({totalCount} total patients)
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
