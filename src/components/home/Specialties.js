"use client";

import React, { useState } from "react";
import Link from "next/link";
import Card from "@/components/common/Card";
import {
  FaStethoscope,
  FaHeart,
  FaBrain,
  FaLungs,
  FaLeaf,
  FaTooth,
  FaSyringe,
  FaPuzzlePiece,
  FaMagic,
  FaHandHoldingHeart,
  FaClinicMedical
} from "react-icons/fa";

export default function Specialties() {
  const [activeCategory, setActiveCategory] = useState("All Specialties");

  const categories = [
    { name: "All Specialties", icon: null },
    { name: "Medical", icon: FaStethoscope },
    { name: "Surgical", icon: FaSyringe },
    { name: "Dental", icon: FaTooth },
    { name: "Wellness", icon: FaLeaf },
    { name: "Mental Health", icon: FaPuzzlePiece }
  ];

  const specialtiesData = [
    {
      title: "General Physician",
      description: "Your first stop for fever, infections, and everyday health concerns.",
      icon: FaStethoscope,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Medical"]
    },
    {
      title: "Cardiologist",
      description: "Expert care for heart conditions, BP, cholesterol and more.",
      icon: FaHeart,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Medical", "Surgical"]
    },
    {
      title: "Dermatologist",
      description: "Skin, hair and nail treatments — acne to eczema and beyond.",
      icon: FaMagic,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Medical", "Wellness"]
    },
    {
      title: "Neurologist",
      description: "Brain and nervous system specialist for migraines, epilepsy and more.",
      icon: FaBrain,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Medical"]
    },
    {
      title: "Pulmonologist",
      description: "Lung and respiratory specialist for asthma, COPD and infections.",
      icon: FaLungs,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Medical"]
    },
    {
      title: "Dentist",
      description: "Teeth, gum care, braces, and regular oral hygiene procedures.",
      icon: FaTooth,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Dental"]
    },
    {
      title: "Physiotherapist",
      description: "Rehabilitation, joint pain relief, and customized physical therapy.",
      icon: FaHandHoldingHeart,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Wellness"]
    },
    {
      title: "Psychiatrist",
      description: "Therapy, mental well-being, stress, and anxiety management.",
      icon: FaPuzzlePiece,
      iconWrapperClass: "bg-specialty-green",
      categories: ["Mental Health"]
    }
  ];

  // Filter specialties based on active category selection
  const filteredSpecialties = activeCategory === "All Specialties"
    ? specialtiesData
    : specialtiesData.filter(item => item.categories.includes(activeCategory));

  return (
    <div className="specialties-section">
      <div className="container py-4">
        {/* Top Header */}
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <div className="specialties-header-line"></div>
            <span className="text-uppercase fw-bold small text-brand-green specialties-subheading">
              ALL YOU NEED, ALL IN ONE PLACE
            </span>
            <div className="specialties-header-line"></div>
          </div>
          <h2 className="display-5 fw-bold text-dark mb-3 specialties-title">
            30+ specialties. <span className="text-brand-green">One booking flow.</span>
          </h2>
          <p className="text-muted col-lg-6 mx-auto specialties-desc">
            Whatever you need — from a general physician to a neurosurgeon, a homeopath to a dietitian — find them in seconds. All verified, all across India.
          </p>
        </div>

        {/* Category Selection Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat.name)}
                className={`btn d-flex align-items-center px-4 py-2 rounded-pill specialties-pill ${isActive ? "specialties-pill-active" : "specialties-pill-inactive"
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Specialties Grid */}
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center">
          {filteredSpecialties.map((specialty, idx) => (
            <div key={idx} className="col">
              <Card
                title={specialty.title}
                description={specialty.description}
                icon={specialty.icon}
                iconWrapperClass={specialty.iconWrapperClass}
                actionType="arrow"
                link={`/specialties/${specialty.title.toLowerCase().replace(" ", "-")}`}
              />
            </div>
          ))}
        </div>

        {/* Everything works together Banner */}
        <div className="specialties-banner mt-5 d-flex flex-column flex-md-row align-items-center justify-content-between p-4 rounded-4" style={{ backgroundColor: "#e2ede7", border: "1px solid #c7dcd0", borderRadius: "16px" }}>
          <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-3 mb-md-0 text-center text-sm-start">
            <div className="banner-icon-wrapper p-3 bg-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ color: "#0d7a57", minWidth: "56px", minHeight: "56px", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
              <FaClinicMedical size={28} />
            </div>
            <div>
              <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: "1.15rem" }}>Everything works together</h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.92rem", lineHeight: "1.5" }}>
                All specialties are connected under one seamless booking flow — find, compare and book verified doctors across India in seconds.
              </p>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center flex-shrink-0">
            <Link href="/specialties" className="btn px-4 py-2 rounded-pill fw-semibold text-white text-decoration-none" style={{ backgroundColor: "#0d7a57", fontSize: "0.9rem" }}>
              Explore all specialties &rarr;
            </Link>
            <Link href="/finddoctor" className="btn px-4 py-2 rounded-pill fw-semibold text-decoration-none" style={{ borderColor: "#0d7a57", color: "#0d7a57", backgroundColor: "transparent", border: "1.5px solid", fontSize: "0.9rem" }}>
              Browse by city
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
