'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ClinicSidebar from './ClinicSidebar';
import { clearUserSession, getUserAuth } from '@/utils/auth';

export default function ClinicPanelLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('Clinic Admin');
  const [userInitial, setUserInitial] = useState('C');

  useEffect(() => {
    const user = getUserAuth();
    if (user?.name) {
      setUserName(user.name);
      setUserInitial(user.name.charAt(0).toUpperCase());
    } else if (user?.email) {
      setUserInitial(user.email.charAt(0).toUpperCase());
    }

    const checkMobile = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    clearUserSession();
    router.replace('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      className={`clinic-panel-layout ${
        sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'
      }`}
    >
      {/* Sidebar */}
      <ClinicSidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Backdrop overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="clinic-sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            zIndex: 1000,
          }}
        />
      )}

      {/* Content Area with Top Header Navbar */}
      <div className="clinic-content-wrapper">
        {/* Top Navbar Header */}
        <header className="clinic-top-navbar">
          <div className="clinic-top-navbar-left">
            <button
              className="clinic-header-toggle-btn"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="16" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="clinic-top-navbar-right">
            {/* User Profile Badge */}
            <div className="clinic-user-profile-badge">
              <span className="clinic-avatar-circle">{userInitial}</span>
              <span className="clinic-user-name">{userName}</span>
            </div>

            {/* Change Password Link */}
            <Link
              href="/clinic-panel/change-password"
              className="clinic-top-action-btn"
              title="Change Account Password"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Password</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="clinic-top-logout-btn"
              title="Logout from Clinic Admin"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="clinic-panel-main">{children}</main>
      </div>
    </div>
  );
}
