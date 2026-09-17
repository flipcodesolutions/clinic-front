'use client';

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiMapPin, FiHeart, FiClock, FiArrowRight } from "react-icons/fi";
import { FaCheckCircle, FaPhoneAlt, FaCalendarAlt, FaVideo } from "react-icons/fa";
import { getVisitorDoctors, getVisitorDepartments } from "@/services/visitorService";
import { getDoctorImageUrl, handleDoctorImageError } from "@/utils/imageHelper";
import "@/css/find-doctor.css";

function formatTimeString(timeStr) {
  if (!timeStr) return '';
  const str = String(timeStr).trim();
  if (str.includes('AM') || str.includes('PM') || str.includes('am') || str.includes('pm')) {
    return str;
  }
  const parts = str.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  return str;
}

function getDoctorScheduleDays(doc) {
  const hasSchedules = Array.isArray(doc?.schedules) && doc.schedules.length > 0;
  const hasOpd = doc?.opd_timing && typeof doc.opd_timing === 'string' && doc.opd_timing.trim().length > 0;

  if (!hasSchedules && !hasOpd) {
    return null;
  }

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const list = daysOfWeek.map((day) => {
    const dayLower = day.toLowerCase();
    const daySchedules = hasSchedules
      ? doc.schedules.filter(
        (s) => (s.day_of_week || s.day || '').toLowerCase() === dayLower && s.is_available !== false
      )
      : [];

    if (daySchedules.length > 0) {
      const timingStr = daySchedules
        .map((s) => `${formatTimeString(s.start_time)} – ${formatTimeString(s.end_time)}`)
        .join(', ');
      return { day, timing: timingStr };
    }

    if (hasOpd) {
      if (day === 'Sunday') {
        return { day, timing: 'Closed' };
      }
      return { day, timing: doc.opd_timing };
    }

    return { day, timing: 'Closed' };
  });

  return list;
}

function getDoctorLanguages(doc) {
  const raw = doc?.languages || doc?.doctorProfile?.languages;
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((l) => String(l).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((l) => String(l).trim()).filter(Boolean);
      }
    } catch (e) {
      // not json, maybe comma separated
    }
    return raw.split(",").map((l) => l.trim()).filter(Boolean);
  }
  return [];
}

