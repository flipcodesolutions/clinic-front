'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from './DoctorSidebar';
import { clearUserSession, getUserAuth } from '@/utils/auth';

export default function DoctorPanelLayout({ doctorProfile, children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Doctor');
  const [userInitial, setUserInitial] = useState('D');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      const user = getUserAuth();
      if (user?.first_name || user?.last_name) {
        const full = `Dr. ${user.first_name || ''} ${user.last_name || ''}`.trim();
        setDoctorName(full);
        setUserInitial((user.first_name || user.email || 'D').charAt(0).toUpperCase());
      } else if (user?.name) {
        setDoctorName(user.name.startsWith('Dr.') ? user.name : `Dr. ${user.name}`);
        setUserInitial(user.name.charAt(0).toUpperCase());
      } else if (user?.email) {
        setUserInitial(user.email.charAt(0).toUpperCase());
      }

      if (user?.profile_photo || user?.profilePhoto) {
        setProfilePhoto(user.profile_photo || user.profilePhoto);
      }
    });

    if (doctorProfile?.user) {
      const u = doctorProfile.user;
      if (u.first_name || u.last_name) {
        setDoctorName(`Dr. ${u.first_name || ''} ${u.last_name || ''}`.trim());
      }
      if (u.profile_photo) {
        setProfilePhoto(u.profile_photo);
      }
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
  }, [doctorProfile]);

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
      <DoctorSidebar
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
            {/* Doctor Profile Badge */}
            <div className="admin-user-profile-badge">
              <div className="admin-avatar-circle">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Doctor Avatar" />
                ) : (
                  userInitial
                )}
              </div>
              <span className="admin-user-name">{doctorName}</span>
              <span className="admin-user-role-tag">Doctor</span>
            </div>

            {/* Outlined Logout Button */}
            <button
              onClick={handleLogout}
              className="admin-top-logout-btn"
              title="Logout from Doctor Panel"
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
