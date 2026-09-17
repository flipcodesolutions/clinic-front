"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUserAuth, clearUserSession } from "@/utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const authUser = getUserAuth();
    setUser(authUser);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".nav-user-dropdown-container")) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  const handleLogout = () => {
    clearUserSession();
    setUser(null);
    setShowMenu(false);
    router.push("/");
  };

  const isActive = (path) => {
    if (path === "/finddoctor" && (pathname === "/finddoctor" || pathname.startsWith("/finddoctor/"))) {
      return true;
    }
    return pathname === path;
  };

  const navLinks = [
    { href: "/finddoctor", label: "Find a doctor" },
    { href: "/cervical-cancer", label: "Cervical Cancer" },
    { href: "/for-doctors", label: "For doctors", hasDropdown: true },
    { href: "/specialties", label: "Specialties" },
    { href: "/security", label: "Security" },
  ];

  const getInitial = () => {
    if (!user) return "M";
    const name = user.first_name || user.name || "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return "User";
    const name = user.first_name || user.name?.split(" ")[0] || "User";
    return name.toLowerCase();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-2" style={{ zIndex: 1040 }}>
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="navbar-brand d-inline-flex align-items-center flex-row gap-2 me-4 text-decoration-none"
          style={{ whiteSpace: "nowrap" }}
        >
          <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "34px", height: "34px" }}>
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="32" height="32" rx="8" fill="#0d4a3e" />
              <path d="M18 9V27M9 18H27" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M7 27C12 32 24 32 29 27C31 24 30 19 28 17" stroke="#00d084" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M29 9C24 4 12 4 7 9C5 12 6 17 8 19" stroke="#00d084" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: "23px", fontWeight: 800, color: "#00a676", letterSpacing: "-0.4px", lineHeight: 1 }}>
            eClinicPro
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

        {/* Navbar Links & Right Actions */}
        <div className="collapse navbar-collapse" id="eClinicNavbar">
          <ul className="navbar-nav mx-auto gap-4 mb-2 mb-lg-0 align-items-lg-center">
            {navLinks.map(({ href, label, hasDropdown }) => (
              <li className="nav-item" key={href}>
                <Link
                  href={href}
                  className="nav-link fw-semibold px-0 position-relative text-decoration-none"
                  style={{
                    color: isActive(href) ? "#00a676" : "#1e293b",
                    fontSize: "14.5px",
                    borderBottom: isActive(href) ? "2px solid #00a676" : "2px solid transparent",
                    paddingBottom: "4px",
                  }}
                >
                  <span>{label}</span>
                  {hasDropdown && <span style={{ fontSize: "10px", marginLeft: "3px" }}>▾</span>}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-2 ms-lg-auto mt-2 mt-lg-0">
            {user ? (
              <div className="position-relative nav-user-dropdown-container">
                <button
                  type="button"
                  className="btn bg-white rounded-pill px-3 py-1 border d-flex align-items-center gap-2 shadow-xs"
                  style={{ borderColor: "#0f172a" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  aria-expanded={showMenu}
                >
                  <span
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "#00a676",
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {getInitial()}
                  </span>
                  <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                    Hi, {getDisplayName()}
                  </span>
                  <span className="small text-muted ms-1" style={{ fontSize: "11px" }}>
                    {showMenu ? "⌃" : "▾"}
                  </span>
                </button>

                {showMenu && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-2 z-3"
                    style={{ minWidth: "165px", borderRadius: "12px" }}
                  >
                    <Link
                      href="/patient"
                      className="dropdown-item py-2 px-3 fw-semibold text-dark rounded text-decoration-none d-block"
                      onClick={() => setShowMenu(false)}
                    >
                      My Health
                    </Link>
                    <Link
                      href="/finddoctor"
                      className="dropdown-item py-2 px-3 fw-semibold text-dark rounded text-decoration-none d-block"
                      onClick={() => setShowMenu(false)}
                    >
                      Find a doctor
                    </Link>
                    <button
                      type="button"
                      className="dropdown-item py-2 px-3 fw-semibold text-danger rounded w-100 text-start border-0 bg-transparent"
                      onClick={handleLogout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-outline-success rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center text-decoration-none"
                style={{ color: "#00a676", borderColor: "#00a676", fontSize: "14px" }}
              >
                Sign In
              </Link>
            )}

            {/* Doctor Panel Button  */}
            <Link
              href="/doctor-panel/appointments"
              className="btn text-white rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center text-decoration-none"
              style={{ backgroundColor: "#00a676", border: "none", fontSize: "14px", whiteSpace: "nowrap" }}
            >
              Doctor panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}