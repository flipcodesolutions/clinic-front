import React from "react";
import Link from "next/link";
import { FaPlus, FaStar } from "react-icons/fa";
import { FiShield, FiCloud, FiActivity } from "react-icons/fi";
import heroImg from "@/assets/images/Homepage/carely-hero-img1.webp";
import bgImg from "@/assets/images/Homepage/bg.png";

export default function Hero() {
  return (
    <section 
      className="hero-section-custom"
      style={{
        backgroundImage: `url(${bgImg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Background decoration elements */}
      <div className="decor-dot-grid"></div>
      <div className="decor-circle-lines"></div>
      <div className="decor-blob"></div>

      <div className="container px-4 px-lg-5">
        <div className="row align-items-center g-5">
          {/* Left Content Column */}
          <div className="col-lg-6">
            {/* Serving Badge */}
            <span className="badge-brand-subtle mb-3">
              <span className="dot me-2">●</span>
              Now serving <span className="small-caps-in">in</span> India &middot; 76,750 verified doctors
            </span>

            {/* Headline */}
            <h1 className="hero-title-custom mb-3">
              Healthcare, <br />
              <span className="text-brand-green">made simple.</span>
            </h1>

            {/* Description */}
            <p className="hero-subtitle-custom mb-4">
              Whether you want to book a doctor or run your clinic &mdash; eClinicPro is one place for both. Verified clinicians, real availability, transparent fees, and software doctors actually love.
            </p>

            {/* Interactive Search Card */}
            <Link href="/services" className="search-card-custom d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="search-icon-wrapper-custom">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10.5" cy="10.5" r="6.5" stroke="#3b82f6" strokeWidth="2.5" fill="rgba(59, 130, 246, 0.1)"/>
                    <path d="M15.5 15.5L20.5 20.5" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h6 className="search-card-title-custom mb-0">Find a Doctor</h6>
                  <span className="search-card-desc-custom">Find &amp; book a doctor in 60 seconds</span>
                </div>
              </div>
              <div className="arrow-right-wrapper me-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>

            {/* Patient Ratings */}
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex gap-1 star-rating-custom">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <span className="rating-text-custom">
                4.8 from patients &middot; Free to search &middot; No phone-tag
              </span>
            </div>
          </div>

          {/* Right Image Mockup Column */}
          <div className="col-lg-6">
            <div className="hero-right-card">
              <div className="hero-image-wrapper-custom">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImg.src}
                  alt="eClinicPro Clinical Dashboard Mockup"
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
              </div>

              {/* Trust Icons Row directly below the image inside the card */}
              <div className="hero-trust-row d-flex flex-wrap justify-content-center justify-content-md-between align-items-center gap-3 px-2">
                <div className="hero-trust-item d-flex align-items-center gap-2">
                  <FiShield className="hero-trust-icon" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="hero-trust-item d-flex align-items-center gap-2">
                  <FiCloud className="hero-trust-icon" />
                  <span>Secure Cloud Storage</span>
                </div>
                <div className="hero-trust-item d-flex align-items-center gap-2">
                  <FiActivity className="hero-trust-icon" />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
