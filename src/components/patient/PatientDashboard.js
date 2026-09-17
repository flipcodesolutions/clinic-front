'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserAuth, clearUserSession, setUserAuth, getAuthToken } from '@/utils/auth';
import {
  getPatientAppointments,
  cancelPatientAppointment,
  getPatientProfile,
  updatePatientProfile,
  getPatientShortlist,
  removeDoctorFromShortlist,
  getFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  getPatientPrescriptions,
  createPatientPrescription,
  deletePatientPrescription,
  getPatientLabReports,
  createPatientDocument,
  deletePatientDocument,
} from '@/services/patientService';
import { getDoctorImageUrl } from '@/utils/imageHelper';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);

  // Shortlisted Doctors state
  const [shortlistedDoctors, setShortlistedDoctors] = useState([]);
  const [loadingShortlist, setLoadingShortlist] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male',
    dob: '',
    blood_group: 'B+',
    address: '',
    city: '',
    state: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Family Members state
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loadingFamily, setLoadingFamily] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState(null);
  const [familyForm, setFamilyForm] = useState({
    name: '',
    relation: 'Spouse',
    dob: '',
    gender: 'female',
    blood_group: 'B+',
    phone: '',
  });

  // E-Prescriptions state
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({ title: '', doctor_name: '' });

  // Lab Reports state
  const [labReports, setLabReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ test_name: '', lab_name: '', date: '', file_path: '' });

  useEffect(() => {
    const user = getUserAuth();
    const token = getAuthToken();
    if (!user || !token) {
      clearUserSession();
      router.push('/login?redirect=/patient');
      return;
    }
    setAuthUser(user);

    // Fetch all dynamic data on load
    fetchAllData();
    setLoading(false);
  }, []);

  const fetchAllData = async () => {
    fetchAppointments();
    fetchShortlist();
    fetchFamily();
    fetchPrescriptions();
    fetchLabReports();
    fetchProfileData();
  };

  const fetchAppointments = async () => {
    try {
      setLoadingAppts(true);
      const res = await getPatientAppointments();
      if (res.success) {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
    } finally {
      setLoadingAppts(false);
    }
  };

  const fetchShortlist = async () => {
    try {
      setLoadingShortlist(true);
      const res = await getPatientShortlist();
      if (res.success && Array.isArray(res.data)) {
        setShortlistedDoctors(res.data);
      }
    } catch (err) {
      console.error('Error fetching shortlist:', err);
    } finally {
      setLoadingShortlist(false);
    }
  };

  const fetchFamily = async () => {
    try {
      setLoadingFamily(true);
      const res = await getFamilyMembers();
      if (res.success && Array.isArray(res.data)) {
        setFamilyMembers(res.data);
      }
    } catch (err) {
      console.error('Error fetching family members:', err);
    } finally {
      setLoadingFamily(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      setLoadingPrescriptions(true);
      const res = await getPatientPrescriptions();
      if (res.success && Array.isArray(res.data)) {
        setPrescriptions(res.data);
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const fetchLabReports = async () => {
    try {
      setLoadingReports(true);
      const res = await getPatientLabReports();
      if (res.success && Array.isArray(res.data)) {
        setLabReports(res.data);
      }
    } catch (err) {
      console.error('Error fetching lab reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await getPatientProfile();
      if (res.success && res.data) {
        const u = res.data.user || {};
        setProfile({
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          email: u.email || '',
          phone: u.phone || '',
          gender: res.data.gender || 'male',
          dob: res.data.dob || '',
          blood_group: res.data.blood_group || 'B+',
          address: res.data.address || '',
          city: res.data.city || '',
          state: res.data.state || '',
        });
      }
    } catch (err) {
      console.error('Error fetching patient profile:', err);
    }
  };

  const handleSignOut = () => {
    clearUserSession();
    toast.success('Signed out successfully');
    router.push('/');
  };

  const handleCancelAppt = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment request?')) return;
    try {
      const res = await cancelPatientAppointment(id, 'Cancelled by patient');
      if (res.success) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      } else {
        toast.error(res.message || 'Failed to cancel');
      }
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleRemoveShortlist = async (doctorId) => {
    try {
      const res = await removeDoctorFromShortlist(doctorId);
      if (res.success) {
        toast.success('Doctor removed from shortlist');
        setShortlistedDoctors((prev) => prev.filter((d) => d.doctor_id !== doctorId));
      } else {
        toast.error(res.message || 'Failed to remove doctor');
      }
    } catch (err) {
      toast.error('Failed to remove doctor from shortlist');
    }
  };

  const handleOpenAddFamily = () => {
    setEditingFamilyId(null);
    setFamilyForm({
      name: '',
      relation: 'Spouse',
      dob: '',
      gender: 'female',
      blood_group: 'B+',
      phone: '',
    });
    setShowFamilyModal(true);
  };

  const handleOpenEditFamily = (m) => {
    setEditingFamilyId(m.id);
    setFamilyForm({
      name: m.name || '',
      relation: m.relation || 'Spouse',
      dob: m.dob || '',
      gender: m.gender || 'female',
      blood_group: m.blood_group || 'B+',
      phone: m.phone || '',
    });
    setShowFamilyModal(true);
  };

  const handleSaveFamilyMember = async (e) => {
    e.preventDefault();
    if (!familyForm.name.trim()) {
      toast.error('Full name is required');
      return;
    }

    try {
      if (editingFamilyId) {
        const res = await updateFamilyMember(editingFamilyId, familyForm);
        if (res.success) {
          toast.success('Family member updated');
          fetchFamily();
          setShowFamilyModal(false);
        } else {
          toast.error(res.message || 'Failed to update');
        }
      } else {
        const res = await addFamilyMember(familyForm);
        if (res.success) {
          toast.success('Family member added');
          fetchFamily();
          setShowFamilyModal(false);
        } else {
          toast.error(res.message || 'Failed to add');
        }
      }
    } catch (err) {
      toast.error('Failed to save family member');
    }
  };

  const handleDeleteFamily = async (id) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;
    try {
      const res = await deleteFamilyMember(id);
      if (res.success) {
        toast.success('Family member removed');
        setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast.error(res.message || 'Failed to remove');
      }
    } catch (err) {
      toast.error('Failed to remove family member');
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionForm.title.trim()) {
      toast.error('Prescription title is required');
      return;
    }

    try {
      const res = await createPatientPrescription({
        title: prescriptionForm.title.trim(),
        doctor_name: prescriptionForm.doctor_name ? prescriptionForm.doctor_name.trim() : '',
      });
      if (res.success) {
        toast.success('Prescription uploaded');
        setShowPrescriptionModal(false);
        setPrescriptionForm({ title: '', doctor_name: '' });
        fetchPrescriptions();
      } else {
        toast.error(res.message || 'Failed to add prescription');
      }
    } catch (err) {
      toast.error('Failed to upload prescription');
    }
  };

  const handleDeletePrescriptionItem = async (id) => {
    if (!confirm('Are you sure you want to remove this prescription?')) return;
    try {
      const res = await deletePatientPrescription(id);
      if (res.success) {
        toast.success('Prescription removed');
        fetchPrescriptions();
      } else {
        toast.error(res.message || 'Failed to remove prescription');
      }
    } catch (err) {
      toast.error('Failed to remove prescription');
    }
  };

  const handleAddLabReport = async (e) => {
    e.preventDefault();
    if (!reportForm.test_name.trim()) {
      toast.error('Test name is required');
      return;
    }

    try {
      const res = await createPatientDocument({
        document_type: 'lab_report',
        title: reportForm.test_name.trim(),
        lab_name: reportForm.lab_name.trim(),
        test_date: reportForm.date,
        file_path: reportForm.file_path || '/uploads/sample-lab-report.pdf',
      });
      if (res.success) {
        toast.success('Lab report added successfully');
        setShowReportModal(false);
        setReportForm({ test_name: '', lab_name: '', date: '', file_path: '' });
        fetchLabReports();
      } else {
        toast.error(res.message || 'Failed to add lab report');
      }
    } catch (err) {
      toast.error('Failed to add lab report');
    }
  };

  const handleDeleteReportItem = async (id) => {
    if (!confirm('Are you sure you want to delete this lab report?')) return;
    try {
      const res = await deletePatientDocument(id);
      if (res.success) {
        toast.success('Lab report deleted');
        fetchLabReports();
      } else {
        toast.error(res.message || 'Failed to delete report');
      }
    } catch (err) {
      toast.error('Failed to delete lab report');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await updatePatientProfile(profile);
      if (res.success) {
        toast.success('Profile updated successfully!');
        const updatedName = `${profile.first_name} ${profile.last_name}`.trim();
        setUserAuth({ name: updatedName, phone: profile.phone });
        setAuthUser((prev) => ({ ...prev, name: updatedName, phone: profile.phone }));
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // User details computations
  const fullName = authUser?.name || `${profile.first_name} ${profile.last_name}`.trim() || 'Patient User';
  const phone = authUser?.phone || profile.phone || '+919328407114';
  const initials = useMemo(() => {
    const parts = fullName.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase() || 'MP';
  }, [fullName]);

  // Format Appointment Date/Time
  const formatApptDate = (dateStr, timeStr) => {
    if (!dateStr) return { dayNum: '16', monthStr: 'SEPT', time: timeStr || '7:00 PM' };
    const d = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    return {
      dayNum: d.getDate() || '16',
      monthStr: months[d.getMonth()] || 'SEPT',
      time: timeStr ? timeStr.substring(0, 5) : '7:00 PM',
    };
  };

  // Dynamic Status Badge Mapping
  const getAppointmentStatusInfo = (status) => {
    const s = String(status || '').toLowerCase().trim();
    switch (s) {
      case 'confirmed':
        return { label: 'CONFIRMED', className: 'patient-status-confirmed' };
      case 'booked':
        return { label: 'BOOKED', className: 'patient-status-awaiting' };
      case 'pending':
      case 'requested':
        return { label: 'PENDING', className: 'patient-status-awaiting' };
      case 'completed':
        return { label: 'COMPLETED', className: 'patient-status-completed' };
      case 'cancelled':
        return { label: 'CANCELLED', className: 'patient-status-cancelled' };
      case 'no_show':
        return { label: 'NO SHOW', className: 'patient-status-cancelled' };
      case 'in_progress':
        return { label: 'IN PROGRESS', className: 'patient-status-awaiting' };
      case 'arrived':
        return { label: 'ARRIVED', className: 'patient-status-confirmed' };
      default:
        return {
          label: s ? s.replace(/_/g, ' ').toUpperCase() : 'PENDING',
          className: 'patient-status-awaiting',
        };
    }
  };

  if (loading) {
    return (
      <div className="patient-page-wrap d-flex align-items-center justify-content-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="patient-page-wrap">
      <div className="patient-container">

        {/* ── Top Welcome Card ── */}
        <div className="patient-welcome-card">
          <div className="patient-welcome-left">
            <div className="patient-avatar-circle">
              {initials}
            </div>
            <div>
              <div className="patient-welcome-badge">WELCOME BACK</div>
              <h1 className="patient-welcome-name">{fullName}</h1>
              <p className="patient-welcome-phone">
                {phone.startsWith('+') ? phone : `+91${phone}`}
              </p>
            </div>
          </div>

          <div className="patient-welcome-actions">
            <Link href="/finddoctor" className="patient-btn-outline">
              Find a doctor
            </Link>
            <button type="button" className="patient-btn-outline" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>

        {/* ── 2-Column Dashboard Grid ── */}
        <div className="patient-grid-layout">

          {/* LEFT CONTENT COLUMN */}
          <div>

            {/* TAB 1: MY BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="patient-main-card">
                <div className="patient-section-header">
                  <h2 className="patient-section-title">PENDING REQUESTS & APPOINTMENTS</h2>
                  <Link href="/finddoctor" className="patient-primary-btn text-decoration-none">
                    + Book New Slot
                  </Link>
                </div>
                <p className="patient-section-subtitle">
                  We&apos;ve notified these clinics. They&apos;ll call you to confirm.
                </p>

                {loadingAppts ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                    <p className="text-muted small mt-2">Loading your appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="patient-empty-state">
                    <div className="patient-empty-icon">📅</div>
                    <h3 className="patient-empty-title">No booking requests yet</h3>
                    <p className="patient-empty-desc">
                      Find a top specialist or clinic in your city and book your slot in 60 seconds.
                    </p>
                    <Link href="/finddoctor" className="patient-primary-btn">
                      Find a doctor &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="patient-appt-list">
                    {appointments.map((apt) => {
                      const dt = formatApptDate(apt.appointment_date, apt.start_time);
                      const clinicTitle = apt.clinic?.name || 'eClinic Health Centre';
                      const clinicLoc = [apt.clinic?.address, apt.clinic?.city].filter(Boolean).join(' · ') || 'Ahmedabad, Gujarat';
                      const docTitle = apt.doctor?.user ? `Dr. ${apt.doctor.user.first_name} ${apt.doctor.user.last_name || ''}` : '';
                      const phoneCall = apt.clinic?.phone || '+919876543210';

                      const statusInfo = getAppointmentStatusInfo(apt.status);

                      return (
                        <div key={apt.id} className="patient-appt-card">
                          <div className="patient-appt-left">
                            <div className="patient-appt-date-box">
                              <span className="patient-appt-date-num">{dt.dayNum}</span>
                              <span className="patient-appt-date-month">{dt.monthStr}</span>
                              <span className="patient-appt-date-time">{dt.time}</span>
                            </div>

                            <div className="patient-appt-info">
                              <span className="patient-appt-clinic-name">
                                {docTitle || clinicTitle}
                              </span>
                              <span className="patient-appt-clinic-loc">
                                {clinicLoc}
                              </span>
                              {apt.reason && (
                                <span className="patient-appt-for-text">
                                  For: {apt.reason}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="patient-appt-actions">
                            <a href={`tel:${phoneCall}`} className="patient-call-btn text-decoration-none">
                              📞 Call
                            </a>
                            <span className={`patient-status-pill ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                            {(apt.status === 'booked' || apt.status === 'confirmed' || apt.status === 'pending') && (
                              <button
                                type="button"
                                className="btn btn-link text-danger p-0 small text-decoration-none"
                                onClick={() => handleCancelAppt(apt.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SHORTLIST */}
            {activeTab === 'shortlist' && (
              <div className="patient-main-card">
                <div className="patient-section-header">
                  <h2 className="patient-section-title">SHORTLISTED DOCTORS</h2>
                  <Link href="/finddoctor" className="patient-primary-btn text-decoration-none">
                    + Explore More Doctors
                  </Link>
                </div>
                <p className="patient-section-subtitle">
                  Doctors and clinics you have saved for quick access and consultations.
                </p>

                {loadingShortlist ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                    <p className="text-muted small mt-2">Loading your shortlist...</p>
                  </div>
                ) : shortlistedDoctors.length === 0 ? (
                  <div className="patient-empty-state">
                    {/* <div className="patient-empty-icon">❤️</div> */}
                    <h3 className="patient-empty-title">Your shortlist is empty</h3>
                    <p className="patient-empty-desc">
                      Browse doctors on Find Doctor and click the heart icon to save them here.
                    </p>
                    <Link href="/finddoctor" className="patient-primary-btn">
                      Explore Doctors &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="patient-family-list">
                    {shortlistedDoctors.map((item) => {
                      const doc = item.doctor || {};
                      const u = doc.user || {};
                      const docName = `Dr. ${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Specialist Doctor';
                      const departments = (doc.departments || []).map((d) => d.name).join(', ') || 'General Physician';
                      const docAvatar = getDoctorImageUrl(u.profile_image);

                      return (
                        <div key={item.shortlist_id || item.doctor_id} className="patient-appt-card align-items-center">
                          <div className="patient-appt-left align-items-center">
                            <div
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                background: '#e0f2fe',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                color: '#0369a1',
                                flexShrink: 0,
                              }}
                            >
                              {u.profile_image ? (
                                <img
                                  src={docAvatar}
                                  alt={docName}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                (u.first_name?.[0] || 'D') + (u.last_name?.[0] || 'R')
                              )}
                            </div>

                            <div className="patient-appt-info">
                              <span className="patient-appt-clinic-name">{docName}</span>
                              <span className="patient-appt-clinic-loc">{departments}</span>
                              <div className="d-flex align-items-center gap-2 mt-1">
                                {doc.experience_years && (
                                  <span className="badge bg-light text-dark border">
                                    {doc.experience_years} yrs exp
                                  </span>
                                )}
                                <span className="text-success fw-bold small">
                                  ₹{doc.consultation_fee || 500} Consultation
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="patient-appt-actions d-flex align-items-center gap-2">
                            <Link
                              href={`/finddoctor?search=${encodeURIComponent(u.first_name || '')}`}
                              className="patient-primary-btn text-decoration-none py-1 px-3 small"
                            >
                              Book
                            </Link>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm rounded-pill"
                              title="Remove from shortlist"
                              onClick={() => handleRemoveShortlist(item.doctor_id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FAMILY */}
            {activeTab === 'family' && (
              <div className="patient-main-card">
                <div className="patient-section-header">
                  <h2 className="patient-section-title">FAMILY PROFILES</h2>
                  <button
                    type="button"
                    className="patient-primary-btn"
                    onClick={handleOpenAddFamily}
                  >
                    + Add member
                  </button>
                </div>
                

                {loadingFamily ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                    <p className="text-muted small mt-2">Loading family members...</p>
                  </div>
                ) : (
                  <div className="patient-family-list">
                    {familyMembers.map((m) => {
                      const mInitials = (m.name || 'FM')
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase();

                      return (
                        <div key={m.id} className="patient-family-card">
                          <div className="patient-family-info">
                            <div className="patient-family-avatar">
                              {mInitials}
                            </div>
                            <div>
                              <div className="d-flex align-items-center gap-2">
                                <h4 className="patient-family-name mb-0">{m.name}</h4>
                                <span className="badge bg-light text-secondary border small">
                                  {m.relation}
                                </span>
                              </div>
                              <p className="patient-family-relation mb-0 mt-1">
                                {[
                                  m.gender && (m.gender.charAt(0).toUpperCase() + m.gender.slice(1)),
                                  m.blood_group && `Blood Group: ${m.blood_group}`,
                                  m.phone && `📞 ${m.phone}`,
                                ]
                                  .filter(Boolean)
                                  .join(' · ')}
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="patient-family-edit-btn"
                              onClick={() => handleOpenEditFamily(m)}
                            >
                              ✎ Edit
                            </button>
                            {m.relation !== 'Self' && (
                              <button
                                type="button"
                                className="btn btn-link text-danger p-0 text-decoration-none small"
                                onClick={() => handleDeleteFamily(m.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: E-PRESCRIPTIONS */}
            {activeTab === 'prescriptions' && (
              <div className="patient-main-card">
                <div className="patient-section-header">
                  <h2 className="patient-section-title">E-PRESCRIPTIONS</h2>
                  <button
                    type="button"
                    className="patient-primary-btn"
                    onClick={() => setShowPrescriptionModal(true)}
                  >
                    + Add prescription
                  </button>
                </div>
                <p className="patient-section-subtitle">
                  Keep every prescription in one place — upload a photo or PDF of one you already have, and doctors on eClinicPro can share new ones straight to your panel.
                </p>

                {loadingPrescriptions ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                    <p className="text-muted small mt-2">Loading prescriptions...</p>
                  </div>
                ) : prescriptions.length === 0 ? (
                  <div className="patient-empty-state">
                    <h3 className="patient-empty-title">No prescriptions yet</h3>
                    <p className="patient-empty-desc">
                      Upload a photo of a prescription you already have, or ask your eClinicPro doctor to share one during your next visit.
                    </p>
                    <button
                      type="button"
                      className="patient-primary-btn"
                      onClick={() => setShowPrescriptionModal(true)}
                    >
                      + Add a prescription
                    </button>
                  </div>
                ) : (
                  <div className="patient-family-list">
                    {prescriptions.map((p) => (
                      <div key={p.id} className="patient-family-card">
                        <div>
                          <h4 className="patient-family-name">💊 {p.title}</h4>
                          <p className="patient-family-relation">
                            {p.doctor_name ? `Dr. ${p.doctor_name}` : 'Prescription'} &middot; {p.date}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="patient-family-delete-btn"
                          title="Delete Prescription"
                          onClick={() => handleDeletePrescriptionItem(p.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: LAB REPORTS */}
            {activeTab === 'reports' && (
              <div className="patient-main-card">
                <div className="patient-section-header">
                  <h2 className="patient-section-title">LAB REPORTS</h2>
                  <button
                    type="button"
                    className="patient-primary-btn"
                    onClick={() => setShowReportModal(true)}
                  >
                    + Add report
                  </button>
                </div>
                <p className="patient-section-subtitle">
                  Keep every test result in one place — blood work, scans, X-rays. Upload details of reports you have and access them anytime.
                </p>

                {loadingReports ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status" />
                    <p className="text-muted small mt-2">Loading lab reports...</p>
                  </div>
                ) : labReports.length === 0 ? (
                  <div className="patient-empty-state">
                    <div className="patient-empty-icon"></div>
                    <h3 className="patient-empty-title">No lab reports yet</h3>
                    <p className="patient-empty-desc">
                      Add your past test results — blood work, scans, pathology tests — so you always have them accessible on your profile.
                    </p>
                    <button
                      type="button"
                      className="patient-primary-btn"
                      onClick={() => setShowReportModal(true)}
                    >
                      + Add a report
                    </button>
                  </div>
                ) : (
                  <div className="patient-family-list">
                    {labReports.map((r) => {
                      const reportDate = r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

                      return (
                        <div key={r.id} className="patient-family-card align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                background: '#f0fdf4',
                                color: '#16a34a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                flexShrink: 0,
                              }}
                            >
                              🧪
                            </div>
                            <div>
                              <h4 className="patient-family-name mb-0">{r.title}</h4>
                              <p className="patient-family-relation mt-1 mb-0">
                                Uploaded on {reportDate}
                              </p>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            {r.file_path && (
                              <a
                                href={r.file_path}
                                target="_blank"
                                rel="noreferrer"
                                className="patient-family-edit-btn text-decoration-none"
                              >
                                View / Download
                              </a>
                            )}
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 text-decoration-none small ms-2"
                              onClick={() => handleDeleteReportItem(r.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: LAB BOOKINGS (KEPT STATIC AS REQUESTED) */}
            {activeTab === 'lab_bookings' && (
              <div className="patient-main-card">
                <div className="patient-section-header">
                  <h2 className="patient-section-title">LAB BOOKINGS</h2>
                  <button
                    type="button"
                    className="patient-primary-btn"
                    onClick={() => toast.success('Lab test booking packages opening soon')}
                  >
                    Book a test
                  </button>
                </div>
                <p className="patient-section-subtitle">
                  Every lab test you&apos;ve booked with us — the slot, who it&apos;s for, and what it costs. Open any booking to see the full bill and collection details.
                </p>

                <div className="patient-empty-state">
                  <div className="patient-empty-icon">🧾</div>
                  <h3 className="patient-empty-title">No lab bookings yet</h3>
                  <p className="patient-empty-desc">
                    Book a lab test with free home sample collection — a technician comes to you, and your report lands right here.
                  </p>
                  <button
                    type="button"
                    className="patient-primary-btn"
                    onClick={() => toast.success('Lab packages available shortly')}
                  >
                    Browse lab packages
                  </button>
                </div>
              </div>
            )}

            {/* TAB 7: MY PROFILE */}
            {activeTab === 'profile' && (
              <div className="patient-main-card">
                <div className="patient-section-header">
                  <h2 className="patient-section-title">MY PROFILE</h2>
                </div>
                <p className="patient-section-subtitle">
                  Manage your personal health information, contact details, and blood group.
                </p>

                <form onSubmit={handleSaveProfile}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.first_name}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.last_name}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input
                        type="email"
                        className="form-control bg-light"
                        value={profile.email}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Mobile Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Gender</label>
                      <select
                        className="form-select"
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={profile.dob}
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Blood Group</label>
                      <select
                        className="form-select"
                        value={profile.blood_group}
                        onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Address</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        placeholder="Enter full address"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">State</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="patient-primary-btn"
                    disabled={savingProfile}
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR MENU  */}
          <div>
            <div className="patient-sidebar-menu">
              <button
                type="button"
                className={`patient-menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <div className="patient-menu-item-left">
                  <span>📅</span>
                  <span>My bookings</span>
                </div>
                {appointments.length > 0 && (
                  <span className="patient-menu-badge">{appointments.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`patient-menu-item ${activeTab === 'shortlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('shortlist')}
              >
                <div className="patient-menu-item-left">
                  <span>❤️</span>
                  <span>Shortlist</span>
                </div>
                {shortlistedDoctors.length > 0 && (
                  <span className="patient-menu-badge">{shortlistedDoctors.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`patient-menu-item ${activeTab === 'family' ? 'active' : ''}`}
                onClick={() => setActiveTab('family')}
              >
                <div className="patient-menu-item-left">
                  <span>👥</span>
                  <span>Family</span>
                </div>
                {familyMembers.length > 0 && (
                  <span className="patient-menu-badge">{familyMembers.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`patient-menu-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
                onClick={() => setActiveTab('prescriptions')}
              >
                <div className="patient-menu-item-left">
                  <span>💊</span>
                  <span>E-prescriptions</span>
                </div>
                {prescriptions.length > 0 && (
                  <span className="patient-menu-badge">{prescriptions.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`patient-menu-item ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <div className="patient-menu-item-left">
                  <span>🧪</span>
                  <span>Lab reports</span>
                </div>
                {labReports.length > 0 && (
                  <span className="patient-menu-badge">{labReports.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`patient-menu-item ${activeTab === 'lab_bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('lab_bookings')}
              >
                <div className="patient-menu-item-left">
                  <span>📋</span>
                  <span>Lab bookings</span>
                </div>
              </button>

              <button
                type="button"
                className={`patient-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <div className="patient-menu-item-left">
                  <span>👤</span>
                  <span>My Profile</span>
                </div>
              </button>
            </div>

            {/* COMING SOON CARD */}
           
          </div>

        </div>

      </div>

      {/* ── MODALS ── */}

      {/* Add/Edit Family Member Modal */}
      {showFamilyModal && (
        <div className="dp-modal-overlay" onClick={() => setShowFamilyModal(false)}>
          <div className="dp-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dp-success-title">
              {editingFamilyId ? 'Edit Family Member' : 'Add Family Member'}
            </h3>
            <p className="dp-success-desc">
              Manage family member profile for booking doctor visits easily.
            </p>
            <form onSubmit={handleSaveFamilyMember}>
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Patel"
                  value={familyForm.name}
                  onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="row g-2 mb-3 text-start">
                <div className="col-6">
                  <label className="form-label small fw-bold">Relation *</label>
                  <select
                    className="form-select"
                    value={familyForm.relation}
                    onChange={(e) => setFamilyForm({ ...familyForm, relation: e.target.value })}
                  >
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Gender</label>
                  <select
                    className="form-select"
                    value={familyForm.gender}
                    onChange={(e) => setFamilyForm({ ...familyForm, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="row g-2 mb-3 text-start">
                <div className="col-6">
                  <label className="form-label small fw-bold">Blood Group</label>
                  <select
                    className="form-select"
                    value={familyForm.blood_group}
                    onChange={(e) => setFamilyForm({ ...familyForm, blood_group: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91..."
                    value={familyForm.phone}
                    onChange={(e) => setFamilyForm({ ...familyForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="dp-modal-actions">
                <button type="submit" className="dp-modal-btn-done">
                  {editingFamilyId ? 'Update Member' : 'Save Member'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowFamilyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {showPrescriptionModal && (
        <div className="dp-modal-overlay" onClick={() => setShowPrescriptionModal(false)}>
          <div className="dp-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dp-success-title">Add Prescription</h3>
            <p className="dp-success-desc">Record or upload past doctor prescriptions.</p>
            <form onSubmit={handleAddPrescription}>
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Prescription Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Chronic Migraine Treatment"
                  value={prescriptionForm.title}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Prescribing Doctor (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Arti Singh"
                  value={prescriptionForm.doctor_name}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, doctor_name: e.target.value })}
                />
              </div>
              <div className="dp-modal-actions">
                <button type="submit" className="dp-modal-btn-done">Save Prescription</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPrescriptionModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lab Report Modal */}
      {showReportModal && (
        <div className="dp-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="dp-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dp-success-title">Add Lab Report</h3>
            <p className="dp-success-desc">Store medical test reports securely.</p>
            <form onSubmit={handleAddLabReport}>
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Test Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Complete Blood Count (CBC)"
                  value={reportForm.test_name}
                  onChange={(e) => setReportForm({ ...reportForm, test_name: e.target.value })}
                  required
                />
              </div>
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Lab / Hospital Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Metropolis Diagnostics"
                  value={reportForm.lab_name}
                  onChange={(e) => setReportForm({ ...reportForm, lab_name: e.target.value })}
                />
              </div>
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Test Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={reportForm.date}
                  onChange={(e) => setReportForm({ ...reportForm, date: e.target.value })}
                />
              </div>
              <div className="dp-modal-actions">
                <button type="submit" className="dp-modal-btn-done">Save Report</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowReportModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
