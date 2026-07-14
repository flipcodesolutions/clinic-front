import React from "react";
import { FiSearch, FiMapPin, FiHeart } from "react-icons/fi";
import { FaCheckCircle, FaStar, FaPhoneAlt, FaRegClock, FaVideo } from "react-icons/fa";
import Image from "next/image";

const doctorData = [
  {
    id: 1,
    name: "DR MITESH PRAJAPATI",
    verified: true,
    clinicName: "Dr.FeelGood's Clinic",
    specialty: "Homeopathy doctor",
    rating: 4.9,
    reviewsCount: 196,
    address: "6&7, 2nd FLOOR, A-WING, New SG Rd, opposite SHUKAN PLATINUM, near VANDEMATRAM CIRCLE, Vandematram Arcade, Gota, Ahmedabad, Gujarat 382481, India",
    phone: "+919727832228",
    timings: "Today: 9:30 AM – 1:30 PM, 4:30 – 8:30 PM",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 2,
    name: "DR ANJALI SHARMA",
    verified: true,
    clinicName: "Carewell Multi-Specialty Clinic",
    specialty: "General physician",
    rating: 4.7,
    reviewsCount: 120,
    address: "102, Shivalik Plaza, IIM Road, Panjara Pol, Ahmedabad, Gujarat 380015, India",
    phone: "+919876543210",
    timings: "Today: 10:00 AM – 2:00 PM, 5:00 – 9:00 PM",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 3,
    name: "DR RAHUL DESAI",
    verified: false,
    clinicName: "Skin & Hair Care Clinic",
    specialty: "Dermatologist",
    rating: 4.5,
    reviewsCount: 85,
    address: "305, Titanium City Centre, Anandnagar Road, Satellite, Ahmedabad, Gujarat 380015, India",
    phone: "+919822334455",
    timings: "Today: 11:00 AM – 3:00 PM, 6:00 – 8:00 PM",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 4,
    name: "DR SNEHA PATEL",
    verified: true,
    clinicName: "HeartBeat Cardiology Center",
    specialty: "Cardiologist",
    rating: 4.8,
    reviewsCount: 250,
    address: "1st Floor, Apollo Towers, C.G. Road, Navrangpura, Ahmedabad, Gujarat 380009, India",
    phone: "+919123456789",
    timings: "Today: 9:00 AM – 1:00 PM, 4:00 – 7:00 PM",
    image: "https://images.unsplash.com/photo-1594824436998-6170da6d8b9d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 5,
    name: "DR VIKAS MEHTA",
    verified: true,
    clinicName: "Brain & Spine Clinic",
    specialty: "Neurologist",
    rating: 4.6,
    reviewsCount: 145,
    address: "402, Samudra Annexe, Off C.G. Road, Ahmedabad, Gujarat 380006, India",
    phone: "+918899001122",
    timings: "Today: 10:30 AM – 2:30 PM, 5:30 – 8:30 PM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 6,
    name: "DR PRIYA SHAH",
    verified: true,
    clinicName: "Breathe Easy Pulmonology Care",
    specialty: "Pulmonologist",
    rating: 4.9,
    reviewsCount: 310,
    address: "GF-10, Dev Arc Mall, ISKCON Cross Road, S.G. Highway, Ahmedabad, Gujarat 380015, India",
    phone: "+917788994455",
    timings: "Today: 9:00 AM – 2:00 PM",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=200&h=200",
  }
];

