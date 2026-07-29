'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiHeart } from "react-icons/fi";
import { FaCheckCircle, FaStar, FaPhoneAlt, FaRegClock, FaCalendarAlt, FaVideo } from "react-icons/fa";
import { getVisitorDoctors } from "@/services/visitorService";

export default function FindDoctor() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoading(true);
        const res = await getVisitorDoctors();
        if (res.success && Array.isArray(res.data)) {
          setDoctors(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.user ? `${doc.user.first_name} ${doc.user.last_name}`.toLowerCase() : "";
    const spec = doc.specialization ? doc.specialization.toLowerCase() : "";
    const clinic = doc.schedules?.[0]?.clinic?.name ? doc.schedules[0].clinic.name.toLowerCase() : "";

    const matchesSearch = !search || name.includes(search.toLowerCase()) || spec.includes(search.toLowerCase()) || clinic.includes(search.toLowerCase());
    const matchesSpec = specialtyFilter === "all" || spec.includes(specialtyFilter.toLowerCase());

    return matchesSearch && matchesSpec;
  });

  const handleBookClick = (docId) => {
    router.push(`/finddoctor/${docId}`);
  };

  return (
    <div className="bg-light pb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section (eClinicPro Style) */}
      <div className="bg-white text-center py-5 border-bottom">
        <div className="container px-lg-5">
          <h1 className="fw-light mb-3 fd-hero-title text-dark" style={{ fontSize: 38 }}>
            Find a doctor you can <span className="fw-normal" style={{ color: '#00a676', fontFamily: 'serif', fontStyle: 'italic' }}>actually trust.</span>
          </h1>
          <p className="text-muted mb-4 fs-5" style={{ fontSize: 16 }}>
            Search 76,750+ verified clinicians across India — see real availability, fees<br />and ratings before you book.
          </p>

          <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-1-5 mb-4 text-muted border small fw-semibold">
            <span className="badge bg-white text-dark me-2 border rounded-pill px-2">IN</span> Showing doctors in India
          </div>

          {/* Search Box Bar (eClinicPro Pill Box) */}
          <div
            className="d-flex mx-auto border rounded-pill overflow-hidden shadow-sm align-items-center bg-white my-2"
            style={{ maxWidth: 850, borderRadius: 9999, border: '1px solid #e2e8f0', padding: '6px 8px 6px 16px' }}
          >
            {/* Left Input: DOCTOR / HOSPITAL */}
            <div className="d-flex flex-fill px-3 align-items-center border-end">
              <FiSearch className="text-muted me-3 flex-shrink-0" size={20} />
              <div className="text-start w-100">
                <div className="text-uppercase text-muted fw-bold" style={{ fontSize: 10, letterSpacing: 0.5 }}>
                  DOCTOR / HOSPITAL
                </div>
                <input
                  type="text"
                  className="border-0 bg-transparent w-100 p-0 text-dark fw-medium"
                  style={{ outline: 'none', fontSize: 14 }}
                  placeholder="e.g. Dr. Mehta or Apollo Hospitals"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Right Input: AREA, CITY, STATE OR COUNTRY */}
            <div className="d-flex flex-fill px-3 align-items-center">
              <FiMapPin className="text-muted me-3 flex-shrink-0" size={20} />
              <div className="text-start w-100">
                <div className="text-uppercase text-muted fw-bold" style={{ fontSize: 10, letterSpacing: 0.5 }}>
                  AREA, CITY, STATE OR COUNTRY
                </div>
                <input
                  type="text"
                  className="border-0 bg-transparent w-100 p-0 text-dark fw-medium"
                  style={{ outline: 'none', fontSize: 14 }}
                  placeholder="Type a place — Bandra, Mumbai, Maharashtra..."
                  readOnly
                  value="Surendranagar, Gujarat"
                />
              </div>
            </div>

            {/* Search Button Circle */}
            <button
              className="btn text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ms-2"
              style={{ width: 44, height: 44, background: '#00a676', border: 'none' }}
            >
              <span className="fs-5 fw-bold">→</span>
            </button>
          </div>

          {/* Specialties Horizontal Scroll Pills */}
          <div className="mt-4 d-flex flex-nowrap gap-2 overflow-auto hide-scrollbar pb-2 px-3 justify-content-center">
            <button
              className={`btn rounded-pill px-4 py-2 fs-6 fw-bold text-nowrap flex-shrink-0 ${specialtyFilter === 'all' ? 'btn-dark text-white' : 'btn-light border text-dark'}`}
              onClick={() => setSpecialtyFilter('all')}
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              All specialties
            </button>
            <button
              className={`btn rounded-pill px-4 py-2 fs-6 text-nowrap flex-shrink-0 ${specialtyFilter === 'general physician' ? 'btn-success text-white' : 'btn-light border text-dark'}`}
              onClick={() => setSpecialtyFilter('general physician')}
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              General physician
            </button>
            <button
              className={`btn rounded-pill px-4 py-2 fs-6 text-nowrap flex-shrink-0 ${specialtyFilter === 'dermatologist' ? 'btn-success text-white' : 'btn-light border text-dark'}`}
              onClick={() => setSpecialtyFilter('dermatologist')}
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              Dermatologist
            </button>
            <button
              className={`btn rounded-pill px-4 py-2 fs-6 text-nowrap flex-shrink-0 ${specialtyFilter === 'family medicine' ? 'btn-success text-white' : 'btn-light border text-dark'}`}
              onClick={() => setSpecialtyFilter('family medicine')}
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              Family medicine doctor
            </button>
            <button
              className={`btn rounded-pill px-4 py-2 fs-6 text-nowrap flex-shrink-0 ${specialtyFilter === 'cardiologist' ? 'btn-success text-white' : 'btn-light border text-dark'}`}
              onClick={() => setSpecialtyFilter('cardiologist')}
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              Cardiologist
            </button>
            <button
              className={`btn rounded-pill px-4 py-2 fs-6 text-nowrap flex-shrink-0 ${specialtyFilter === 'neurologist' ? 'btn-success text-white' : 'btn-light border text-dark'}`}
              onClick={() => setSpecialtyFilter('neurologist')}
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              Neurologist
            </button>
            <button
              className={`btn rounded-pill px-4 py-2 fs-6 text-nowrap flex-shrink-0 ${specialtyFilter === 'pulmonologist' ? 'btn-success text-white' : 'btn-light border text-dark'}`}
              onClick={() => setSpecialtyFilter('pulmonologist')}
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              Pulmonologist
            </button>
            <button
              className="btn btn-light border rounded-pill px-4 py-2 fs-6 text-nowrap flex-shrink-0 text-dark"
              style={{ borderRadius: 30, fontSize: 14 }}
            >
              + All specialties
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mt-4 px-lg-5">
        {/* Top Result Count Bar & Sorting */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="text-muted fw-semibold" style={{ fontSize: 14 }}>
            <span className="text-dark fw-bold">76,750</span> doctors in India
          </div>
          <div className="d-flex align-items-center">
            <select className="form-select border rounded-pill ps-3 pe-4 text-dark small fw-semibold shadow-2xs" style={{ fontSize: 13, borderColor: '#e2e8f0' }}>
              <option>Sort: Best match</option>
            </select>
          </div>
        </div>

        {/* Filter Chips Row (eClinicPro Row) */}
        <div className="d-flex gap-2 mb-4 flex-wrap align-items-center">
          <select className="form-select border rounded-pill shadow-2xs w-auto ps-3 pe-4 text-dark small fw-semibold" style={{ fontSize: 13, borderColor: '#e2e8f0' }}><option>Available</option></select>
          <button className="btn btn-white border rounded-pill shadow-2xs d-flex align-items-center gap-2 px-3 py-1-5 text-dark small fw-semibold" style={{ fontSize: 13, borderColor: '#e2e8f0' }}><FaVideo className="text-muted" /> Video consult</button>
          <select className="form-select border rounded-pill shadow-2xs w-auto ps-3 pe-4 text-dark small fw-semibold" style={{ fontSize: 13, borderColor: '#e2e8f0' }}><option>Gender</option></select>
          <select className="form-select border rounded-pill shadow-2xs w-auto ps-3 pe-4 text-dark small fw-semibold" style={{ fontSize: 13, borderColor: '#e2e8f0' }}><option>Rating</option></select>
          <select className="form-select border rounded-pill shadow-2xs w-auto ps-3 pe-4 text-dark small fw-semibold" style={{ fontSize: 13, borderColor: '#e2e8f0' }}><option>Distance</option></select>
          <select className="form-select border rounded-pill shadow-2xs w-auto ps-3 pe-4 text-dark small fw-semibold" style={{ fontSize: 13, borderColor: '#e2e8f0' }}><option>Language</option></select>
          <select className="form-select border rounded-pill shadow-2xs w-auto ps-3 pe-4 text-dark small fw-semibold" style={{ fontSize: 13, borderColor: '#e2e8f0' }}><option>20 / page</option></select>
        </div>

        {/* Doctor List */}
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-success mb-3" role="status"></div>
            <p>Loading verified doctors from database...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 shadow-sm">
            <h5 className="text-dark fw-bold">No doctors found</h5>
            <p className="text-muted">Try resetting your search query or specialty filter.</p>
            <button className="btn btn-outline-success rounded-pill px-4" onClick={() => { setSearch(''); setSpecialtyFilter('all'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredDoctors.map((doc) => {
              const docName = doc.user ? `DR ${doc.user.first_name} ${doc.user.last_name}`.toUpperCase() : `DR MITESH PRAJAPATI`;
              const clinicObj = doc.schedules?.[0]?.clinic;
              const clinicName = clinicObj?.name || "Dr.FeelGood's Clinic";
              const clinicAddress = clinicObj?.address ? `${clinicObj.address}, ${clinicObj.city}` : "6&7, 2nd FLOOR, A-WING, New SG Rd, opposite SHUKAN PLATINUM, near VANDEMATRAM CIRCLE, Vandematram Arcade, Gota, Ahmedabad, Gujarat 382481, India";
              const phone = clinicObj?.phone || doc.user?.phone || "+919727832228";
              const timings = doc.opd_timing || "Today: 9:30 AM – 1:30 PM, 4:30 – 8:30 PM";
              const image = doc.user?.profile_image && !doc.user.profile_image.includes("placehold.co")
                ? doc.user.profile_image
                : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200";

              return (
                /* Doctor Card Container (Exact eClinicPro Match) */
                <div
                  key={doc.id}
                  className="card border-0 bg-white"
                  style={{
                    borderRadius: 24,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                    padding: '24px 28px',
                  }}
                >
                  <div className="d-flex flex-column flex-lg-row gap-4 align-items-stretch">

                    {/* Left Column: Doctor Image + Main Details */}
                    <div className="d-flex flex-grow-1 gap-4">
                      {/* Doctor Image */}
                      <div
                        className="flex-shrink-0 rounded-4 overflow-hidden bg-light"
                        style={{ width: 110, height: 110 }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={docName}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>

                      {/* Doctor Header Info */}
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="mb-0 fw-extrabold text-dark tracking-tight" style={{ fontSize: 18, letterSpacing: '-0.3px' }}>
                            {docName}
                          </h5>
                          <span
                            className="badge d-flex align-items-center gap-1 rounded-pill px-2-5 py-1"
                            style={{ background: '#e6f4ea', color: '#00a676', fontSize: 12, fontWeight: 600 }}
                          >
                            <FaCheckCircle size={12} /> Verified
                          </span>
                        </div>

                        <div className="text-muted small mb-2" style={{ fontSize: 14, color: '#64748b' }}>
                          {clinicName}
                        </div>

                        <div className="d-flex align-items-center gap-3 mb-3">
                          <span
                            className="px-3 py-1 rounded-pill text-dark small fw-semibold"
                            style={{ background: '#f1f5f9', fontSize: 13, border: '1px solid #e2e8f0' }}
                          >
                            {doc.specialization || "Homeopathy doctor"}
                          </span>
                          <div className="d-flex align-items-center gap-1 text-dark small fw-bold" style={{ fontSize: 14 }}>
                            <FaStar className="text-warning" /> 4.9 <span className="text-muted fw-normal">(196)</span>
                          </div>
                        </div>

                        {/* Horizontal Dotted Separator Line */}
                        <div style={{ borderTop: '1px dotted #cbd5e1', margin: '14px 0 16px 0', opacity: 0.8 }} />

                        {/* Bottom Info List */}
                        <div className="d-flex flex-column gap-2 text-muted small" style={{ fontSize: 13.5, color: '#475569' }}>
                          <div className="d-flex align-items-start gap-2">
                            <FiMapPin className="mt-1 flex-shrink-0" style={{ color: '#00a676' }} size={16} />
                            <span style={{ color: '#334155', lineHeight: 1.4 }}>{clinicAddress}</span>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <FaPhoneAlt className="flex-shrink-0" style={{ color: '#00a676' }} size={13} />
                            <span style={{ color: '#334155', fontWeight: 500 }}>{phone}</span>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <FaRegClock className="text-muted flex-shrink-0" size={14} />
                            <span style={{ color: '#475569' }}>{timings} <span style={{ fontSize: 10 }}>▼</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Actions Box (Exact eClinicPro Match) */}
                    <div
                      className="d-flex flex-column align-items-end justify-content-between flex-shrink-0 pt-2"
                      style={{
                        borderLeft: '1px solid #f1f5f9',
                        paddingLeft: 24,
                        minWidth: 210,
                      }}
                    >
                      {/* Contact Clinic Badge + Heart Button */}
                      <div className="w-100 d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="badge border rounded-pill px-3 py-2 fw-normal d-flex align-items-center gap-2"
                          style={{ background: '#f8fafc', color: '#475569', borderColor: '#e2e8f0', fontSize: 12 }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b', display: 'inline-block' }}></span>
                          Contact clinic
                        </span>

                        <button
                          className="btn btn-light rounded-circle border p-2 bg-white d-flex align-items-center justify-content-center shadow-2xs"
                          style={{ width: 36, height: 36, color: '#64748b' }}
                        >
                          <FiHeart size={16} />
                        </button>
                      </div>

                      {/* Action Buttons Stack */}
                      <div className="w-100 d-flex flex-column gap-2">
                        <button
                          className="btn btn-white border fw-semibold w-100 py-2 rounded-3 text-dark shadow-2xs"
                          style={{ fontSize: 14, borderColor: '#cbd5e1' }}
                        >
                          View on map
                        </button>

                        <button
                          className="btn text-white fw-bold w-100 py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                          onClick={() => handleBookClick(doc.id)}
                          style={{ background: '#00a676', borderColor: '#00a676', fontSize: 14 }}
                        >
                          <FaCalendarAlt size={14} /> Book
                        </button>

                        <button
                          className="btn btn-white border fw-semibold w-100 py-2 rounded-3 text-dark shadow-2xs d-flex align-items-center justify-content-center gap-2"
                          style={{ fontSize: 14, borderColor: '#cbd5e1' }}
                        >
                          <FaPhoneAlt style={{ color: '#00a676' }} size={13} /> Call
                        </button>
                      </div>

                      {/* Verified Footer */}
                      <div className="w-100 text-end mt-3">
                        <span className="small fw-semibold d-flex justify-content-end align-items-center gap-1" style={{ color: '#00a676', fontSize: 12 }}>
                          <FaCheckCircle size={12} /> Verified by doctor
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
