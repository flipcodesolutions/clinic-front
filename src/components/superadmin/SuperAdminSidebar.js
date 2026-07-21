'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/super-admin-panel/dashboard' },
  { id: 'cities', label: 'Cities', href: '/super-admin-panel/cities' },
  { id: 'departments', label: 'Departments', href: '/super-admin-panel/departments' },
  { id: 'services', label: 'Global Services', href: '/super-admin-panel/services' },
  { id: 'clinics', label: 'Clinics Directory', href: '/super-admin-panel/clinics' },
];

export default function SuperAdminSidebar({ onLogout }) {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-deco-top"></div>
      <div className="admin-sidebar-deco-bottom"></div>

      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">Super Admin</h2>
      </div>

      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`admin-sidebar-link ${isActive(item.href) ? 'active' : ''}`}
          >
            <span>{item.label}</span>
          </Link>
        ))}

        <button
          onClick={onLogout}
          className="admin-sidebar-link"
          style={{
            marginTop: 'auto',
            color: '#fca5a5',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            justifyContent: 'center',
          }}
        >
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
