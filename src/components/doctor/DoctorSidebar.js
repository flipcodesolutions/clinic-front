'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/doctor-panel/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'My Profile',
    href: '/doctor-panel/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
  {
    id: 'experiences',
    label: 'Experiences',
    href: '/doctor-panel/experiences',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
  },
  {
    id: 'achievements',
    label: 'Achievements',
    href: '/doctor-panel/achievements',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
      </svg>
    ),
  },
];

export default function DoctorSidebar({ onLogout, isOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-brand-wrap" title="Doctor Panel">
          <div className="admin-sidebar-logo-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h2 className="admin-sidebar-title">Doctor Panel</h2>
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
            onClick={() => {
              if (onClose) onClose();
            }}
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
