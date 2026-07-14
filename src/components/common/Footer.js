import React from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto footer-custom-bg">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Logo & Description */}
          <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center justify-content-center bg-secondary text-white rounded footer-logo-container-custom">
                <FaPlus className="fs-6 text-success" />
                <div className="position-absolute footer-logo-dot-custom"></div>
              </div>
              <span className="fw-bold fs-5 logo-text-custom">
                <span className="text-brand-green">Medi </span>
                <span className="text-white">Growth</span>
              </span>
            </div>
            <p className="text-secondary small pe-lg-4 footer-desc-custom">
              Book a verified doctor, or run your whole clinic — one simple system. Made in India, for Indian clinics. 🌿
            </p>
          </div>

          {/* Product links */}
          <div className="col-6 col-sm-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-light mb-3 footer-section-title-custom">
              PRODUCT
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link href="/services" className="text-secondary text-decoration-none hover-link">Find a doctor</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Health Store</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Lab Tests</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Health Insurance</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">For doctors</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Product tour</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Pricing</Link></li>
            </ul>
          </div>

          {/* Specialties links */}
          <div className="col-6 col-sm-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-light mb-3 footer-section-title-custom">
              SPECIALTIES
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">General practice</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Dentistry</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Homeopathy</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Dermatology</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Pediatrics</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Physiotherapy</Link></li>
            </ul>
          </div>

          {/* Trust links */}
          <div className="col-6 col-sm-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-light mb-3 footer-section-title-custom">
              TRUST
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Security</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Customer stories</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">HIPAA / GDPR</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Cervical Cancer Awareness</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Find a doctor</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Book a demo</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div className="col-6 col-sm-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-light mb-3 footer-section-title-custom">
              COMPANY
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Become a partner</Link></li>
              <li><Link href="/about" className="text-secondary text-decoration-none hover-link">About</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Careers</Link></li>
              <li><Link href="#" className="text-secondary text-decoration-none hover-link">Press kit</Link></li>
              <li><Link href="/contact" className="text-secondary text-decoration-none hover-link">Contact</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary opacity-25 mb-4" />

        {/* Bottom Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small text-secondary">
          <p className="mb-0 text-center text-md-start">
            &copy; {new Date().getFullYear()} Medi Growth &mdash; a brand of Silver Webbuzz Pvt Ltd &middot; Made with care for clinics across India 🌿
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link href="/privacy-policy" className="text-secondary text-decoration-none hover-link">Privacy</Link>
            <Link href="/terms" className="text-secondary text-decoration-none hover-link">Terms</Link>
            <Link href="/refund-policy" className="text-secondary text-decoration-none hover-link">Refunds</Link>
            <Link href="/privacy-policy#grievance" className="text-secondary text-decoration-none hover-link">Grievance</Link>
            <Link href="/security" className="text-secondary text-decoration-none hover-link">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
