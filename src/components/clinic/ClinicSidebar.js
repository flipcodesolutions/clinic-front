'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/clinic-panel/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    id: 'doctors',
    label: 'Doctor Management',
    href: '/clinic-panel/doctors',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="17" y1="11" x2="23" y2="11"></line>
      </svg>
    ),
  },
  {
    id: 'staff',
    label: 'Staff Management',
    href: '/clinic-panel/staff',
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
    id: 'gallery',
    label: 'Clinic Gallery',
    href: '/clinic-panel/gallery',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    ),
  },
  {
    id: 'departments',
    label: 'Departments',
    href: '/clinic-panel/departments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <line x1="9" y1="6" x2="15" y2="6"></line>
        <line x1="9" y1="10" x2="15" y2="10"></line>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Clinic Services',
    href: '/clinic-panel/services',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    ),
  },
];

export default function ClinicSidebar({ onLogout, isOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <aside className={`clinic-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="clinic-sidebar-deco-top"></div>

      <div className="clinic-sidebar-header">
        <Link href="/clinic-panel/dashboard" className="clinic-sidebar-brand-wrap" title="Clinic Admin">
          <div className="clinic-sidebar-logo-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6v12M6 12h12"></path>
            </svg>
          </div>
          <div className="clinic-sidebar-title">
            <span className="clinic-sidebar-title-text">Clinic Admin</span>
            <span className="clinic-sidebar-subtitle-text">Medi Growth</span>
          </div>
        </Link>
        <button
          className="clinic-sidebar-close-btn"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          ✕
        </button>
      </div>

      <nav className="clinic-sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            title={item.label}
            onClick={() => onClose && onClose()}
            className={`clinic-sidebar-link ${isActive(item.href) ? 'active' : ''}`}
          >
            <span className="clinic-menu-icon">{item.icon}</span>
            <span className="clinic-menu-label">{item.label}</span>
          </Link>
        ))}

      </nav>
    </aside>
  );
}
