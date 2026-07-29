'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/patient-panel/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    id: 'appointments',
    label: 'My Appointments',
    href: '/patient-panel/appointments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
  },
  {
    id: 'doctors',
    label: 'Find Doctors',
    href: '/patient-panel/doctors',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    id: 'clinics',
    label: 'Search Clinics',
    href: '/patient-panel/clinics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <circle cx="12" cy="11" r="2.5"></circle>
        <path d="M8 17.5v-.5a4 4 0 0 1 8 0v.5"></path>
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'My Profile',
    href: '/patient-panel/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
];

export default function PatientSidebar({ onLogout, isOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-deco-top"></div>
      <div className="admin-sidebar-deco-bottom"></div>

      <div className="admin-sidebar-header">
        <div className="admin-sidebar-brand-wrap" title="Patient Portal">
          <div className="admin-sidebar-logo-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"></path>
            </svg>
          </div>
          <h2 className="admin-sidebar-title">
            <span className="admin-sidebar-title-text">Patient Portal</span>
          </h2>
        </div>
        <button
          className="admin-sidebar-close-btn"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          ✕
        </button>
      </div>

      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            title={item.label}
            onClick={() => onClose && onClose()}
            className={`admin-sidebar-link ${isActive(item.href) ? 'active' : ''}`}
          >
            <span className="admin-menu-icon">{item.icon}</span>
            <span className="admin-menu-label">{item.label}</span>
          </Link>
        ))}

      </nav>
    </aside>
  );
}
