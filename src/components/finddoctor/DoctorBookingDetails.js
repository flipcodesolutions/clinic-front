'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { FiMapPin, FiGlobe, FiStar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { FaPhoneAlt, FaStethoscope, FaLanguage, FaHospital, FaStar } from 'react-icons/fa';
import { TbStethoscope, TbMapPin, TbLanguage, TbStar, TbWorld } from 'react-icons/tb';
import { getVisitorDoctorProfile, bookVisitorAppointment } from '@/services/visitorService';
import { getUserAuth } from '@/utils/auth';
import { showError, showSuccess } from '@/utils/toast';
import { getDoctorImageUrl, handleDoctorImageError } from '@/utils/imageHelper';

// Helper: Format 24h or string time to 12h AM/PM
function formatSlotTime(timeStr) {
  if (!timeStr) return '';
  const str = String(timeStr).trim();
  if (str.includes('AM') || str.includes('PM') || str.includes('am') || str.includes('pm')) {
    return str.toUpperCase();
  }
  const parts = str.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hourStr = hours < 10 ? `0${hours}` : `${hours}`;
    return `${hourStr}:${minutes} ${ampm}`;
  }
  return str;
}

// Helper: Format time range (e.g. 10:00 AM - 01:00 PM)
function formatTimeRange(startTime, endTime) {
  if (!startTime || !endTime) return '-';
  const startFmt = formatSlotTime(startTime);
  const endFmt = formatSlotTime(endTime);
  if (!startFmt || !endFmt) return '-';
  return `${startFmt} - ${endFmt}`;
}

// Helper: Time string to minutes from midnight
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const str = String(timeStr).trim().toUpperCase();
  if (str.includes('AM') || str.includes('PM')) {
    const parts = str.split(' ');
    const timePart = parts[0];
    const modifier = parts[1] || (str.includes('PM') ? 'PM' : 'AM');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + (minutes || 0);
  }
  const parts = str.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

