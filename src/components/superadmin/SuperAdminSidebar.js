'use client';

export default function SuperAdminSidebar({ activeTab, onTabChange, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'clinics', label: 'Clinics Directory' },
    { id: 'departments', label: 'Departments' },
    { id: 'services', label: 'Global Services' },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Decorative circles */}
      <div className="admin-sidebar-deco-top"></div>
      <div className="admin-sidebar-deco-bottom"></div>

      {/* Header */}
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">Super Admin</h2>
      </div>

      {/* Menu Navigation */}
      <nav className="admin-sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`admin-sidebar-link ${activeTab === item.id ? 'active' : ''}`}
          >
            <span>{item.label}</span>
          </button>
        ))}

        {/* Sign Out Link at the bottom of navigation */}
        <button
          onClick={onLogout}
          className="admin-sidebar-link"
          style={{ 
            marginTop: 'auto', 
            color: '#fca5a5', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.15)',
            justifyContent: 'center'
          }}
        >
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

