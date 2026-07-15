'use client';
import { useState } from 'react';

const navItems = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'profile', icon: '👤', label: 'Profile' },
  { key: 'schedule', icon: '📅', label: 'Schedule' },
  { key: 'appointments', icon: '👥', label: 'Appointments' },
  { key: 'achievements', icon: '🏆', label: 'Achievements' },
];

export default function DoctorSidebar({ activeTab, onTabChange, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`doctor-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="doctor-sidebar-deco-top" />
      <div className="doctor-sidebar-deco-bottom" />

      {/* Header */}
      <div className="doctor-sidebar-header">
        <div className="doctor-sidebar-logo-icon">👨‍⚕️</div>
        {!collapsed && (
          <div className="doctor-sidebar-logo-text">
            <span className="doctor-sidebar-title">Doctor Panel</span>
            <span className="doctor-sidebar-subtitle">Management</span>
          </div>
        )}
        <button className="doctor-sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="doctor-sidebar-nav">
        {!collapsed && <div className="doctor-sidebar-nav-label">Menu</div>}
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`doctor-nav-link border-0 text-start w-100 bg-transparent${isActive ? ' active' : ''}`}
            >
              <span className="doctor-nav-link-icon" style={{ fontSize: '18px' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && <span className="doctor-nav-link-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="doctor-sidebar-footer">
        <button className="doctor-logout-btn" onClick={onLogout}>
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
