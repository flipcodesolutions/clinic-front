'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PatientSidebar from './PatientSidebar';
import { clearUserSession, getUserAuth } from '@/utils/auth';

export default function PatientPanelLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('Patient');
  const [userInitial, setUserInitial] = useState('P');

  useEffect(() => {
    Promise.resolve().then(() => {
      const user = getUserAuth();
      if (user?.name) {
        setUserName(user.name);
        setUserInitial(user.name.charAt(0).toUpperCase());
      } else if (user?.email) {
        setUserInitial(user.email.charAt(0).toUpperCase());
      }
    });

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
      className={`admin-panel-layout ${
        sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'
      }`}
    >
      {/* Sidebar */}
      <PatientSidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Backdrop overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Content Area with Top Header Navbar */}
      <div className="admin-content-wrapper">
        {/* Top Navbar Header */}
        <header className="admin-top-navbar">
          <div className="admin-top-navbar-left">
            <button
              className="admin-header-toggle-btn"
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

          <div className="admin-top-navbar-right">
            {/* User Profile Badge */}
            <div className="admin-user-profile-badge">
              <span className="admin-avatar-circle">{userInitial}</span>
              <span className="admin-user-name">{userName}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="admin-user-chevron"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* Outlined Logout Button */}
            <button
              onClick={handleLogout}
              className="admin-top-logout-btn"
              title="Logout from Patient Portal"
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
        <main className="admin-panel-main">{children}</main>
      </div>
    </div>
  );
}
