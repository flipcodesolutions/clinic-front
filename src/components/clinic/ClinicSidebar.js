'use client';
import { useState } from 'react';

const navItems = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'doctors', icon: '👨‍⚕️', label: 'Doctors' },
  { key: 'staff', icon: '👥', label: 'Staff' },
  { key: 'gallery', icon: '🖼️', label: 'Gallery' },
  { key: 'about', icon: '🏥', label: 'About Clinic' },
];

export default function ClinicSidebar({ activeTab, onTabChange, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`clinic-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="clinic-sidebar-deco-top" />
      <div className="clinic-sidebar-deco-bottom" />

      {/* Header */}
      <div className="clinic-sidebar-header">
        <div className="clinic-sidebar-logo-icon">🏥</div>
        {!collapsed && (
          <div className="clinic-sidebar-logo-text">
            <span className="clinic-sidebar-title">Clinic Panel</span>
            <span className="clinic-sidebar-subtitle">Management</span>
          </div>
        )}
        <button className="clinic-sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="clinic-sidebar-nav">
        {!collapsed && <div className="clinic-sidebar-nav-label">Menu</div>}
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`clinic-nav-link border-0 text-start w-100 bg-transparent${isActive ? ' active' : ''}`}
            >
              <span className="clinic-nav-link-icon" style={{ fontSize: '18px' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && <span className="clinic-nav-link-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="clinic-sidebar-footer">
        <button className="clinic-logout-btn" onClick={onLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
