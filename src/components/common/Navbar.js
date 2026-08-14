"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaPlus, FaUser } from "react-icons/fa";
import { getUserAuth, clearUserAuth } from "@/utils/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const authUser = getUserAuth();
    setUser(authUser);
  }, [pathname]);

  const handleLogout = () => {
    clearUserAuth();
    setUser(null);
    setShowMenu(false);
    router.push('/login');
  };

  const isActive = (path) =>
    pathname === path
      ? "fw-bold text-success border-bottom border-success border-2 pb-1"
      : "text-secondary";

  const navLinks = [
    { href: "/finddoctor", label: "Find a doctor" },
    { href: "/cervical-cancer", label: "Cervical Cancer" },
    { href: "/for-doctors", label: "For doctors" },
    { href: "/specialties", label: "Specialties" },
    { href: "/security", label: "Security" },
  ];

  const getInitial = () => {
    if (user?.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.first_name) return user.first_name;
    if (user?.name) return user.name.split(' ')[0];
    return 'User';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 z-3" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container">

        {/* Logo*/}
        <Link
          href="/"
          className="navbar-brand d-flex align-items-center gap-2 fw-bold navbar-brand-custom text-decoration-none"
        >
          <div
            className="rounded d-flex align-items-center justify-content-center text-white"
            style={{ width: 34, height: 34, background: '#00a676' }}
          >
            <FaPlus className="text-white fs-6" />
          </div>

          <span className="fs-4 fw-extrabold tracking-tight">
            <span style={{ color: '#00a676' }}>eClinic</span>
            <span style={{ color: '#0f172a' }}>Pro</span>
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

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="eClinicNavbar">
          <ul className="navbar-nav mx-auto gap-4 mb-2 mb-lg-0 nav-menu-custom">
            {navLinks.map(({ href, label }) => (
              <li className="nav-item" key={href}>
                <Link
                  href={href}
                  className={`nav-link hover-link fw-semibold ${isActive(href)}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Auth & Panel Action Section (eClinicPro Header Buttons) */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="position-relative">
                <button
                  type="button"
                  className="btn bg-light rounded-pill px-3 py-1-5 border d-flex align-items-center gap-2 shadow-2xs"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <div
                    className="text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 34, height: 34, fontSize: 14, background: '#00a676' }}
                  >
                    {getInitial()}
                  </div>
                  <span className="fw-semibold text-dark fs-6 ms-1">
                    Hi, {getDisplayName()}
                  </span>
                  <span className="small text-muted ms-1">▼</span>
                </button>

                {showMenu && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-2 z-3"
                    style={{ minWidth: 200 }}
                  >
                    <Link
                      href="/finddoctor"
                      className="dropdown-item py-2 px-3 fw-semibold text-dark rounded d-block text-decoration-none"
                      onClick={() => setShowMenu(false)}
                    >
                      Find a doctor
                    </Link>
                    <hr className="my-1 text-muted" />
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
              <div className="d-flex align-items-center gap-2">
                <Link
                  href="/login"
                  className="btn btn-outline-success rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{ color: '#00a676', borderColor: '#00a676', fontSize: 14 }}
                >
                  <FaUser size={13} /> Sign In
                </Link>

                <Link
                  href="/doctor-panel/dashboard"
                  className="btn text-white rounded-pill px-3 py-2 fw-semibold"
                  style={{ background: '#00a676', borderColor: '#00a676', fontSize: 14 }}
                >
                  Doctor panel
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}