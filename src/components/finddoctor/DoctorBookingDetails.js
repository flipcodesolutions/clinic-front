'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiGlobe, FiStar, FiClock, FiCheckCircle, FiNavigation } from 'react-icons/fi';
import { FaPhoneAlt, FaStethoscope, FaLanguage, FaHospital } from 'react-icons/fa';
import { getVisitorDoctorProfile, bookVisitorAppointment } from '@/services/visitorService';
import { getUserAuth } from '@/utils/auth';
import { showError, showSuccess } from '@/utils/toast';

export default function DoctorBookingDetails({ doctorId }) {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Slot Booking States
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [booking, setBooking] = useState(false);

  // Generate next 7 dates
  const generateDates = () => {
    const list = [];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      const dayNum = d.getDate();
      const monthName = months[d.getMonth()];
      const fullDate = d.toISOString().split('T')[0];

      list.push({
        dayName,
        dayNum,
        monthName,
        fullDate,
        label: `${dayName} ${dayNum} ${monthName}`,
      });
    }
    return list;
  };

  const datesList = generateDates();

  const morningSlots = [
    '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
    '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM'
  ];

  const eveningSlots = [
    '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
    '5:00 PM', '5:15 PM', '5:30 PM', '5:45 PM',
    '6:00 PM', '6:15 PM', '6:30 PM', '6:45 PM',
    '7:00 PM', '7:15 PM', '7:30 PM', '7:45 PM'
  ];

  useEffect(() => {
    async function loadDoctorData() {
      try {
        setLoading(true);
        const res = await getVisitorDoctorProfile(doctorId);
        if (res.success && res.data) {
          setDoctor(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch doctor profile:', err);
      } finally {
        setLoading(false);
      }
    }
    if (doctorId) {
      loadDoctorData();
    }
  }, [doctorId]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      showError(null, 'Please pick a time slot first.');
      return;
    }

    // AUTH CHECK: Verify if user is logged in
    const authUser = getUserAuth();
    if (!authUser) {
      // Redirect to login page with return path
      router.push(`/login?redirect=/finddoctor/${doctorId}`);
      return;
    }

    const clinicObj = doctor?.schedules?.[0]?.clinic;
    const selectedDateObj = datesList[selectedDateIndex];

    const bookData = {
      clinic_id: clinicObj?.id || 1,
      doctor_id: doctorId,
      department_id: doctor?.department_id || null,
      appointment_date: selectedDateObj.fullDate,
      start_time: selectedSlot,
      visit_type: 'new',
      consultation_type: 'in_person',
      reason: 'Booked via Online Doctor Portal',
    };

    try {
      setBooking(true);
      const res = await bookVisitorAppointment(bookData);
      if (res.success) {
        showSuccess('Appointment booked successfully! The clinic will reach out to you shortly.');
        setSelectedSlot('');
      } else {
        showError(null, res.message || 'Failed to book appointment.');
      }
    } catch (err) {
      showError(err, 'Failed to book appointment.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-5 text-center">
        <div className="spinner-border text-success my-5" role="status"></div>
        <p className="text-muted">Loading doctor & clinic details...</p>
      </div>
    );
  }

  const docName = doctor?.user ? `Dr. ${doctor.user.first_name} ${doctor.user.last_name}` : `Dr. Doctor #${doctorId}`;
  const clinicObj = doctor?.schedules?.[0]?.clinic;
  const clinicName = clinicObj?.name || doctor?.bio?.split('practicing at ')?.[1]?.replace('.', '') || "Dr.FeelGood's Clinic";
  const clinicAddress = clinicObj?.address ? `${clinicObj.address}, ${clinicObj.city}` : "6&7, 2nd FLOOR, A-WING, New SG Rd, opposite SHUKAN PLATINUM, near VANDEMATRAM CIRCLE, Vandematram Arcade, Gota, Ahmedabad, Gujarat 382481, India";
  const phone = clinicObj?.phone || doctor?.user?.phone || "+919727832228";
  const image = doctor?.user?.profile_image && !doctor.user.profile_image.includes("placehold.co")
    ? doctor.user.profile_image
    : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300";

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-bottom py-2 fs-7 text-muted">
        <div className="container">
          <Link href="/" className="text-muted text-decoration-none me-1">Home</Link> &gt;
          <Link href="/finddoctor" className="text-muted text-decoration-none mx-1">Doctors</Link> &gt;
          <span className="text-muted mx-1">Ahmedabad</span> &gt;
          <span className="text-muted mx-1">Homeopathy doctor</span> &gt;
          <span className="text-success ms-1 fw-semibold">{clinicName}</span>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row g-4">
          {/* Left Column: Doctor & Clinic Header + Tabs (SS 2, SS 3, SS 4, SS 5) */}
          <div className="col-lg-7 col-xl-8">
            {/* Top Doctor/Clinic Info Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white" style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
              <div className="d-flex flex-column flex-md-row gap-4">
                <div className="position-relative flex-shrink-0 rounded-4 overflow-hidden" style={{ width: 150, height: 150 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={docName}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-light text-secondary border px-2 py-1 small uppercase" style={{ fontSize: 11 }}>CLINIC</span>
                    <span className="badge d-flex align-items-center gap-1 rounded-pill px-2 py-1 small" style={{ background: '#e6f4ea', color: '#00a676', fontSize: 12 }}>
                      <FiCheckCircle size={12} /> Verified
                    </span>
                  </div>

                  <h3 className="fw-bold text-dark mb-1 fs-2">{clinicName}</h3>
                  <div className="fw-semibold mb-2" style={{ color: '#00a676' }}>{doctor?.specialization || "Homeopathy doctor"}</div>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <div className="d-flex align-items-center gap-1 text-warning fs-6">
                      <FiStar className="fill-warning" /> <FiStar /> <FiStar /> <FiStar /> <FiStar />
                    </div>
                    <span className="fw-bold text-dark fs-6">4.9</span>
                    <span className="text-muted small">(196 reviews)</span>
                  </div>

                  <div className="d-flex flex-column gap-2 text-muted small" style={{ fontSize: 13.5 }}>
                    <div className="d-flex align-items-start gap-2">
                      <FiMapPin className="mt-1 flex-shrink-0" style={{ color: '#00a676' }} size={16} />
                      <span>{clinicAddress}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaPhoneAlt className="flex-shrink-0" style={{ color: '#00a676' }} size={13} />
                      <span>{phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (SS 3, SS 4, SS 5) */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white" style={{ borderRadius: 24, border: '1px solid #e2e8f0' }}>
              <div className="border-bottom px-4 pt-3 bg-white">
                <ul className="nav nav-tabs border-0 gap-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 bg-transparent pb-3 fw-semibold ${activeTab === 'overview' ? 'active border-bottom border-3 fw-bold' : 'text-secondary'}`}
                      style={activeTab === 'overview' ? { color: '#00a676', borderColor: '#00a676' } : {}}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 bg-transparent pb-3 fw-semibold ${activeTab === 'timings' ? 'active border-bottom border-3 fw-bold' : 'text-secondary'}`}
                      style={activeTab === 'timings' ? { color: '#00a676', borderColor: '#00a676' } : {}}
                      onClick={() => setActiveTab('timings')}
                    >
                      Timings
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 bg-transparent pb-3 fw-semibold ${activeTab === 'treatments' ? 'active border-bottom border-3 fw-bold' : 'text-secondary'}`}
                      style={activeTab === 'treatments' ? { color: '#00a676', borderColor: '#00a676' } : {}}
                      onClick={() => setActiveTab('treatments')}
                    >
                      Treatments
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 bg-transparent pb-3 fw-semibold ${activeTab === 'doctors' ? 'active border-bottom border-3 fw-bold' : 'text-secondary'}`}
                      style={activeTab === 'doctors' ? { color: '#00a676', borderColor: '#00a676' } : {}}
                      onClick={() => setActiveTab('doctors')}
                    >
                      Doctors
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 bg-transparent pb-3 fw-semibold ${activeTab === 'photos' ? 'active border-bottom border-3 fw-bold' : 'text-secondary'}`}
                      style={activeTab === 'photos' ? { color: '#00a676', borderColor: '#00a676' } : {}}
                      onClick={() => setActiveTab('photos')}
                    >
                      Photos
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {/* OVERVIEW TAB (SS 3) */}
                {activeTab === 'overview' && (
                  <div>
                    <div className="bg-light rounded-4 p-3 mb-4 border">
                      <div className="row g-3">
                        <div className="col-12 border-bottom pb-2 d-flex align-items-center justify-content-between">
                          <span className="text-muted d-flex align-items-center gap-2"><FaStethoscope style={{ color: '#00a676' }} /> Specialty</span>
                          <span className="fw-bold text-dark">{doctor?.specialization || "Homeopathy doctor"}</span>
                        </div>
                        <div className="col-12 border-bottom pb-2 d-flex align-items-center justify-content-between">
                          <span className="text-muted d-flex align-items-center gap-2"><FiMapPin style={{ color: '#00a676' }} /> Location</span>
                          <span className="fw-bold text-dark">Gota, Ahmedabad, Gujarat</span>
                        </div>
                        <div className="col-12 border-bottom pb-2 d-flex align-items-center justify-content-between">
                          <span className="text-muted d-flex align-items-center gap-2"><FaLanguage style={{ color: '#00a676' }} /> Languages</span>
                          <span className="fw-bold text-dark">English</span>
                        </div>
                        <div className="col-12 border-bottom pb-2 d-flex align-items-center justify-content-between">
                          <span className="text-muted d-flex align-items-center gap-2"><FiStar className="text-warning" /> Rating</span>
                          <span className="fw-bold text-dark">★ 4.9 (196 reviews)</span>
                        </div>
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <span className="text-muted d-flex align-items-center gap-2"><FiGlobe style={{ color: '#00a676' }} /> Website</span>
                          <a href="https://www.drfeelgoods.in" target="_blank" rel="noreferrer" className="fw-bold text-decoration-none" style={{ color: '#00a676' }}>
                            www.drfeelgoods.in/
                          </a>
                        </div>
                      </div>
                    </div>

                    <h5 className="fw-bold text-dark mb-2">About</h5>
                    <p className="text-muted fs-6">
                      {doctor?.bio || `Dr.FeelGood's Clinic is a homeopathy doctor in Ahmedabad.`}
                    </p>
                  </div>
                )}

                {/* TIMINGS TAB (SS 4) */}
                {activeTab === 'timings' && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">OPD Consultation Timings</h5>
                    <div className="table-responsive">
                      <table className="table table-borderless align-middle">
                        <thead>
                          <tr className="border-bottom text-muted small">
                            <th>Day</th>
                            <th>Morning</th>
                            <th>Evening</th>
                          </tr>
                        </thead>
                        <tbody className="fw-semibold text-dark">
                          <tr className="border-bottom">
                            <td>Monday</td>
                            <td>9:00 AM - 1:00 PM</td>
                            <td>4:00 PM - 8:00 PM</td>
                          </tr>
                          <tr className="border-bottom">
                            <td>Tuesday</td>
                            <td>9:00 AM - 1:00 PM</td>
                            <td>4:00 PM - 8:00 PM</td>
                          </tr>
                          <tr className="border-bottom">
                            <td>Wednesday</td>
                            <td>9:00 AM - 1:00 PM</td>
                            <td>4:00 PM - 8:00 PM</td>
                          </tr>
                          <tr className="border-bottom">
                            <td>Thursday</td>
                            <td>9:00 AM - 1:00 PM</td>
                            <td>4:00 PM - 8:00 PM</td>
                          </tr>
                          <tr className="border-bottom">
                            <td>Friday</td>
                            <td>9:00 AM - 1:00 PM</td>
                            <td>4:00 PM - 8:00 PM</td>
                          </tr>
                          <tr className="border-bottom">
                            <td>Saturday</td>
                            <td>9:00 AM - 1:00 PM</td>
                            <td className="text-muted">-</td>
                          </tr>
                          <tr>
                            <td>Sunday</td>
                            <td colSpan="2" className="text-danger">Closed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TREATMENTS TAB (SS 5) */}
                {activeTab === 'treatments' && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">Treatments & services</h5>
                    <ul className="list-unstyled d-flex flex-column gap-2 text-dark fw-semibold mb-4">
                      <li className="d-flex align-items-center gap-2"><span style={{ color: '#00a676' }}>•</span> Chronic ailment care</li>
                      <li className="d-flex align-items-center gap-2"><span style={{ color: '#00a676' }}>•</span> Allergy treatment</li>
                      <li className="d-flex align-items-center gap-2"><span style={{ color: '#00a676' }}>•</span> Skin disorders</li>
                      <li className="d-flex align-items-center gap-2"><span style={{ color: '#00a676' }}>•</span> Digestive issues</li>
                      <li className="d-flex align-items-center gap-2"><span style={{ color: '#00a676' }}>•</span> Migraine care</li>
                      <li className="d-flex align-items-center gap-2"><span style={{ color: '#00a676' }}>•</span> Immunity support</li>
                    </ul>
                    <p className="text-muted small">
                      Common treatments for homeopathy doctor. The clinic will confirm services during your visit.
                    </p>
                  </div>
                )}

                {/* DOCTORS TAB */}
                {activeTab === 'doctors' && (
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 border">
                    <FaHospital className="fs-1" style={{ color: '#00a676' }} />
                    <div>
                      <h6 className="fw-bold mb-1">{docName}</h6>
                      <span className="badge text-white" style={{ background: '#00a676' }}>{doctor?.specialization || "Specialist"}</span>
                    </div>
                  </div>
                )}

                {/* PHOTOS TAB */}
                {activeTab === 'photos' && (
                  <div className="row g-3">
                    <div className="col-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="Clinic photo" className="w-100 rounded-3 object-fit-cover" style={{ height: 120 }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Slot Booking Sidebar (SS 2 & Live site Layout) */}
          <div className="col-lg-5 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top mb-4" style={{ top: 90, borderRadius: 24, border: '1px solid #e2e8f0' }}>
              <div className="rounded-4 p-3 mb-3" style={{ background: '#e6f4ea' }}>
                <h5 className="fw-bold text-dark mb-1 fs-6">Choose your appointment</h5>
                <p className="text-muted small mb-0" style={{ fontSize: 12 }}>Same-day slots available. No advance payment needed.</p>
              </div>

              {/* Step indicator */}
              <div className="d-flex align-items-center gap-3 text-muted small mb-3 border-bottom pb-2">
                <span className="fw-bold border-bottom border-2 pb-1" style={{ color: '#00a676', borderColor: '#00a676' }}>1 • Pick slot</span>
                <span>2 • Your details</span>
              </div>

              {/* Date Selector Pills */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-uppercase fw-bold text-muted" style={{ fontSize: 11, letterSpacing: 0.5 }}>SELECT DATE</span>
                <span className="text-muted small" style={{ fontSize: 11 }}>32 slots</span>
              </div>

              <div className="d-flex gap-2 overflow-auto hide-scrollbar pb-2 mb-3">
                {datesList.map((dObj, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn rounded-3 p-2 text-center flex-shrink-0 transition-all"
                    style={
                      selectedDateIndex === idx
                        ? { background: '#00a676', color: '#ffffff', border: '1px solid #00a676', minWidth: 58 }
                        : { background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', minWidth: 58 }
                    }
                    onClick={() => { setSelectedDateIndex(idx); setSelectedSlot(''); }}
                  >
                    <div className="small uppercase fw-bold" style={{ fontSize: 10 }}>{dObj.dayName}</div>
                    <div className="fs-5 fw-extrabold my-0">{dObj.dayNum}</div>
                    <div className="small" style={{ fontSize: 10 }}>{dObj.monthName}</div>
                  </button>
                ))}
              </div>

              {/* Slots Section */}
              <div className="mb-3" style={{ maxHeight: 260, overflowY: 'auto' }}>
                {/* Morning Slots */}
                <div className="mb-3">
                  <div className="fw-bold text-dark small mb-2 d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
                    <span>🌅 Morning</span> <span className="text-muted font-normal">(0 slots)</span>
                  </div>
                  <div className="row g-2">
                    {morningSlots.map((s, idx) => (
                      <div key={idx} className="col-6">
                        <button
                          type="button"
                          className="btn w-100 py-1-5 border rounded-3 small fw-semibold text-muted bg-light border-0"
                          style={{ fontSize: 12, opacity: 0.6, cursor: 'not-allowed' }}
                          disabled
                        >
                          {s}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evening Slots */}
                <div>
                  <div className="fw-bold text-dark small mb-2 d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
                    <span>🌇 Evening</span> <span className="text-muted font-normal">(16 slots)</span>
                  </div>
                  <div className="row g-2">
                    {eveningSlots.map((s, idx) => (
                      <div key={idx} className="col-6">
                        <button
                          type="button"
                          className="btn w-100 py-1-5 border rounded-3 small fw-semibold transition-all"
                          style={
                            selectedSlot === s
                              ? { background: '#00a676', color: '#ffffff', borderColor: '#00a676', fontSize: 13 }
                              : { background: '#ffffff', color: '#1e293b', borderColor: '#e2e8f0', fontSize: 13 }
                          }
                          onClick={() => setSelectedSlot(s)}
                        >
                          {s}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Continue Action Button (eClinicPro Live style) */}
              <button
                type="button"
                className="btn text-white fw-bold w-100 py-2-5 rounded-3 shadow-sm fs-6"
                style={{ background: '#00a676', borderColor: '#00a676', fontSize: 14 }}
                onClick={handleConfirmBooking}
                disabled={booking || !selectedSlot}
              >
                {booking ? 'Booking...' : selectedSlot ? `Continue → (${selectedSlot})` : 'Select a slot to continue'}
              </button>
            </div>

            {/* Additional Quick Contact Card */}
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white" style={{ borderRadius: 20, border: '1px solid #e2e8f0' }}>
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-outline-success fw-bold w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2" style={{ color: '#00a676', borderColor: '#00a676', fontSize: 14 }}>
                  <FaPhoneAlt size={13} /> Call Now
                </button>
                <button className="btn btn-light border fw-semibold w-100 py-2 rounded-3 text-dark d-flex align-items-center justify-content-center gap-2" style={{ fontSize: 14, borderColor: '#e2e8f0' }}>
                  <FiNavigation size={15} /> Directions
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
