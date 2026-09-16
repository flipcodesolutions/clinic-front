'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserAuth, clearUserSession } from '@/utils/auth';
import {
  getPatientAppointments,
  cancelPatientAppointment,
  getPatientProfile,
  updatePatientProfile,
} from '@/services/patientService';
import toast from 'react-hot-toast';

export default function PatientDashboard() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);

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

  // Family Members state (defaults to primary user)
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [familyForm, setFamilyForm] = useState({
    name: '',
    relation: 'Spouse',
    dob: '',
    gender: 'female',
    blood_group: 'B+',
  });

  // Upload Prescriptions / Reports state
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({ title: '', doctor_name: '', date: '' });

  const [labReports, setLabReports] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ test_name: '', lab_name: '', date: '' });

  useEffect(() => {
    const user = getUserAuth();
    if (!user) {
      router.push('/login?redirect=/patient');
      return;
    }
    setAuthUser(user);

    // Initial family member as Self
    setFamilyMembers([
      {
        id: 1,
        name: user.name || 'meet rameshbhai patel',
        relation: 'Self',
        initials: (user.name || 'MP').split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
      },
    ]);

    // Fetch live data
    fetchAppointments();
    fetchProfileData();
    setLoading(false);
  }, []);

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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await updatePatientProfile(profile);
      if (res.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    if (!familyForm.name.trim()) return;
    const newMember = {
      id: Date.now(),
      name: familyForm.name.trim(),
      relation: familyForm.relation,
      initials: familyForm.name.trim().split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
    };
    setFamilyMembers([...familyMembers, newMember]);
    setShowFamilyModal(false);
    setFamilyForm({ name: '', relation: 'Spouse', dob: '', gender: 'female', blood_group: 'B+' });
    toast.success('Family member added');
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    if (!prescriptionForm.title.trim()) return;
    setPrescriptions([
      ...prescriptions,
      { id: Date.now(), ...prescriptionForm, date: prescriptionForm.date || new Date().toISOString().split('T')[0] },
    ]);
    setShowPrescriptionModal(false);
    setPrescriptionForm({ title: '', doctor_name: '', date: '' });
    toast.success('Prescription uploaded');
  };

  const handleAddLabReport = (e) => {
    e.preventDefault();
    if (!reportForm.test_name.trim()) return;
    setLabReports([
      ...labReports,
      { id: Date.now(), ...reportForm, date: reportForm.date || new Date().toISOString().split('T')[0] },
    ]);
    setShowReportModal(false);
    setReportForm({ test_name: '', lab_name: '', date: '' });
    toast.success('Lab report added');
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
                  <h2 className="patient-section-title">PENDING REQUESTS</h2>
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
                      const clinicTitle = apt.clinic?.name || 'Dr.FeelGood\'s Clinic';
                      const clinicLoc = [apt.clinic?.address, apt.clinic?.city].filter(Boolean).join(' · ') || 'Gota, Ahmedabad';
                      const docTitle = apt.doctor?.user ? `Dr. ${apt.doctor.user.first_name} ${apt.doctor.user.last_name || ''}` : '';
                      const phoneCall = apt.clinic?.phone || '+919876543210';

                      const isConfirmed = apt.status === 'confirmed' || apt.status === 'booked';
                      const statusClass =
                        isConfirmed
                          ? 'patient-status-confirmed'
                          : apt.status === 'completed'
                          ? 'patient-status-completed'
                          : apt.status === 'cancelled'
                          ? 'patient-status-cancelled'
                          : 'patient-status-confirmed';

                      const statusLabel =
                        isConfirmed
                          ? 'CONFIRMED'
                          : apt.status === 'completed'
                          ? 'COMPLETED'
                          : apt.status === 'cancelled'
                          ? 'CANCELLED'
                          : 'CONFIRMED';

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
                            <a href={`tel:${phoneCall}`} className="patient-call-btn">
                              📞 Call
                            </a>
                            <span className={`patient-status-pill ${statusClass}`}>
                              {statusLabel}
                            </span>
                            {(apt.status === 'booked' || apt.status === 'confirmed') && (
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
                </div>
                <p className="patient-section-subtitle">
                  Doctors and clinics you have saved for quick access.
                </p>

                <div className="patient-empty-state">
                  <div className="patient-empty-icon">❤️</div>
                  <h3 className="patient-empty-title">Your shortlist is empty</h3>
                  <p className="patient-empty-desc">
                    Browse doctors and click the bookmark icon to save them here.
                  </p>
                  <Link href="/finddoctor" className="patient-primary-btn">
                    Explore Doctors &rarr;
                  </Link>
                </div>
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
                    onClick={() => setShowFamilyModal(true)}
                  >
                    + Add member
                  </button>
                </div>
                <p className="patient-section-subtitle">
                  Add up to 6 family members (including yourself) with relation, name, date of birth, gender, blood group, and ABHA number. · {familyMembers.length}/6 added
                </p>

                <div className="patient-family-list">
                  {familyMembers.map((m) => (
                    <div key={m.id} className="patient-family-card">
                      <div className="patient-family-info">
                        <div className="patient-family-avatar">
                          {m.initials}
                        </div>
                        <div>
                          <h4 className="patient-family-name">{m.name}</h4>
                          <p className="patient-family-relation">{m.relation}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="patient-family-edit-btn"
                        onClick={() => {
                          setFamilyForm({
                            name: m.name,
                            relation: m.relation,
                            dob: '',
                            gender: 'female',
                            blood_group: 'B+',
                          });
                          setShowFamilyModal(true);
                        }}
                      >
                        ✎ Edit
                      </button>
                    </div>
                  ))}
                </div>
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

                {prescriptions.length === 0 ? (
                  <div className="patient-empty-state">
                    <div className="patient-empty-icon">💊</div>
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
                  Keep every test result in one place — blood work, scans, X-rays. Upload a photo or PDF of a report you already have and it stays with you, for any doctor you visit.
                </p>

                {labReports.length === 0 ? (
                  <div className="patient-empty-state">
                    <div className="patient-empty-icon">🧪</div>
                    <h3 className="patient-empty-title">No lab reports yet</h3>
                    <p className="patient-empty-desc">
                      Add your past test results — blood work, scans, X-rays — so you always have them with you at your next appointment.
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
                    {labReports.map((r) => (
                      <div key={r.id} className="patient-family-card">
                        <div>
                          <h4 className="patient-family-name">🧪 {r.test_name}</h4>
                          <p className="patient-family-relation">
                            {r.lab_name || 'Lab Report'} &middot; {r.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: LAB BOOKINGS */}
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
                <span className="patient-menu-badge">{familyMembers.length}</span>
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
            <div className="patient-coming-soon-card">
              <div className="patient-coming-soon-badge">COMING SOON</div>
              <div className="patient-coming-soon-content">
                <div className="patient-coming-soon-icon">
                  🩺
                </div>
                <div>
                  <h4 className="patient-coming-soon-title">Video consult</h4>
                  <p className="patient-coming-soon-desc">Talk to a doctor from home</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── MODALS ── */}

      {/* Add Family Member Modal */}
      {showFamilyModal && (
        <div className="dp-modal-overlay" onClick={() => setShowFamilyModal(false)}>
          <div className="dp-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="dp-success-title">Add Family Member</h3>
            <p className="dp-success-desc">Add family members to book appointments for them easily.</p>
            <form onSubmit={handleAddFamilyMember}>
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
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Relation *</label>
                <select
                  className="form-select"
                  value={familyForm.relation}
                  onChange={(e) => setFamilyForm({ ...familyForm, relation: e.target.value })}
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="dp-modal-actions">
                <button type="submit" className="dp-modal-btn-done">Save Member</button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowFamilyModal(false)}>Cancel</button>
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
                  placeholder="e.g. Skin Allergy Medication"
                  value={prescriptionForm.title}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="text-start mb-3">
                <label className="form-label small fw-bold">Doctor Name</label>
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