const CITY_COORDINATES = {
  'limbdi': { lat: 22.5658, lng: 71.8083 },
  'surendranagar': { lat: 22.7284, lng: 71.6371 },
  'wadhwan': { lat: 22.7011, lng: 71.6781 },
  'chotila': { lat: 22.4239, lng: 71.1963 },
  'dhrangadhra': { lat: 22.9961, lng: 71.4646 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'rajkot': { lat: 22.3039, lng: 70.8022 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'vadodara': { lat: 22.3072, lng: 73.1812 },
  'bhavnagar': { lat: 21.7645, lng: 72.1519 },
  'jamnagar': { lat: 22.4707, lng: 70.0577 },
  'junagadh': { lat: 21.5222, lng: 70.4579 },
  'gandhinagar': { lat: 23.2156, lng: 72.6369 },
  'anand': { lat: 22.5645, lng: 72.9289 },
  'nadiad': { lat: 22.6916, lng: 72.8634 },
  'morbi': { lat: 22.8120, lng: 70.8378 },
  'mehsana': { lat: 23.5880, lng: 72.3693 },
  'patan': { lat: 23.8493, lng: 72.1266 },
  'palanpur': { lat: 24.1724, lng: 72.4346 },
  'bharuch': { lat: 21.7051, lng: 72.9959 },
  'navsari': { lat: 20.9500, lng: 72.9200 },
  'valsad': { lat: 20.5992, lng: 72.9342 },
  'vapi': { lat: 20.3893, lng: 72.9106 },
  'porbandar': { lat: 21.6417, lng: 69.6293 },
  'godhra': { lat: 22.7758, lng: 73.6149 },
  'bhuj': { lat: 23.2420, lng: 69.6669 },
  'gandhidham': { lat: 23.0753, lng: 70.1337 },
  'veraval': { lat: 20.9077, lng: 70.3678 },
  'somnath': { lat: 20.8880, lng: 70.4012 },
  'amreli': { lat: 21.6032, lng: 71.2221 },
  'botad': { lat: 22.1706, lng: 71.6662 },
  'gondal': { lat: 21.9619, lng: 70.7983 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.7041, lng: 77.1025 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'indore': { lat: 22.7196, lng: 75.8577 },
};

function getDoctorCoordinates(doc) {
  const clinicObj = doc.schedules?.[0]?.clinic || doc.user?.clinics?.[0] || null;
  const addressStr = (
    (clinicObj?.address || '') + ' ' +
    (clinicObj?.city || '') + ' ' +
    (doc.user?.clinics?.[0]?.address || '') + ' ' +
    (doc.user?.clinics?.[0]?.city || '')
  ).toLowerCase();

  // If address explicitly contains 
  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    if (addressStr.includes(cityName)) {
      // If clinic coordinates exist and are distinct, use them; otherwise use city coordinates
      if (clinicObj?.latitude && clinicObj?.longitude) {
        const lat = parseFloat(clinicObj.latitude);
        const lng = parseFloat(clinicObj.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          return { lat, lng };
        }
      }
      return coords;
    }
  }

  if (clinicObj?.latitude && clinicObj?.longitude) {
    const lat = parseFloat(clinicObj.latitude);
    const lng = parseFloat(clinicObj.longitude);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }

  // Fallback realistic coordinates
  const idNum = Number(doc.id || doc.user?.id || 1);
  const latOffset = (((idNum * 19) % 30) - 15) * 0.0012;
  const lngOffset = (((idNum * 37) % 30) - 15) * 0.0012;
  return {
    lat: 22.7284 + latOffset,
    lng: 71.6371 + lngOffset,
  };
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0.2;
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return dist;
}

function formatDistanceText(distKm) {
  if (distKm == null) return "200 m away";
  if (distKm < 1) {
    const meters = Math.max(100, Math.round((distKm * 1000) / 50) * 50);
    return `${meters} m away`;
  }
  return `${distKm.toFixed(1)} km away`;
}

function FilterDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  activeBorder = false,
  alignRight = false,
  minWidth = 200,
  darkPill = false,
}) {
  return (
    <div className="position-relative custom-filter-dropdown-container" style={{ display: 'inline-block' }}>
      <button
        type="button"
        onClick={onToggle}
        className={`fd-chip ${isOpen ? 'open' : ''} ${activeBorder ? 'on active-filter' : ''}`}
        style={darkPill ? { background: 'var(--ecp-ink)', color: '#fff', borderColor: 'var(--ecp-ink)' } : undefined}
      >
        <span>{label}</span>
        <span className="caret" />
      </button>

      {isOpen && (
        <div
          className="fd-pop"
          style={alignRight ? { right: 0, left: 'auto', minWidth } : { left: 0, minWidth }}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelect(opt.value)}
                className={`row ${isSelected ? 'on' : ''}`}
              >
                <span className="ck">{isSelected ? '✓' : ''}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FindDoctor() {
  return (
    <Suspense fallback={<div className="text-center py-5">Loading doctors...</div>}>
      <FindDoctorContent />
    </Suspense>
  );
}

function FindDoctorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams ? (searchParams.get("specialty") || "all") : "all";
  const initialSearch = searchParams ? (searchParams.get("search") || searchParams.get("q") || "") : "";
  const initialLocation = searchParams ? (searchParams.get("location") || searchParams.get("city") || "") : "";

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [locationSearch, setLocationSearch] = useState(initialLocation);
  const [specialtyFilter, setSpecialtyFilter] = useState(initialSpecialty);
  const [expandedScheduleId, setExpandedScheduleId] = useState(null);

  // Filter States
  const [availableFilter, setAvailableFilter] = useState("any");
  const [genderFilter, setGenderFilter] = useState("any");
  const [ratingFilter, setRatingFilter] = useState("any");
  const [distanceFilter, setDistanceFilter] = useState("any");
  const [languageFilter, setLanguageFilter] = useState("any");
  const [videoConsultOnly, setVideoConsultOnly] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("best");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userCoords, setUserCoords] = useState({ lat: 22.7284, lng: 71.6371 });

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (pos?.coords?.latitude && pos?.coords?.longitude) {
            setUserCoords({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          }
        },
        () => {
          // Default Surendranagar coordinates
          setUserCoords({ lat: 22.7284, lng: 71.6371 });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const getDocDistanceKm = (doc) => {
    const coords = getDoctorCoordinates(doc);
    const userLat = userCoords?.lat ?? 22.7284;
    const userLng = userCoords?.lng ?? 71.6371;
    return calculateDistanceKm(userLat, userLng, coords.lat, coords.lng);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.custom-filter-dropdown-container')) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchParams) {
      const qSpecialty = searchParams.get("specialty");
      if (qSpecialty) {
        setSpecialtyFilter(qSpecialty);
        setCurrentPage(1);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [docRes, deptRes] = await Promise.all([
          getVisitorDoctors(),
          getVisitorDepartments(),
        ]);
        if (docRes.success && Array.isArray(docRes.data)) {
          setDoctors(docRes.data);
        }
        if (deptRes.success && Array.isArray(deptRes.data)) {
          setDepartments(deptRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch visitor data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Availability helper
  const isDoctorAvailable = (doc, mode) => {
    if (mode === "any") return true;
    const daysNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayIndex = new Date().getDay();
    const todayDay = daysNames[todayIndex];
    const tomorrowDay = daysNames[(todayIndex + 1) % 7];

    const hasOpdToday = Boolean(doc.opd_timing && todayDay !== 'sunday');
    const hasOpdTomorrow = Boolean(doc.opd_timing && tomorrowDay !== 'sunday');

    const scheduleToday = doc.schedules?.some(
      (s) => (s.day_of_week || s.day || '').toLowerCase() === todayDay && s.is_available !== false
    );
    const scheduleTomorrow = doc.schedules?.some(
      (s) => (s.day_of_week || s.day || '').toLowerCase() === tomorrowDay && s.is_available !== false
    );

    if (mode === "today") {
      return scheduleToday || hasOpdToday;
    }
    if (mode === "today_tomorrow") {
      return scheduleToday || hasOpdToday || scheduleTomorrow || hasOpdTomorrow;
    }
    if (mode === "week") {
      const hasAnySchedule = doc.schedules?.some((s) => s.is_available !== false);
      return hasAnySchedule || Boolean(doc.opd_timing);
    }
    return true;
  };

  // Gender helper
  const matchDoctorGender = (doc, gender) => {
    if (gender === "any") return true;
    const docGender = (
      doc.gender ||
      doc.doctorProfile?.gender ||
      doc.user?.gender ||
      ""
    ).toLowerCase();
    return docGender === gender.toLowerCase();
  };

  // Language helper
  const matchDoctorLanguage = (doc, lang) => {
    if (lang === "any") return true;
    const docLangs = getDoctorLanguages(doc).map((l) => l.toLowerCase());
    if (docLangs.length === 0) {
      return ["english", "hindi"].includes(lang.toLowerCase());
    }
    return docLangs.some((l) => l.includes(lang.toLowerCase()));
  };

  // Rating helper
  const getDocRating = (doc) => {
    const reviewsCount = doc.reviews?.length || 0;
    if (reviewsCount === 0) return 5.0;
    return doc.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviewsCount;
  };

  // Dynamic language options from API data
  const allAvailableLanguages = React.useMemo(() => {
    const langSet = new Set();
    const defaults = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada", "Bengali", "Gujarati"];

    doctors.forEach((doc) => {
      const docLangs = getDoctorLanguages(doc);
      docLangs.forEach((l) => {
        if (l) {
          const formatted = l.trim().charAt(0).toUpperCase() + l.trim().slice(1).toLowerCase();
          langSet.add(formatted);
        }
      });
    });

    defaults.forEach((d) => langSet.add(d));
    return Array.from(langSet);
  }, [doctors]);

  const languageOptions = [
    { label: "Any language", value: "any" },
    ...allAvailableLanguages.map((lang) => ({ label: lang, value: lang.toLowerCase() })),
  ];

  const distanceOptions = [
    { label: "Any distance", value: "any" },
    { label: "Within 1 km", value: "1" },
    { label: "Within 5 km", value: "5" },
    { label: "Within 10 km", value: "10" },
    { label: "Within 25 km", value: "25" },
    { label: "Within 50 km", value: "50" },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.user ? `${doc.user.first_name} ${doc.user.last_name}`.toLowerCase() : "";
    const spec = doc.specialization ? doc.specialization.toLowerCase() : "";
    const clinicObj = doc.schedules?.[0]?.clinic || doc.user?.clinics?.[0];
    const clinic = clinicObj?.name ? clinicObj.name.toLowerCase() : "";
    const city = clinicObj?.city ? clinicObj.city.toLowerCase() : "";
    const address = clinicObj?.address ? clinicObj.address.toLowerCase() : "";

    const matchesSearch =
      !search ||
      name.includes(search.toLowerCase()) ||
      spec.includes(search.toLowerCase()) ||
      clinic.includes(search.toLowerCase());

    const matchesLocation =
      !locationSearch ||
      city.includes(locationSearch.toLowerCase()) ||
      address.includes(locationSearch.toLowerCase());

    const matchesSpec =
      specialtyFilter === "all" ||
      spec.includes(specialtyFilter.toLowerCase()) ||
      (doc.departments && doc.departments.some(d =>
        d.name?.toLowerCase().includes(specialtyFilter.toLowerCase()) ||
        d.parent?.name?.toLowerCase().includes(specialtyFilter.toLowerCase())
      ));

    const matchesAvailability = isDoctorAvailable(doc, availableFilter);
    const matchesGender = matchDoctorGender(doc, genderFilter);
    const matchesLanguage = matchDoctorLanguage(doc, languageFilter);
    const ratingVal = getDocRating(doc);
    const matchesRating =
      ratingFilter === "any" ||
      (ratingFilter === "4.5" && ratingVal >= 4.5) ||
      (ratingFilter === "4.0" && ratingVal >= 4.0) ||
      (ratingFilter === "3.5" && ratingVal >= 3.5);

    const docDist = getDocDistanceKm(doc);
    const matchesDistance =
      distanceFilter === "any" ||
      (distanceFilter === "1" && docDist <= 1) ||
      (distanceFilter === "5" && docDist <= 5) ||
      (distanceFilter === "10" && docDist <= 10) ||
      (distanceFilter === "25" && docDist <= 25) ||
      (distanceFilter === "50" && docDist <= 50);

    const matchesVideo =
      !videoConsultOnly ||
      Boolean(
        doc.offers_video_consult ||
        doc.doctorProfile?.offers_video_consult
      );

    return (
      matchesSearch &&
      matchesLocation &&
      matchesSpec &&
      matchesAvailability &&
      matchesGender &&
      matchesRating &&
      matchesLanguage &&
      matchesDistance &&
      matchesVideo
    );
  });

  const sortOptions = [
    { label: "Best match", value: "best" },
    { label: "Nearest first", value: "nearest" },
    { label: "Highest rated", value: "rating_high" },
    { label: "Fee — low to high", value: "fee_low" },
    { label: "Fee — high to low", value: "fee_high" },
    { label: "Verified clinics first", value: "verified" },
  ];

  // Sorting
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === "nearest") {
      return getDocDistanceKm(a) - getDocDistanceKm(b);
    }
    if (sortBy === "rating_high") {
      return getDocRating(b) - getDocRating(a);
    }
    if (sortBy === "fee_low") {
      const feeA = Number(a.consultation_fee || a.fee || a.user?.clinics?.[0]?.consultation_fee || 500);
      const feeB = Number(b.consultation_fee || b.fee || b.user?.clinics?.[0]?.consultation_fee || 500);
      return feeA - feeB;
    }
    if (sortBy === "fee_high") {
      const feeA = Number(a.consultation_fee || a.fee || a.user?.clinics?.[0]?.consultation_fee || 500);
      const feeB = Number(b.consultation_fee || b.fee || b.user?.clinics?.[0]?.consultation_fee || 500);
      return feeB - feeA;
    }
    if (sortBy === "verified") {
      const vA = a.is_verified || a.user?.is_verified ? 1 : 0;
      const vB = b.is_verified || b.user?.is_verified ? 1 : 0;
      return vB - vA;
    }
    if (sortBy === "name") {
      const nameA = a.user ? `${a.user.first_name} ${a.user.last_name}` : "";
      const nameB = b.user ? `${b.user.first_name} ${b.user.last_name}` : "";
      return nameA.localeCompare(nameB);
    }
    return 0;
  });

  // Map of clinicKey
  const clinicDoctorsMap = React.useMemo(() => {
    const map = new Map();
    doctors.forEach((d) => {
      const clinicObj = d.schedules?.[0]?.clinic || d.user?.clinics?.[0] || null;
      const cId = clinicObj?.id;
      const cName = (clinicObj?.name || '').trim().toLowerCase();
      const keys = [];
      if (cId) keys.push(`id-${cId}`);
      if (cName) keys.push(`name-${cName}`);

      keys.forEach((key) => {
        if (!map.has(key)) map.set(key, []);
        if (!map.get(key).some((existing) => Number(existing.id) === Number(d.id))) {
          map.get(key).push(d);
        }
      });
    });
    return map;
  }, [doctors]);

  // Group doctors by clinic when searching for a clinic, or list both clinics & doctors
  const displayItems = React.useMemo(() => {
    const searchTrimmed = (search || '').trim().toLowerCase();

    // If no search is active: Show both Clinic cards and individual Doctor cards!
    if (!searchTrimmed) {
      const result = [];
      const seenClinicKeys = new Set();

      // 1. Add Clinic cards 
      sortedDoctors.forEach((doc) => {
        const { user } = doc;
        const clinicObj = doc.schedules?.[0]?.clinic || user?.clinics?.[0] || null;
        const clinicName = (clinicObj?.name || '').trim();
        const clinicId = clinicObj?.id;
        const clinicKey = clinicId ? `id-${clinicId}` : (clinicName ? `name-${clinicName.toLowerCase()}` : null);

        if (clinicKey && clinicName && !seenClinicKeys.has(clinicKey)) {
          seenClinicKeys.add(clinicKey);
          const allDocs = clinicDoctorsMap.get(clinicKey) || [doc];
          result.push({
            ...doc,
            id: `clinic-${clinicId || clinicName}`,
            isClinicCard: true,
            clinicDoctors: allDocs,
            clinicName,
            clinicObj,
          });
        }
      });

      // 2. Add all individual Doctor cards
      sortedDoctors.forEach((doc) => {
        result.push(doc);
      });

      return result;
    }

    // When SEARCH is active:
    const result = [];
    const seenClinicKeys = new Set();

    sortedDoctors.forEach((doc) => {
      const { user } = doc;
      const docFirst = (user?.first_name || '').trim().toLowerCase();
      const docLast = (user?.last_name || '').trim().toLowerCase();
      const docFullName = `${docFirst} ${docLast}`.trim();

      const clinicObj = doc.schedules?.[0]?.clinic || user?.clinics?.[0] || null;
      const clinicName = (clinicObj?.name || '').trim();
      const clinicNameLower = clinicName.toLowerCase();
      const clinicId = clinicObj?.id;
      const clinicKey = clinicId ? `id-${clinicId}` : (clinicName ? `name-${clinicNameLower}` : null);

      const isDoctorNameMatch =
        docFullName.includes(searchTrimmed) ||
        docFirst.includes(searchTrimmed) ||
        docLast.includes(searchTrimmed) ||
        `dr ${docFullName}`.includes(searchTrimmed) ||
        `dr. ${docFullName}`.includes(searchTrimmed);

      const isClinicNameMatch =
        clinicNameLower.length > 0 &&
        clinicNameLower.includes(searchTrimmed);

      // If user typed 'clinic', prioritize clinic card
      if (searchTrimmed.includes('clinic')) {
        if (clinicKey && clinicName) {
          if (!seenClinicKeys.has(clinicKey)) {
            seenClinicKeys.add(clinicKey);
            const allDocs = clinicDoctorsMap.get(clinicKey) || [doc];
            result.push({
              ...doc,
              id: `clinic-${clinicId || clinicName}`,
              isClinicCard: true,
              clinicDoctors: allDocs,
              clinicName,
              clinicObj,
            });
          }
        } else {
          result.push(doc);
        }
        return;
      }

      // Show single clinic card
      if (isClinicNameMatch && !isDoctorNameMatch) {
        if (clinicKey && !seenClinicKeys.has(clinicKey)) {
          seenClinicKeys.add(clinicKey);
          const allDocs = clinicDoctorsMap.get(clinicKey) || [doc];
          result.push({
            ...doc,
            id: `clinic-${clinicId || clinicName}`,
            isClinicCard: true,
            clinicDoctors: allDocs,
            clinicName,
            clinicObj,
          });
        }
        return;
      }

      // Show ONLY the doctor card
      if (isDoctorNameMatch && !isClinicNameMatch) {
        result.push(doc);
        return;
      }

      // If matches both or matches specialty/city
      if (isClinicNameMatch && clinicKey && !seenClinicKeys.has(clinicKey)) {
        seenClinicKeys.add(clinicKey);
        const allDocs = clinicDoctorsMap.get(clinicKey) || [doc];
        result.push({
          ...doc,
          id: `clinic-${clinicId || clinicName}`,
          isClinicCard: true,
          clinicDoctors: allDocs,
          clinicName,
          clinicObj,
        });
      }
      if (isDoctorNameMatch) {
        result.push(doc);
      } else if (!isClinicNameMatch) {
        result.push(doc);
      }
    });

    return result;
  }, [sortedDoctors, search, clinicDoctorsMap]);

  // Pagination calculations based on displayItems
  const totalPages = Math.ceil(displayItems.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedDoctors = displayItems.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  const handleClearAll = () => {
    setSearch("");
    setLocationSearch("");
    setSpecialtyFilter("all");
    setAvailableFilter("any");
    setGenderFilter("any");
    setRatingFilter("any");
    setDistanceFilter("any");
    setLanguageFilter("any");
    setVideoConsultOnly(false);
    setItemsPerPage(20);
    setCurrentPage(1);
    setSortBy("best");
    setOpenDropdown(null);
  };

  const isAnyFilterActive =
    search.trim() !== "" ||
    locationSearch.trim() !== "" ||
    specialtyFilter !== "all" ||
    availableFilter !== "any" ||
    genderFilter !== "any" ||
    ratingFilter !== "any" ||
    distanceFilter !== "any" ||
    languageFilter !== "any" ||
    videoConsultOnly ||
    itemsPerPage !== 20 ||
    sortBy !== "best";

  const handleBookClick = (docId) => {
    router.push(`/finddoctor/${docId}`);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  // Clean departments list and prioritize popular categories matching UI
  const validDepartments = departments.filter((d) => {
    const nameLower = (d.name || "").toLowerCase().trim();
    return nameLower.length > 2 && !['meet', 'meetpatel', 'test'].includes(nameLower);
  });

  const popularNames = [
    "General physician",
    "Dermatologist",
    "Family medicine doctor",
    "Cardiologist",
    "Neurologist",
    "Pulmonologist",
    "Gynecologist",
    "Orthopedic",
    "Dentist",
    "Pediatrician",
  ];

  // Prioritize popular ones first
  const sortedDepartments = [...validDepartments].sort((a, b) => {
    const aIndex = popularNames.findIndex(p => p.toLowerCase() === (a.name || '').toLowerCase());
    const bIndex = popularNames.findIndex(p => p.toLowerCase() === (b.name || '').toLowerCase());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  const initialCount = 6;
  const isSelectedOutsideInitial = specialtyFilter !== 'all' &&
    !sortedDepartments.slice(0, initialCount).some(d => d.name?.toLowerCase() === specialtyFilter.toLowerCase());

  let visibleDepartments = showAllSpecialties ? sortedDepartments : sortedDepartments.slice(0, initialCount);

  // If user selected a department not in initial top items, ensure it's visible in the pills row
  if (isSelectedOutsideInitial && !showAllSpecialties) {
    const activeDeptObj = sortedDepartments.find(d => d.name?.toLowerCase() === specialtyFilter.toLowerCase());
    if (activeDeptObj) {
      visibleDepartments = [...visibleDepartments, activeDeptObj];
    }
  }

  // Label lookups
  const currentSortOption = sortOptions.find((o) => o.value === sortBy) || sortOptions[0];
  const sortLabel = `Sort:  ${currentSortOption.label}`;

  const availableLabel =
    availableFilter === "today"
      ? "Today"
      : availableFilter === "today_tomorrow"
        ? "Today or tomorrow"
        : availableFilter === "week"
          ? "Within a week"
          : "Available";

  const genderLabel =
    genderFilter === "female"
      ? "Female"
      : genderFilter === "male"
        ? "Male"
        : "Gender";

  const ratingLabel =
    ratingFilter === "4.5"
      ? "4.5 & above"
      : ratingFilter === "4.0"
        ? "4.0 & above"
        : ratingFilter === "3.5"
          ? "3.5 & above"
          : "Rating";

  const distanceLabel =
    distanceFilter === "any"
      ? "Any distance"
      : `Within ${distanceFilter} km`;

  const currentLangObj = languageOptions.find((l) => l.value === languageFilter) || languageOptions[0];
  const languageLabel = languageFilter === "any" ? "Language" : currentLangObj.label;

  return (
    <div className="fd-page-wrap">
      {/* Hero Section  */}
      <div className="fd-hero">
        <div className="fd-container text-center">
          <h1 className="fd-hero-title">
            Find a doctor you can <span className="grad">actually trust.</span>
          </h1>
          <p className="fd-hero-lede">
            Search 76,750+ verified clinicians across India — see real availability, fees<br className="d-none d-md-inline" /> and ratings before you book.
          </p>

          <div className="fd-country-row">
            <div className="fd-country">
              <span className="flag">IN</span>
              <span className="label">Showing doctors in India</span>
            </div>
          </div>

          {/* Dual Search Box */}
          <div className="fd-search">
            {/* Left Input: DOCTOR / CLINIC */}
            <div className="fd-sfield">
              <span className="ico"><FiSearch size={20} /></span>
              <div className="text-start w-100 min-w-0">
                <span className="lbl">DOCTOR / CLINIC</span>
                <input
                  type="text"
                  placeholder="e.g. Dr. Mehta, Preet Clinic, Cardiology..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            {/* Right Input: AREA, CITY, STATE */}
            <div className="fd-sfield">
              <span className="ico"><FiMapPin size={20} /></span>
              <div className="text-start w-100 min-w-0">
                <span className="lbl">AREA, CITY, STATE</span>
                <input
                  type="text"
                  placeholder="Type a place — Mumbai, Ahmedabad, Surat..."
                  value={locationSearch}
                  onChange={(e) => { setLocationSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              className="fd-search-btn"
              onClick={() => setCurrentPage(1)}
              title="Search Doctors"
            >
              <FiArrowRight size={22} />
            </button>
          </div>

          {/* Specialties Single-Line Horizontal Scroll Pills */}
          <div className="fd-specs">
            <button
              type="button"
              className={`fd-spec ${specialtyFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setSpecialtyFilter('all'); setCurrentPage(1); }}
            >
              All specialties
            </button>

            {sortedDepartments.map((dept) => {
              const isSelected = specialtyFilter.toLowerCase() === dept.name?.toLowerCase();
              return (
                <button
                  key={dept.id}
                  type="button"
                  className={`fd-spec ${isSelected ? 'active' : ''}`}
                  onClick={() => { setSpecialtyFilter(dept.name); setCurrentPage(1); }}
                >
                  {dept.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="fd-main-wrap">
        <div className="fd-container">
          {/* Top Result Count Bar & Sorting */}
          <div className="fd-bar">
            <div className="fd-count">
              <strong>{displayItems.length}</strong> {
                (search.trim().toLowerCase().includes('clinic') || (displayItems.length > 0 && displayItems.every(d => d.isClinicCard)))
                  ? (displayItems.length === 1 ? 'clinic' : 'clinics')
                  : (displayItems.some(d => d.isClinicCard) ? 'clinics & doctors' : (displayItems.length === 1 ? 'doctor' : 'doctors'))
              } in {locationSearch || 'India'}
              {search.trim() && (
                <span> · matching <strong>&ldquo;{search.trim()}&rdquo;</strong></span>
              )}
            </div>

            <div className="fd-bar-actions">
              <FilterDropdown
                label={sortLabel}
                value={sortBy}
                isOpen={openDropdown === "sort"}
                onToggle={() => toggleDropdown("sort")}
                onSelect={(val) => { setSortBy(val); setOpenDropdown(null); }}
                activeBorder={false}
                alignRight={true}
                minWidth={210}
                darkPill={false}
                options={sortOptions}
              />
            </div>
          </div>

          {/* Filter Chips Row */}
          <div className="fd-filters mb-4">
            {/* Available Dropdown */}
            <FilterDropdown
              label={availableLabel}
              value={availableFilter}
              isOpen={openDropdown === "available"}
              onToggle={() => toggleDropdown("available")}
              onSelect={(val) => { setAvailableFilter(val); setCurrentPage(1); setOpenDropdown(null); }}
              activeBorder={availableFilter !== "any"}
              options={[
                { label: "Any time", value: "any" },
                { label: "Today", value: "today" },
                { label: "Today or tomorrow", value: "today_tomorrow" },
                { label: "Within a week", value: "week" },
              ]}
            />

            {/* Video consult Toggle */}
            <button
              type="button"
              onClick={() => setVideoConsultOnly((v) => !v)}
              className={`fd-chip ${videoConsultOnly ? 'on active-filter' : ''}`}
            >
              <FaVideo className={videoConsultOnly ? 'text-success' : ''} size={13} />
              <span>Video consult</span>
            </button>

            {/* Gender Dropdown */}
            <FilterDropdown
              label={genderLabel}
              value={genderFilter}
              isOpen={openDropdown === "gender"}
              onToggle={() => toggleDropdown("gender")}
              onSelect={(val) => { setGenderFilter(val); setCurrentPage(1); setOpenDropdown(null); }}
              activeBorder={genderFilter !== "any"}
              options={[
                { label: "Any gender", value: "any" },
                { label: "Female", value: "female" },
                { label: "Male", value: "male" },
              ]}
            />

            {/* Rating Dropdown */}
            <FilterDropdown
              label={ratingLabel}
              value={ratingFilter}
              isOpen={openDropdown === "rating"}
              onToggle={() => toggleDropdown("rating")}
              onSelect={(val) => { setRatingFilter(val); setCurrentPage(1); setOpenDropdown(null); }}
              activeBorder={ratingFilter !== "any"}
              options={[
                { label: "Any rating", value: "any" },
                { label: "4.5 & above", value: "4.5" },
                { label: "4.0 & above", value: "4.0" },
                { label: "3.5 & above", value: "3.5" },
              ]}
            />

            {/* Distance Dropdown */}
            <FilterDropdown
              label={distanceLabel}
              value={distanceFilter}
              isOpen={openDropdown === "distance"}
              onToggle={() => toggleDropdown("distance")}
              onSelect={(val) => { setDistanceFilter(val); setCurrentPage(1); setOpenDropdown(null); }}
              activeBorder={distanceFilter !== "any"}
              options={distanceOptions}
            />

            {/* Language Dropdown */}
            <FilterDropdown
              label={languageLabel}
              value={languageFilter}
              isOpen={openDropdown === "language"}
              onToggle={() => toggleDropdown("language")}
              onSelect={(val) => { setLanguageFilter(val); setCurrentPage(1); setOpenDropdown(null); }}
              activeBorder={languageFilter !== "any"}
              options={languageOptions}
            />

            {/* Items Per Page */}
            <FilterDropdown
              label={`${itemsPerPage} / page`}
              value={itemsPerPage}
              isOpen={openDropdown === "perPage"}
              onToggle={() => toggleDropdown("perPage")}
              onSelect={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); setOpenDropdown(null); }}
              activeBorder={itemsPerPage !== 20}
              options={[
                { label: "10 / page", value: 10 },
                { label: "20 / page", value: 20 },
                { label: "50 / page", value: 50 },
              ]}
            />

            {/* Clear Search Link */}
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={handleClearAll}
                className="fd-chip-clear"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Doctor List */}
          {loading ? (
            <div className="text-center py-5 text-muted">
              <div className="spinner-border text-success mb-3" role="status"></div>
              <p>Loading verified clinicians...</p>
            </div>
          ) : sortedDoctors.length === 0 ? (
            <div className="fd-empty">
              <h5>No doctors found</h5>
              <p>Try resetting your search query or specialty/availability filters.</p>
              <button className="fd-btn primary" style={{ width: 'auto', display: 'inline-flex', padding: '0 24px' }} onClick={handleClearAll}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="fd-grid">
                {paginatedDoctors.map((doc) => {
                  const { user } = doc;
                  const rawFirst = user?.first_name ? user.first_name.trim() : '';
                  const rawLast = user?.last_name ? user.last_name.trim() : '';
                  const toTitleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');
                  const docTitleName = (rawFirst || rawLast) ? `Dr. ${toTitleCase(rawFirst)} ${toTitleCase(rawLast)}`.trim() : 'Dr. Consultant';
                  const docFullNameLower = `${rawFirst} ${rawLast}`.toLowerCase();

                  const clinicObj = doc.schedules?.[0]?.clinic || user?.clinics?.[0] || null;
                  const clinicName = clinicObj?.name || (rawFirst ? `${rawFirst}'s Medical Care` : "Speciality Clinic");
                  const clinicAddress = clinicObj?.address
                    ? `${clinicObj.address}${clinicObj.city ? `, ${clinicObj.city}` : ''}`
                    : user?.clinics?.[0]?.address
                      ? `${user.clinics[0].address}${user.clinics[0].city ? `, ${user.clinics[0].city}` : ''}`
                      : (clinicObj?.city ? `${clinicObj.city}, Gujarat` : "Gujarat, India");
                  const phone = clinicObj?.phone || user?.phone || "+91 9876543210";
                  const specialization = doc.departments?.[0]?.name || doc.department || doc.specialization || "General Medicine";
                  const scheduleDays = getDoctorScheduleDays(doc);
                  const dayIndex = new Date().getDay();
                  const daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  const currentDayName = daysNames[dayIndex];
                  const todayObj = scheduleDays?.find((d) => d.day === currentDayName);
                  const todayTiming = todayObj?.timing || scheduleDays?.[0]?.timing || "Open 24 hours";
                  const isScheduleOpen = expandedScheduleId === doc.id;
                  const reviewsCount = doc.reviews?.length || 0;
                  const avgRating = reviewsCount > 0
                    ? (doc.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviewsCount).toFixed(1)
                    : "5.0";
                  const image = getDoctorImageUrl(doc);
                  const docDist = getDocDistanceKm(doc);

                  const searchTrimmed = (search || '').trim().toLowerCase();
                  const isClinicMatch = Boolean(
                    searchTrimmed &&
                    clinicName.toLowerCase().includes(searchTrimmed) &&
                    (!docFullNameLower.includes(searchTrimmed) || searchTrimmed.includes('clinic'))
                  );

                  const isClinicCard = Boolean(doc.isClinicCard && doc.clinicDoctors && doc.clinicDoctors.length > 0);
                  const clinicDoctorsList = isClinicCard ? doc.clinicDoctors : [doc];

                  const primaryTitle = isClinicCard ? clinicName : (isClinicMatch ? clinicName : docTitleName);
                  const subtitleText = isClinicMatch
                    ? (docTitleName !== 'Dr. Consultant' ? `${docTitleName} · ${specialization}` : specialization)
                    : clinicName;

                  // Extract all unique specializations
                  const specializationsList = Array.from(
                    new Set(
                      clinicDoctorsList
                        .map((d) => d.departments?.[0]?.name || d.department || d.specialization)
                        .filter(Boolean)
                    )
                  );
                  if (specializationsList.length === 0) specializationsList.push(specialization);

                  // Availability across doctors
                  const hasDoctorAvailableToday = clinicDoctorsList.some((d) => {
                    const days = getDoctorScheduleDays(d);
                    const tObj = days?.find((item) => item.day === currentDayName);
                    return tObj && tObj.timing !== 'Closed';
                  });
                  const displayTimingBadge = hasDoctorAvailableToday || todayTiming !== 'Closed' ? 'Available today' : 'Next available';

                  const mapUrl = clinicObj?.google_maps_url
                    ? clinicObj.google_maps_url
                    : (clinicObj?.latitude && clinicObj?.longitude)
                    ? `https://www.google.com/maps?q=${clinicObj.latitude},${clinicObj.longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((clinicName || '') + ' ' + (clinicAddress || ''))}`;

                  return (
                    /* Exact  3-Column Doctor / Clinic Card */
                    <div key={doc.id} className="fd-card">
                      {/* 1. Avatar column  */}
                      <div
                        className="fd-avatar"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleBookClick(clinicDoctorsList[0]?.id || doc.id)}
                        title={`View ${primaryTitle}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={primaryTitle}
                          className="fd-avatar-img"
                          onError={(e) => handleDoctorImageError(e, doc.gender || doc.doctorProfile?.gender)}
                        />
                      </div>

                      {/* 2. Top-right favorite heart button */}
                      <button
                        type="button"
                        className="fd-fav"
                        aria-label="Save doctor"
                      >
                        <FiHeart size={15} />
                      </button>

                      {/* 3. Identity Column */}
                      <div className="fd-identity">
                        <div className="fd-name-row">
                          <span
                            className="fd-name"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleBookClick(clinicDoctorsList[0]?.id || doc.id)}
                            title={`View ${primaryTitle}`}
                          >
                            {primaryTitle}
                          </span>
                          <span className="fd-verified">
                            <FaCheckCircle size={10} /> Verified
                          </span>
                        </div>

                        {/* Where doctor name is: show all doctors if clinic card */}
                        {isClinicCard ? (
                          <div className="fd-qual d-flex flex-wrap align-items-center gap-1 mb-1">
                            {clinicDoctorsList.map((cd, idx) => {
                              const cdFirst = cd.user?.first_name ? cd.user.first_name.trim() : '';
                              const cdLast = cd.user?.last_name ? cd.user.last_name.trim() : '';
                              const cdName = (cdFirst || cdLast) ? `Dr. ${toTitleCase(cdFirst)} ${toTitleCase(cdLast)}`.trim() : 'Dr. Consultant';
                              const cdSpec = cd.departments?.[0]?.name || cd.department || cd.specialization || '';
                              return (
                                <span
                                  key={cd.id || idx}
                                  className="d-inline-flex align-items-center me-2"
                                  style={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/finddoctor/${cd.id}`);
                                  }}
                                  title={`Book appointment with ${cdName}`}
                                >
                                  <strong className="text-dark" style={{ textDecoration: 'underline', textDecorationColor: 'rgba(0,0,0,0.15)' }}>{cdName}</strong>
                                  {cdSpec && <span className="text-muted ms-1">· {cdSpec}</span>}
                                  {idx < clinicDoctorsList.length - 1 && <span className="mx-2 text-secondary">•</span>}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="fd-qual">{subtitleText}</div>
                        )}

                        <div className="fd-spec-row">
                          {specializationsList.map((spec, i) => (
                            <span key={i} className="fd-pill">{spec}</span>
                          ))}
                          <div className="fd-rating">
                            <span className="star">★</span>
                            <span style={{ fontWeight: 600, color: 'var(--ecp-ink)' }}>{avgRating}</span>
                            <span className="rv">({reviewsCount})</span>
                          </div>
                        </div>

                        <div className="fd-meta">
                          <div className="fd-meta-row">
                            <span className="mi"><FiMapPin size={15} /></span>
                            <span>
                              {clinicAddress} <span className="fd-distance">· {formatDistanceText(docDist)}</span>
                            </span>
                          </div>

                          <div className="fd-meta-row">
                            <span className="mi"><FaPhoneAlt size={12} /></span>
                            <a href={`tel:${phone}`} title="Call Clinic">{phone}</a>
                          </div>

                          {todayTiming && (
                            <div className="fd-meta-row">
                              <span className="mi"><FiClock size={15} /></span>
                              <div className="fd-hours">
                                <button
                                  type="button"
                                  className="fd-hours-toggle"
                                  onClick={() => setExpandedScheduleId(isScheduleOpen ? null : doc.id)}
                                >
                                  <span>Today: {todayTiming}</span>
                                  <span className={`caret ${isScheduleOpen ? 'open' : ''}`}>▾</span>
                                </button>

                                {isScheduleOpen && scheduleDays && (
                                  <ul className="fd-hours-list">
                                    {scheduleDays.map((item) => (
                                      <li key={item.day} style={{ fontWeight: item.day === currentDayName ? 600 : 400, color: item.day === currentDayName ? 'var(--ecp-ink)' : 'inherit' }}>
                                        <span style={{ minWidth: 80, display: 'inline-block' }}>{item.day}:</span>
                                        <span>{item.timing}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. Right Column: Book & Actions Box */}
                      <div className="fd-book">
                        <span className="fd-slot">
                          <span className="dot"></span>
                          <span>{displayTimingBadge}</span>
                        </span>

                        <div className="fd-actions">
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fd-btn"
                          >
                            View on map
                          </a>

                          <button
                            type="button"
                            className="fd-btn primary"
                            onClick={() => handleBookClick(clinicDoctorsList[0]?.id || doc.id)}
                          >
                            <FaCalendarAlt size={13} /> Book
                          </button>

                          <a
                            href={phone ? `tel:${phone}` : '#'}
                            className="fd-btn"
                          >
                            <FaPhoneAlt size={12} /> Call
                          </a>
                        </div>

                        {/* Claim / Verified Footer in right column */}
                        {isClinicMatch ? (
                          <Link href="/clinic/register" className="fd-claim-link">
                            Is this your clinic? <strong>Claim it</strong>
                          </Link>
                        ) : (
                          <span className="fd-claim-link verified">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00875a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Verified by doctor
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="fd-pager">
                  <button
                    type="button"
                    className="fd-pg"
                    disabled={validCurrentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                  >
                    &larr; Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`fd-pg ${validCurrentPage === pageNum ? 'is-active' : ''}`}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="fd-pg"
                    disabled={validCurrentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}

              {/* Promo Banner */}
              <div className="fd-listme">
                <div className="fd-listme-inner">
                  <div>
                    <h3>Are you a doctor not listed here?</h3>
                    <p>Add your clinic in a minute — we&apos;ll review and get back to you.</p>
                  </div>
                  <Link href="/clinic/register" className="fd-listme-btn">
                    List my clinic
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
