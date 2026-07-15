'use client';

const navItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'doctors', label: 'Doctors' },
  { key: 'staff', label: 'Staff' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'about', label: 'About Clinic' },
];

export default function ClinicSidebar({ activeTab, onTabChange, onLogout }) {
  return (
    <aside className="clinic-sidebar">
      <div className="clinic-sidebar-deco-top" />
      <div className="clinic-sidebar-deco-bottom" />

      {/* Header */}
      <div className="clinic-sidebar-header">
        <div className="clinic-sidebar-logo-text">
          <span className="clinic-sidebar-title">Clinic Panel</span>
          <span className="clinic-sidebar-subtitle">Management</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="clinic-sidebar-nav">
        <div className="clinic-sidebar-nav-label">Menu</div>
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`clinic-nav-link border-0 text-start w-100 bg-transparent${isActive ? ' active' : ''}`}
            >
              <span>{item.label}</span>
              {isActive && <span className="clinic-nav-link-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="clinic-sidebar-footer">
        <button className="clinic-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