// Helper: Minutes to 12h AM/PM format
function minutesToTimeStr(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hourStr = hours < 10 ? `0${hours}` : `${hours}`;
  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hourStr}:${minStr} ${ampm}`;
}

// Helper: Generate dynamic slots array between start and end times
function generateSlotsFromRange(startStr, endStr, intervalMinutes = 15) {
  const startMin = timeToMinutes(startStr);
  const endMin = timeToMinutes(endStr);
  if (startMin >= endMin) return [];
  const duration = Number(intervalMinutes) > 0 ? Number(intervalMinutes) : 15;
  const slots = [];
  for (let m = startMin; m < endMin; m += duration) {
    slots.push(minutesToTimeStr(m));
  }
  return slots;
}

export default function DoctorBookingDetails({ doctorId: propDoctorId }) {
  const router = useRouter();
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const urlDoctorId = searchParams?.get('doctor') || searchParams?.get('doctorId');
  const doctorId = propDoctorId || routeParams?.id;
  const [doctor, setDoctor] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [authUser, setAuthUser] = useState(null);

  // Slot Booking States
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [booking, setBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    setAuthUser(getUserAuth());
  }, []);

  // Generate next 5 dates with full day name (TODAY, TOM, THU, FRI, etc.)
  const generateDates = () => {
    const list = [];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      let dayName = days[d.getDay()];
      if (i === 0) dayName = 'TODAY';
      else if (i === 1) dayName = 'TOM';

      const fullDayName = fullDays[d.getDay()];
      const dayNum = d.getDate();
      const monthName = months[d.getMonth()];
      const fullDate = d.toISOString().split('T')[0];

      list.push({
        dayName,
        fullDayName,
        dayNum,
        monthName,
        fullDate,
        label: `${dayName} ${dayNum} ${monthName}`,
      });
    }
    return list;
  };

  const datesList = useMemo(() => generateDates(), []);

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

  // List of all doctors practicing in this clinic
  const clinicDoctors = useMemo(() => {
    if (!doctor) return [];
    if (Array.isArray(doctor.clinicDoctors) && doctor.clinicDoctors.length > 0) {
      return doctor.clinicDoctors;
    }
    return [doctor];
  }, [doctor]);

  // Handle default doctor selection
  useEffect(() => {
    if (clinicDoctors.length > 0) {
      if (urlDoctorId) {
        const matchedUrlDoc = clinicDoctors.find(
          (d) => String(d.id) === String(urlDoctorId) || String(d.user_id) === String(urlDoctorId)
        );
        if (matchedUrlDoc) {
          setSelectedDoctorId(matchedUrlDoc.id);
          return;
        }
      }
      if (!selectedDoctorId || !clinicDoctors.some((d) => String(d.id) === String(selectedDoctorId))) {
        const matchProp = clinicDoctors.find(
          (d) => String(d.id) === String(doctorId) || String(d.user_id) === String(doctorId)
        );
        setSelectedDoctorId(matchProp ? matchProp.id : clinicDoctors[0]?.id);
      }
    }
  }, [clinicDoctors, urlDoctorId, doctorId, selectedDoctorId]);

  // Currently active selected doctor
  const activeDoctor = useMemo(() => {
    if (clinicDoctors.length === 0) return doctor;
    const found = clinicDoctors.find((d) => String(d.id) === String(selectedDoctorId));
    return found || clinicDoctors[0] || doctor;
  }, [clinicDoctors, selectedDoctorId, doctor]);

  // Compute 7-day weekly schedule table dynamically from active selected doctor's schedules
  const weeklyScheduleRows = useMemo(() => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return daysOfWeek.map((day) => {
      const dayLower = day.toLowerCase();

      // Find active schedules matching this day for active selected doctor
      const daySchedules = (activeDoctor?.schedules || []).filter(
        (s) =>
          (s.day_of_week || s.day || '').toLowerCase() === dayLower &&
          (s.is_available === true || s.is_available === 1 || s.is_available === 'true')
      );

      if (dayLower === 'sunday') {
        if (daySchedules.length > 0) {
          const morning = daySchedules.find((s) => s.shift_type === 'morning' || timeToMinutes(s.start_time) < 720);
          const evening = daySchedules.find((s) => s.shift_type === 'evening' || timeToMinutes(s.start_time) >= 720);
          return {
            day,
            morning: morning ? formatTimeRange(morning.start_time, morning.end_time) : '-',
            evening: evening ? formatTimeRange(evening.start_time, evening.end_time) : '-',
            isClosed: !morning && !evening,
            schedules: daySchedules,
          };
        }
        return { day, morning: 'Closed', evening: 'Closed', isClosed: true, schedules: [] };
      }

      if (daySchedules.length > 0) {
        const morning = daySchedules.find((s) => s.shift_type === 'morning' || timeToMinutes(s.start_time) < 720);
        const evening = daySchedules.find((s) => s.shift_type === 'evening' || timeToMinutes(s.start_time) >= 720);
        return {
          day,
          morning: morning ? formatTimeRange(morning.start_time, morning.end_time) : '-',
          evening: evening ? formatTimeRange(evening.start_time, evening.end_time) : '-',
          isClosed: false,
          schedules: daySchedules,
        };
      }

      // If no active schedule exists for this weekday
      return {
        day,
        morning: '-',
        evening: '-',
        isClosed: true,
        schedules: [],
      };
    });
  }, [activeDoctor]);

  // Compute dynamic slots for selected date
  const dynamicSlots = useMemo(() => {
    const selectedDateObj = datesList[selectedDateIndex];
    const selectedDayName = selectedDateObj?.fullDayName || 'Monday';
    const scheduleForSelectedDay = weeklyScheduleRows.find(
      (r) => r.day.toLowerCase() === selectedDayName.toLowerCase()
    );

    if (!scheduleForSelectedDay || scheduleForSelectedDay.isClosed) {
      return [];
    }

    let slots = [];
    const daySchedules = scheduleForSelectedDay.schedules || [];

    if (daySchedules.length > 0) {
      daySchedules.forEach((s) => {
        const duration = Number(s.slot_duration) > 0 ? Number(s.slot_duration) : 15;
        const generated = generateSlotsFromRange(s.start_time, s.end_time, duration);
        slots.push(...generated);
      });
    }

    return slots;
  }, [datesList, selectedDateIndex, weeklyScheduleRows]);

  // Ensure valid selected slot whenever date or dynamic slots change
  useEffect(() => {
    if (dynamicSlots.length > 0) {
      if (!selectedSlot || !dynamicSlots.includes(selectedSlot)) {
        setSelectedSlot(dynamicSlots[0]);
      }
    } else {
      setSelectedSlot('');
    }
  }, [dynamicSlots, selectedSlot]);

  const clinicObj = doctor?.clinic || doctor?.schedules?.[0]?.clinic || doctor?.user?.clinics?.[0] || null;
  const clinicName = clinicObj?.name || (doctor?.user ? `${doctor.user.first_name}'s Medical Care` : "Speciality Clinic");

  // Dynamic Treatments & Services assigned 
  const assignedServices = useMemo(() => {
    const list = [];
    const clinicServices = doctor?.clinic?.services || clinicObj?.services || [];
    if (Array.isArray(clinicServices) && clinicServices.length > 0) {
      clinicServices.forEach((s) => {
        const name = s.name || s.title || s.service_name;
        if (name && !list.includes(name)) list.push(name);
      });
    }
    if (doctor?.departments && Array.isArray(doctor.departments)) {
      doctor.departments.forEach((d) => {
        if (d.name && !list.includes(d.name)) list.push(d.name);
      });
    }
    if (list.length === 0) {
      return [
        'Chronic ailment care',
        'Allergy treatment',
        'Skin disorders',
        'Digestive issues',
        'Migraine care',
        'Immunity support',
      ];
    }
    return list;
  }, [doctor, clinicObj]);

  // Dynamic Clinic Gallery
  const clinicGalleryImages = useMemo(() => {
    const list = [];
    const rawGalleries = doctor?.clinic?.galleries || clinicObj?.galleries || [];
    if (Array.isArray(rawGalleries) && rawGalleries.length > 0) {
      rawGalleries.forEach((g) => {
        let photoUrl = g.photo || g.image_url || g.image;
        if (photoUrl) {
          if (!photoUrl.startsWith('http') && !photoUrl.startsWith('data:')) {
            photoUrl = `http://localhost:5000${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
          }
          list.push({
            id: g.id,
            title: g.title || clinicName,
            photo: photoUrl,
          });
        }
      });
    }
    if (list.length === 0) {
      const fallbackPhotos = [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
      ];
      fallbackPhotos.forEach((url, i) => {
        list.push({
          id: `fb-${i}`,
          title: `${clinicName} Gallery ${i + 1}`,
          photo: url,
        });
      });
    }
    return list;
  }, [doctor, clinicObj, clinicName]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      showError(null, 'Please pick a time slot first.');
      return;
    }

    const currentAuth = getUserAuth();
    if (!currentAuth) {
      router.push(`/login?redirect=/finddoctor/${doctorId}`);
      return;
    }

    const selectedDateObj = datesList[selectedDateIndex];

    const currentActiveDocName = activeDoctor?.user
      ? `Dr. ${activeDoctor.user.first_name || ''} ${activeDoctor.user.last_name || ''}`.trim()
      : (doctor?.user ? `Dr. ${doctor.user.first_name || ''} ${doctor.user.last_name || ''}`.trim() : `Dr. Consultant #${doctorId}`);

    const chosenDeptId =
      activeDoctor?.department_id ||
      activeDoctor?.departments?.[0]?.id ||
      doctor?.department_id ||
      doctor?.departments?.[0]?.id ||
      null;

    const bookData = {
      clinic_id: clinicObj?.id || 1,
      doctor_id: activeDoctor?.id || doctor?.id || doctorId,
      department_id: chosenDeptId,
      appointment_date: selectedDateObj.fullDate,
      start_time: selectedSlot,
      visit_type: 'new',
      consultation_type: 'in_person',
      reason: reasonForVisit.trim() || 'Booked via Online Doctor Portal',
    };

    try {
      setBooking(true);
      const res = await bookVisitorAppointment(bookData);
      if (res.success) {
        showSuccess('Appointment booked successfully! The clinic will reach out to you shortly.');
        setConfirmedBooking({
          appointmentNumber: res.data?.appointment_number || `APT-${Date.now()}`,
          date: `${selectedDateObj.dayName}, ${selectedDateObj.dayNum} ${selectedDateObj.monthName}`,
          time: selectedSlot,
          doctor: currentActiveDocName,
          specialization: activeDoctor?.departments?.[0]?.name || activeDoctor?.specialization || specialization,
          clinic: clinicName,
          address: clinicAddress,
          patientName: currentAuth?.name || 'Patient',
        });
        setReasonForVisit('');
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
        <p className="text-muted">Loading clinic & doctor profile...</p>
      </div>
    );
  }

  const docName = doctor?.user
    ? `Dr. ${doctor.user.first_name || ''} ${doctor.user.last_name || ''}`.trim()
    : `Dr. Consultant #${doctorId}`;
  const activeDocName = activeDoctor?.user
    ? `Dr. ${activeDoctor.user.first_name || ''} ${activeDoctor.user.last_name || ''}`.trim()
    : docName;
  const clinicAddress = clinicObj?.address
    ? `${clinicObj.address}${clinicObj.city ? `, ${clinicObj.city}` : ''}`
    : doctor?.user?.clinics?.[0]?.address
      ? `${doctor.user.clinics[0].address}${doctor.user.clinics[0].city ? `, ${doctor.user.clinics[0].city}` : ''}`
      : (clinicObj?.city ? `${clinicObj.city}, Gujarat` : "Gujarat, India");
  const phone = clinicObj?.phone || doctor?.user?.phone || "+91 9876543210";
  const specialization = doctor?.departments?.[0]?.name || doctor?.specialization || "Medical Specialist";

  let languages = "English, Hindi, Gujarati";
  if (doctor?.languages) {
    try {
      const parsed = typeof doctor.languages === 'string' ? JSON.parse(doctor.languages) : doctor.languages;
      if (Array.isArray(parsed) && parsed.length > 0) {
        languages = parsed.map(l => String(l).charAt(0).toUpperCase() + String(l).slice(1)).join(', ');
      } else if (typeof parsed === 'string' && parsed.trim()) {
        languages = parsed;
      }
    } catch (e) {
      languages = String(doctor.languages);
    }
  }

  const reviewsCount = doctor?.reviews?.length || 0;
  const avgRating = reviewsCount > 0
    ? (doctor.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviewsCount).toFixed(1)
    : "4.9";
  const image = getDoctorImageUrl(doctor);

  const rawWebsite = (doctor?.website || clinicObj?.website || '').trim();
  const displayWebsite = rawWebsite ? rawWebsite.replace(/^https?:\/\//, '') : '';
  const formattedWebsiteUrl = rawWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : `https://${rawWebsite}`) : '';
  const aboutText = (doctor?.bio || clinicObj?.description || '').trim();

  const selectedDateObj = datesList[selectedDateIndex];
  const selectedDayName = selectedDateObj?.fullDayName || 'Monday';
  const isSelectedDateClosed = dynamicSlots.length === 0;

  return (
    <div className="dp-page-wrapper">
      {/* Centered Page Container  */}
      <div className="dp-page-container px-3 px-sm-4">

        {/* Breadcrumb Navigation Bar */}
        <div className="dp-breadcrumb">
          <Link href="/" className="dp-breadcrumb-link">Home</Link>
          <span className="mx-1 text-muted">›</span>
          <Link href="/finddoctor" className="dp-breadcrumb-link">Doctors</Link>
          <span className="mx-1 text-muted">›</span>
          <Link href={`/finddoctor?city=${encodeURIComponent(clinicObj?.city || 'Ahmedabad')}`} className="dp-breadcrumb-link">{clinicObj?.city || "Ahmedabad"}</Link>
          <span className="mx-1 text-muted">›</span>
          <span className="dp-breadcrumb-active">{specialization}</span>
          <span className="mx-1 text-muted">›</span>
          <span className="text-muted">{clinicName}</span>
        </div>

        {/* 2-Column Main Content Flex Layout */}
        <div className="d-flex flex-column flex-lg-row gap-4 align-items-start justify-content-between">

          {/* Left Column  */}
          <div className="dp-main-column">

            {/* Top Doctor/Clinic Info Card */}
            <div className="card dp-hero-card">
              <div className="d-flex flex-column flex-sm-row gap-4 align-items-start">

                {/* Clinic/Doctor Photo */}
                <div className="dp-hero-img-box rounded-4 overflow-hidden bg-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={clinicName}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => handleDoctorImageError(e, doctor?.gender || doctor?.doctorProfile?.gender)}
                  />
                </div>

                {/* Info Right */}
                <div className="flex-grow-1">
                  {/* Badges Row */}
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="dp-badge-clinic-tag">
                      CLINIC
                    </span>
                    <span className="dp-badge-verified-tag">
                      <FiCheckCircle size={12} /> Verified
                    </span>
                  </div>

                  {/* Title & Specialty */}
                  <h3 className="dp-hero-title">
                    {clinicName}
                  </h3>
                  <div className="dp-hero-spec">
                    {specialization}
                  </div>

                  {/* Rating */}
                  <div className="d-flex align-items-center gap-2 mb-3 dp-hero-rating">
                    <div className="d-flex gap-1 align-items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={13}
                          className={i < Math.floor(Number(avgRating)) ? 'dp-star-amber' : 'dp-star-slate'}
                        />
                      ))}
                    </div>
                    <span className="fw-bold text-dark">{avgRating}</span>
                    <span className="text-muted">{reviewsCount > 0 ? reviewsCount : 196} reviews</span>
                  </div>

                  {/* Address & Phone */}
                  <div className="d-flex flex-column gap-2 dp-hero-contact">
                    <div className="d-flex align-items-start gap-2">
                      <FiMapPin className="mt-1 flex-shrink-0 dp-hero-icon" size={15} />
                      <span className="dp-hero-address-text">{clinicAddress}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaPhoneAlt className="flex-shrink-0 dp-hero-icon" size={12} />
                      <span>{phone}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Multi-Doctor Selector Card */}
            {clinicDoctors.length > 0 && (
              <div className="card dp-doctor-selector-card">
                <div className="dp-selector-header">
                  <h4 className="dp-selector-title">
                    <FaStethoscope className="text-success" size={16} />
                    <span>Select Doctor to Book</span>
                  </h4>
                  <span className="dp-selector-count-badge">
                    {clinicDoctors.length} {clinicDoctors.length === 1 ? 'Doctor' : 'Doctors'} Available
                  </span>
                </div>

                <div className="dp-doctor-cards-grid">
                  {clinicDoctors.map((docItem) => {
                    const isSelected = String(docItem.id) === String(activeDoctor?.id);
                    const docItemName = docItem.user
                      ? `Dr. ${docItem.user.first_name || ''} ${docItem.user.last_name || ''}`.trim()
                      : `Dr. Consultant #${docItem.id}`;
                    const docItemSpec = docItem.departments?.[0]?.name || docItem.specialization || specialization || 'Specialist';
                    const docItemImg = getDoctorImageUrl(docItem);
                    const docExp = docItem.experience_years ? `${docItem.experience_years}+ yrs exp` : (docItem.qualification || 'Verified Doctor');
                    const docRating = docItem.reviews?.length > 0
                      ? (docItem.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / docItem.reviews.length).toFixed(1)
                      : avgRating;

                    return (
                      <div
                        key={docItem.id}
                        className={`dp-doctor-item-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedDoctorId(docItem.id)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                      >
                        {/* Selected Pill Badge */}
                        {isSelected ? (
                          <span className="dp-doctor-active-pill">
                            <FiCheckCircle size={11} /> Selected
                          </span>
                        ) : (
                          <span className="dp-doctor-select-pill">
                            Click to select
                          </span>
                        )}

                        <div className="dp-doctor-item-avatar-box">
                          <img
                            src={docItemImg}
                            alt={docItemName}
                            className="dp-doctor-item-avatar"
                            onError={(e) => handleDoctorImageError(e, docItem.gender || docItem.doctorProfile?.gender)}
                          />
                        </div>

                        <div className="dp-doctor-item-info">
                          <div className="dp-doctor-item-name" title={docItemName}>
                            {docItemName}
                          </div>
                          <div className="dp-doctor-item-spec">
                            {docItemSpec}
                          </div>
                          <div className="dp-doctor-item-meta">
                            <span className="d-inline-flex align-items-center gap-1">
                              <FaStar size={11} className="dp-star-amber" />
                              <strong className="text-dark">{docRating}</strong>
                            </span>
                            <span>•</span>
                            <span>{docExp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Tabs Card  */}
            <div className="card dp-tabs-card">
              {/* Tabs Header */}
              <div className="dp-tabs-header">
                <ul className="nav nav-tabs border-0 gap-4">
                  <li className="nav-item">
                    <button
                      className={`nav-link dp-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link dp-tab-btn ${activeTab === 'timings' ? 'active' : ''}`}
                      onClick={() => setActiveTab('timings')}
                    >
                      Timings
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link dp-tab-btn ${activeTab === 'treatments' ? 'active' : ''}`}
                      onClick={() => setActiveTab('treatments')}
                    >
                      Treatments
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link dp-tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                      onClick={() => setActiveTab('doctors')}
                    >
                      Doctors
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link dp-tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
                      onClick={() => setActiveTab('photos')}
                    >
                      Photos
                    </button>
                  </li>
                </ul>
              </div>

              {/* Tabs Content */}
              <div className="card-body p-4">

                {/* OVERVIEW TAB  */}
                {activeTab === 'overview' && (
                  <div>
                    <div className="dp-overview-box">
                      {/* Specialty Row */}
                      <div className="dp-overview-row dp-overview-row-border">
                        <div className="dp-overview-label">
                          <TbStethoscope className="dp-overview-label-icon" size={19} />
                          <span>Specialty</span>
                        </div>
                        <div className="dp-overview-value">
                          {specialization}
                        </div>
                      </div>

                      {/* Location Row */}
                      <div className="dp-overview-row dp-overview-row-border">
                        <div className="dp-overview-label">
                          <TbMapPin className="dp-overview-label-icon" size={19} />
                          <span>Location</span>
                        </div>
                        <div className="dp-overview-value">
                          {clinicAddress}
                        </div>
                      </div>

                      {/* Languages Row */}
                      <div className="dp-overview-row dp-overview-row-border">
                        <div className="dp-overview-label">
                          <TbLanguage className="dp-overview-label-icon" size={19} />
                          <span>Languages</span>
                        </div>
                        <div className="dp-overview-value">
                          {languages}
                        </div>
                      </div>

                      {/* Rating Row */}
                      <div className={`dp-overview-row ${displayWebsite ? 'dp-overview-row-border' : ''}`}>
                        <div className="dp-overview-label">
                          <TbStar className="dp-overview-label-icon" size={19} />
                          <span>Rating</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 dp-overview-value">
                          <div className="d-flex gap-1 align-items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                size={14}
                                className={i < Math.floor(Number(avgRating)) ? 'dp-star-amber' : 'dp-star-slate'}
                              />
                            ))}
                          </div>
                          <span className="fw-bold text-dark">{avgRating}</span>
                          <span className="text-muted fw-normal">({reviewsCount > 0 ? reviewsCount : 196} reviews)</span>
                        </div>
                      </div>

                      {/* Website Row  */}
                      {displayWebsite ? (
                        <div className="dp-overview-row">
                          <div className="dp-overview-label">
                            <TbWorld className="dp-overview-label-icon" size={19} />
                            <span>Website</span>
                          </div>
                          <a
                            href={formattedWebsiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dp-overview-website-link"
                          >
                            {displayWebsite}
                          </a>
                        </div>
                      ) : null}
                    </div>

                    {/* About Section  */}
                    {aboutText ? (
                      <div className="mt-4 pt-1">
                        <h5 className="dp-about-title">About</h5>
                        <p className="dp-about-text">
                          {aboutText}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* TIMINGS TAB  */}
                {activeTab === 'timings' && (
                  <div className="table-responsive">
                    <table className="table table-borderless mb-0 dp-timings-table">
                      <thead>
                        <tr className="dp-timings-thead-tr">
                          <th className="dp-timings-th dp-timings-th-day">Day</th>
                          <th className="dp-timings-th dp-timings-th-slot">Morning</th>
                          <th className="dp-timings-th dp-timings-th-slot">Evening</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeklyScheduleRows.map((row, idx) => (
                          <tr
                            key={row.day}
                            className={idx === weeklyScheduleRows.length - 1 ? '' : 'dp-timings-tr-border'}
                          >
                            <td className="dp-timings-td-day">
                              {row.day}
                            </td>
                            <td className="dp-timings-td-slot">
                              {row.morning === '-' || row.morning === 'Closed' ? (
                                <span className="dp-timings-closed-tag">{row.morning}</span>
                              ) : (
                                row.morning
                              )}
                            </td>
                            <td className="dp-timings-td-slot">
                              {row.evening === '-' || row.evening === 'Closed' ? (
                                <span className="dp-timings-closed-tag">{row.evening}</span>
                              ) : (
                                row.evening
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TREATMENTS TAB  */}
                {activeTab === 'treatments' && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">
                      Treatments &amp; services
                    </h5>
                    <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                      {assignedServices.map((serviceName, idx) => (
                        <li key={idx} className="d-flex align-items-center gap-2 text-dark fw-medium">
                          <span className="text-success fs-5 lh-1 me-1">•</span>
                          <span>{serviceName}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-muted mb-0 small">
                      Common treatments for {specialization.toLowerCase()}. The clinic will confirm services during your visit.
                    </p>
                  </div>
                )}

                {/* DOCTORS TAB */}
                {activeTab === 'doctors' && (
                  <div className="d-flex flex-column gap-3">
                    {clinicDoctors.map((docItem) => {
                      const dName = docItem.user
                        ? `Dr. ${docItem.user.first_name || ''} ${docItem.user.last_name || ''}`.trim()
                        : `Dr. Consultant #${docItem.id}`;
                      const dSpec = docItem.departments?.[0]?.name || docItem.specialization || specialization || 'Medical Specialist';
                      const isItemActive = String(docItem.id) === String(activeDoctor?.id);
                      return (
                        <div
                          key={docItem.id}
                          className={`d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-3 rounded-3 border ${
                            isItemActive ? 'bg-success-subtle border-success' : 'bg-light border-secondary-subtle'
                          }`}
                        >
                          <div className="d-flex align-items-center gap-3 mb-2 mb-sm-0">
                            <FaHospital className="fs-2 text-success flex-shrink-0" />
                            <div>
                              <h6 className="fw-bold mb-1 text-dark">{dName}</h6>
                              <div className="d-flex flex-wrap gap-1 align-items-center">
                                <span className="badge bg-success">{dSpec}</span>
                                {docItem.qualification && <span className="badge bg-secondary">{docItem.qualification}</span>}
                                {docItem?.registration_no && <span className="badge bg-white text-dark border">Reg: {docItem.registration_no}</span>}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`btn btn-sm ${isItemActive ? 'btn-success' : 'btn-outline-success'} flex-shrink-0`}
                            onClick={() => setSelectedDoctorId(docItem.id)}
                          >
                            {isItemActive ? '✓ Selected' : 'Select Doctor'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PHOTOS TAB  */}
                {activeTab === 'photos' && (
                  <div className="row g-3">
                    {clinicGalleryImages.map((item, idx) => (
                      <div key={item.id || idx} className="col-12 col-sm-6 col-md-4">
                        <div className="rounded-3 overflow-hidden bg-light position-relative ratio ratio-4x3 border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.photo}
                            alt={item.title || `${clinicName} photo`}
                            className="w-100 h-100 object-fit-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="dp-booking-col mx-auto mx-lg-0">
            <div className="card dp-booking-card sticky-top d-flex flex-column justify-content-between">
              <div>
                {/* Card Header */}
                <div className="mb-4">
                  <h4 className="dp-booking-header-title">
                    Book appointment
                  </h4>
                  <div className="dp-booking-header-sub">
                    {clinicName} &middot; {clinicObj?.city || 'Clinic'}
                  </div>
                  {activeDocName && (
                    <div className="dp-booking-selected-doc-badge">
                      <FaStethoscope size={11} />
                      <span>Doctor: <strong>{activeDocName}</strong></span>
                    </div>
                  )}
                </div>

                {/* Section 1: PREFERRED DATE  */}
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="dp-section-badge-label">
                      PREFERRED DATE
                    </span>
                    <span className="dp-section-badge-sub">
                      {datesList.length} Days Available
                    </span>
                  </div>

                  <div className="d-flex gap-2 pb-2 custom-date-scrollbar overflow-x-auto">
                    {datesList.map((dObj, idx) => {
                      const isSelected = selectedDateIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="dp-date-item-wrap d-flex flex-column align-items-center flex-shrink-0"
                        >
                          <button
                            type="button"
                            className={`btn dp-date-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelectedDateIndex(idx)}
                          >
                            <span className={`dp-date-day-name ${isSelected ? 'active' : ''}`}>
                              {dObj.dayName}
                            </span>
                            <span className="dp-date-day-num">
                              {dObj.dayNum}
                            </span>
                            <span className="dp-date-month">
                              {dObj.monthName}
                            </span>
                          </button>

                          {/* Active Indicator Bar directly centered below the selected date (SS3) */}
                          <div
                            className={`dp-date-active-bar ${isSelected ? 'active' : ''}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: PREFERRED TIME  */}
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="dp-section-badge-label">
                      PREFERRED TIME
                    </span>
                    {!isSelectedDateClosed && dynamicSlots.length > 0 && (
                      <span className="badge dp-slots-badge-green rounded-pill px-2 py-1">
                        {dynamicSlots.length} Slots
                      </span>
                    )}
                  </div>

                  {isSelectedDateClosed ? (
                    <div className="dp-closed-box mb-2">
                      <div className="dp-closed-icon">🚪</div>
                      <div className="dp-closed-title">Clinic Closed</div>
                      <div className="dp-closed-sub">
                        Closed on {selectedDayName}. Please choose another date.
                      </div>
                    </div>
                  ) : (
                    <div className="row g-2 mb-2 dp-slots-container custom-slot-scrollbar pe-1">
                      {dynamicSlots.map((slotTime, idx) => {
                        const isSelected = selectedSlot === slotTime;
                        return (
                          <div key={idx} className="col-4">
                            <button
                              type="button"
                              className={`btn w-100 dp-slot-btn text-nowrap ${isSelected ? 'active' : ''}`}
                              onClick={() => setSelectedSlot(slotTime)}
                            >
                              {slotTime}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <p className="dp-booking-info-note mb-0">
                    The clinic will confirm the exact slot when they call you.
                  </p>
                </div>

                {/* Section 3: REASON FOR VISIT  */}
                <div className="mb-3">
                  <div className="dp-reason-label text-success mb-2">
                    REASON FOR VISIT <span className="text-muted fw-normal">(optional)</span>
                  </div>
                  <input
                    type="text"
                    className="form-control dp-reason-input"
                    placeholder="e.g. Routine check-up"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                  />
                </div>
              </div>

              {/* Section 4: Sign in note & Action Button */}
              <div className="mt-2 pt-2">
                <div className="dp-booking-info-note mb-2 text-center text-sm-start">
                  {isSelectedDateClosed
                    ? 'No slots available on this date.'
                    : authUser
                      ? `👤 Booking as: ${authUser.name || authUser.email}`
                      : 'Sign in to send your booking request.'}
                </div>

                <button
                  type="button"
                  className={`btn dp-submit-btn ${isSelectedDateClosed ? 'disabled-btn' : ''}`}
                  onClick={handleConfirmBooking}
                  disabled={booking || !selectedSlot || isSelectedDateClosed}
                >
                  {booking
                    ? 'Booking...'
                    : isSelectedDateClosed
                      ? 'Clinic Closed'
                      : authUser
                        ? `Confirm Booking (${selectedSlot})`
                        : 'Sign in to book'}
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Booking Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="dp-modal-overlay" onClick={() => setConfirmedBooking(null)}>
          <div className="dp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dp-success-icon-wrap">
              ✓
            </div>
            <h3 className="dp-success-title">Appointment Confirmed!</h3>
            <p className="dp-success-desc">
              Your appointment has been booked successfully. The clinic has received your request.
            </p>

            <div className="dp-receipt-box">
              <div className="dp-receipt-row">
                <span className="dp-receipt-label">Booking ID</span>
                <span className="dp-receipt-badge">{confirmedBooking.appointmentNumber}</span>
              </div>
              <div className="dp-receipt-row">
                <span className="dp-receipt-label">Patient Name</span>
                <span className="dp-receipt-val">{confirmedBooking.patientName}</span>
              </div>
              <div className="dp-receipt-row">
                <span className="dp-receipt-label">Doctor</span>
                <span className="dp-receipt-val">{confirmedBooking.doctor}</span>
              </div>
              <div className="dp-receipt-row">
                <span className="dp-receipt-label">Specialty</span>
                <span className="dp-receipt-val">{confirmedBooking.specialization}</span>
              </div>
              <div className="dp-receipt-row">
                <span className="dp-receipt-label">Clinic</span>
                <span className="dp-receipt-val">{confirmedBooking.clinic}</span>
              </div>
              <div className="dp-receipt-row">
                <span className="dp-receipt-label">Date &amp; Time</span>
                <span className="dp-receipt-val text-success fw-bold">
                  {confirmedBooking.date} &middot; {confirmedBooking.time}
                </span>
              </div>
            </div>

            <div className="dp-modal-actions">
              <button
                type="button"
                className="dp-modal-btn-done"
                onClick={() => {
                  setConfirmedBooking(null);
                  router.push('/patient');
                }}
              >
                View in My Health &rarr;
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => setConfirmedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