export default function FindDoctor() {
  return (
    <div className="bg-light pb-5">
      {/* Hero Section */}
      <div className="bg-white text-center py-5 border-bottom">
        <div className="container px-lg-5">
          <h1 className="fw-light mb-3 fd-hero-title">
            Find a doctor you can <span className="text-success text-fd-success">actually trust.</span>
          </h1>
          <p className="text-muted mb-4 fs-5">
            Search 44,708+ verified clinicians across India — see real availability, fees<br />and ratings before you book.
          </p>

          <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-2 mb-4 fs-6 text-muted border">
             Showing doctors in India
          </div>

          {/* Search Box */}
          <div className="d-flex mx-auto border rounded-pill overflow-hidden shadow-sm align-items-center fd-search-bar">
            <div className="d-flex flex-fill px-4 align-items-center border-end">
              <FiSearch className="text-primary me-2" size={20} />
              <div className="text-start w-100">
                <div className="text-uppercase text-muted fd-search-label">Doctor / Hospital</div>
                <input type="text" className="border-0 bg-transparent w-100 p-0 text-dark fd-search-input" placeholder="e.g. Dr. Mehta or Apollo Hospitals" />
              </div>
            </div>
            <div className="d-flex flex-fill px-4 align-items-center">
              <FiMapPin className="text-danger me-2" size={20} />
              <div className="text-start w-100">
                <div className="text-uppercase text-muted fd-search-label">Area, City, State or Country</div>
                <input type="text" className="border-0 bg-transparent w-100 p-0 text-dark fd-search-input" placeholder="Type a place — Bandra, Mumbai, Maharashtra..." />
              </div>
            </div>
            <button className="btn btn-success h-100 rounded-0 px-4 d-flex align-items-center justify-content-center fd-search-btn">
              <span className="fs-4 text-white">&rarr;</span>
            </button>
          </div>

          {/* Specialties Pills */}
          <div className="mt-4 d-flex flex-nowrap gap-3 overflow-auto hide-scrollbar pb-2 px-3">
            <button className="btn btn-dark rounded-pill px-4 py-2 fs-6 fw-bold text-nowrap flex-shrink-0">All specialties</button>
            <button className="btn btn-white border rounded-pill px-4 py-2 fs-6 d-flex align-items-center gap-2 shadow-sm text-nowrap flex-shrink-0"><span className="text-primary">🩺</span> General physician</button>
            <button className="btn btn-white border rounded-pill px-4 py-2 fs-6 d-flex align-items-center gap-2 shadow-sm text-nowrap flex-shrink-0"><span className="text-warning">✨</span> Dermatologist</button>
            <button className="btn btn-white border rounded-pill px-4 py-2 fs-6 d-flex align-items-center gap-2 shadow-sm text-nowrap flex-shrink-0"><span className="text-success">🏡</span> Family medicine doctor</button>
            <button className="btn btn-white border rounded-pill px-4 py-2 fs-6 d-flex align-items-center gap-2 shadow-sm text-nowrap flex-shrink-0"><span className="text-danger">❤️</span> Cardiologist</button>
            <button className="btn btn-white border rounded-pill px-4 py-2 fs-6 d-flex align-items-center gap-2 shadow-sm text-nowrap flex-shrink-0"><span className="text-purple">🧠</span> Neurologist</button>
            <button className="btn btn-white border rounded-pill px-4 py-2 fs-6 d-flex align-items-center gap-2 shadow-sm text-nowrap flex-shrink-0"><span className="text-danger">🫁</span> Pulmonologist</button>
            <button className="btn btn-white border rounded-pill px-4 py-2 fs-6 shadow-sm text-nowrap flex-shrink-0">+ All</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mt-4 px-lg-5">
        {/* Top Filter Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-muted fw-semibold">
            <span className="text-dark fw-bold">44,708</span> doctors in India
          </div>
          <div className="d-flex align-items-center">
            <select className="form-select border rounded-pill ps-3 pe-5 shadow-sm fd-filter-select-lg">
              <option>Sort: Best match</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2 mb-4 flex-wrap">
          <select className="form-select border rounded-pill shadow-sm d-inline-block w-auto ps-3 pe-5 fd-filter-select"><option>Available</option></select>
          <button className="btn btn-white border rounded-pill shadow-sm d-flex align-items-center gap-2 px-3"><FaVideo className="text-muted"/> Video consult</button>
          <select className="form-select border rounded-pill shadow-sm d-inline-block w-auto ps-3 pe-5 fd-filter-select"><option>Gender</option></select>
          <select className="form-select border rounded-pill shadow-sm d-inline-block w-auto ps-3 pe-5 fd-filter-select"><option>Rating</option></select>
          <select className="form-select border rounded-pill shadow-sm d-inline-block w-auto ps-3 pe-5 fd-filter-select"><option>Distance</option></select>
          <select className="form-select border rounded-pill shadow-sm d-inline-block w-auto ps-3 pe-5 fd-filter-select"><option>Language</option></select>
          <select className="form-select border rounded-pill shadow-sm d-inline-block w-auto ps-3 pe-5 fd-filter-select"><option>20 / page</option></select>
        </div>

        {/* Doctor List */}
        <div className="d-flex flex-column gap-4">
          {doctorData.map((doctor) => (
            <div key={doctor.id} className="card border-0 shadow-sm rounded-4 p-4 position-relative">
              <div className="d-flex flex-column flex-md-row gap-4">
                
                {/* Image */}
                <div className="bg-light position-relative fd-doc-img-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doctor.image} alt={doctor.name} className="fd-doc-img" />
                </div>

                {/* Details */}
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h5 className="mb-0 fw-bold">{doctor.name}</h5>
                    {doctor.verified && (
                      <span className="badge bg-success bg-opacity-10 text-success d-flex align-items-center gap-1 rounded-pill px-2">
                        <FaCheckCircle size={12} /> Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="text-muted small mb-2">{doctor.clinicName}</div>
                  
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="bg-light px-2 py-1 rounded text-dark small fw-semibold">{doctor.specialty}</span>
                    <div className="d-flex align-items-center gap-1 text-dark small fw-semibold">
                      <FaStar className="text-warning" /> {doctor.rating} <span className="text-muted fw-normal">({doctor.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 text-muted small">
                    <div className="d-flex align-items-start gap-2">
                      <FiMapPin className="text-danger mt-1 flex-shrink-0" />
                      <span>{doctor.address}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaPhoneAlt className="text-danger flex-shrink-0" size={12} />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FaRegClock className="text-muted flex-shrink-0" />
                      <span>{doctor.timings}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex flex-column align-items-end justify-content-between fd-action-col">
                  <div className="w-100 d-flex justify-content-between align-items-center mb-3">
                     <span className="badge bg-light text-secondary border rounded-pill px-3 py-2 fw-normal d-flex align-items-center gap-2">
                        <span className="fd-contact-dot"></span>
                        Contact clinic
                     </span>
                     <button className="btn btn-light rounded-circle border p-2 bg-white d-flex align-items-center justify-content-center shadow-sm text-secondary hover-text-danger fd-heart-btn">
                       <FiHeart size={18} />
                     </button>
                  </div>
                  
                  <div className="w-100 d-flex flex-column gap-2">
                    <button className="btn btn-white border fw-bold w-100 py-2 rounded-3 shadow-sm">View on map</button>
                    <button className="btn btn-success fw-bold w-100 py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2">
                      📅 Book
                    </button>
                    <button className="btn btn-white border fw-bold w-100 py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2">
                      <FaPhoneAlt className="text-danger" size={14} /> Call
                    </button>
                  </div>

                  <div className="w-100 text-end mt-2">
                    <span className="text-success small fw-semibold d-flex justify-content-end align-items-center gap-1">
                       <FaCheckCircle size={12}/> Verified by doctor
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
