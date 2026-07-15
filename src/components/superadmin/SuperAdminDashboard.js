'use client';

export default function SuperAdminDashboard() {
  const stats = [
    { label: 'Registered Clinics', count: '12', icon: '🏥', theme: 'indigo' },
    { label: 'Total Specialties', count: '10', icon: '🩺', theme: 'purple' },
    { label: 'Global Services', count: '8', icon: '⚙️', theme: 'blue' },
    { label: 'Platform Users', count: '148', icon: '👥', theme: 'emerald' },
  ];

  const recentClinics = [
    { name: 'Metro Health Care', email: 'info@metrohealth.com', phone: '9876543210', date: '2026-07-14', status: 'Active' },
    { name: 'City Dental Clinic', email: 'dental@cityclinic.com', phone: '9876543211', date: '2026-07-12', status: 'Active' },
    { name: 'Apex Cardiology Care', email: 'apex@cardio.com', phone: '9876543212', date: '2026-07-09', status: 'Active' },
    { name: 'LifeLine General Hospital', email: 'lifeline@hospital.com', phone: '9876543213', date: '2026-07-05', status: 'Inactive' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">System Dashboard</h1>
          <p className="admin-subtitle">Welcome back, Super Administrator. Here is your system health report.</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="admin-stats-grid">
        {stats.map((s, idx) => (
          <div key={idx} className="admin-stat-card">
            <div>
              <p className="admin-stat-number">{s.count}</p>
              <p className="admin-stat-label">{s.label}</p>
            </div>
            <div className={`admin-stat-icon-wrap ${s.theme}`}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Clinics Table */}
      <h3 style={{ margin: '30px 0 16px 0', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
        Recent Clinic Registrations
      </h3>
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Clinic Name</th>
                <th>Contact Info</th>
                <th>Registered Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentClinics.map((c, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="clinic-avatar">🏥</span>
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{c.email}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{c.phone}</div>
                  </td>
                  <td>{c.date}</td>
                  <td>
                    <span className={`admin-badge ${c.status === 'Active' ? 'active' : 'inactive'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
