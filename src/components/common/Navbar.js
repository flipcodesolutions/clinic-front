"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPlus } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path
      ? "fw-bold text-success"
      : "text-secondary";

  const navLinks = [
    { href: "/finddoctor", label: "Find a doctor" },
    { href: "/cervical-cancer", label: "Cervical Cancer" },
    { href: "/for-doctors", label: "For doctors" },
    { href: "/specialties", label: "Specialties" },
    { href: "/security", label: "Security" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 z-3">
      <div className="container">

        {/* Logo */}
        <Link
          href="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold navbar-brand-custom"
        >
          <div className="logo-container-custom bg-dark text-white rounded d-flex align-items-center justify-content-center position-relative">
            <FaPlus className="text-success fs-6" />
            <div className="logo-dot-custom" />
          </div>

          <span className="logo-text-custom ms-1">
            <span className="text-brand-green">Medi </span>
            <span className="text-brand-dark">Growth</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
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

        {/* Navbar */}
        <div className="collapse navbar-collapse" id="eClinicNavbar">

          <ul className="navbar-nav mx-auto gap-4 mb-2 mb-lg-0 nav-menu-custom">
            {navLinks.map(({ href, label }) => (
              <li className="nav-item" key={href}>
                <Link
                  href={href}
                  className={`nav-link hover-link ${isActive(href)}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Login Button */}
          <div className="d-flex align-items-center">
            <Link
              href="/login"
              className="btn btn-brand-green text-white rounded-pill px-4 py-2 fw-semibold"
            >
              Login / Sign In
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}