'use client';

const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'profile', label: 'Profile' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'achievements', label: 'Achievements' },
];

export default function DoctorSidebar({ activeTab, onTabChange, onLogout }) {
  return (
    <aside className="doctor-sidebar">
      <div className="doctor-sidebar-deco-top" />
      <div className="doctor-sidebar-deco-bottom" />

      {/* Header */}
      <div className="doctor-sidebar-header">
        <div className="doctor-sidebar-logo-text">
          <span className="doctor-sidebar-title">Doctor Panel</span>
          <span className="doctor-sidebar-subtitle">Management</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="doctor-sidebar-nav">
        <div className="doctor-sidebar-nav-label">Menu</div>
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`doctor-nav-link border-0 text-start w-100 bg-transparent${isActive ? ' active' : ''}`}
            >
              <span>{item.label}</span>
              {isActive && <span className="doctor-nav-link-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="doctor-sidebar-footer">
        <button className="doctor-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

