"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPlus } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? "fw-bold text-success" : "text-secondary";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom sticky-top z-3">
      <div className="container">
        {/* eClinicPro Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold navbar-brand-custom">
          <div className="d-flex align-items-center justify-content-center bg-dark text-white rounded logo-container-custom">
            <FaPlus className="fs-6 text-success" />
            <div className="position-absolute logo-dot-custom"></div>
          </div>
          <span className="logo-text-custom ms-1">
            <span className="text-brand-green">Medi </span>
            <span className="text-brand-dark">Growth</span>
          </span>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#eClinicNavbar"
          aria-controls="eClinicNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="eClinicNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-4 nav-menu-custom">
            <li className="nav-item">
              <Link href="/finddoctor" className={`nav-link hover-link ${isActive("/finddoctor")}`}>
                Find a doctor
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/cervical-cancer" className={`nav-link hover-link ${isActive("/cervical-cancer")}`}>
                Cervical Cancer
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/for-doctors" className={`nav-link hover-link ${isActive("/for-doctors")}`}>
                For doctors
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/specialties" className={`nav-link hover-link ${isActive("/specialties")}`}>
                Specialties
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/security" className={`nav-link hover-link ${isActive("/security")}`}>
                Security
              </Link>
            </li>
          </ul>

          {/* Right Side Buttons */}
          <div className="d-flex align-items-center gap-3">
            <Link href="/admin/login" className="text-decoration-none text-secondary fw-semibold hover-link btn-signin-custom">
              Sign in
            </Link>
            <Link
              href="/admin/dashboard"
              className="btn text-white rounded-pill px-4 py-2 fw-semibold btn-brand-green"
            >
              Doctor panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
