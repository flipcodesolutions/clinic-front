'use client';

const stats = [
  { label: "Today's Patients", value: '18', icon: '🏥', change: '+3 vs yesterday', colorClass: 'blue' },
  { label: 'Total Appointments', value: '1,240', icon: '📅', change: '+24 this month', colorClass: 'teal' },
  { label: 'Avg Rating', value: '4.9', icon: '⭐', change: 'Based on 340 reviews', colorClass: 'amber' },
  { label: 'Experience', value: '12 yrs', icon: '🏆', change: 'Since 2012', colorClass: 'green' },
];

const appointments = [
  { name: 'Amit Shah', time: '09:00 AM', type: 'Consultation', status: 'Confirmed' },
  { name: 'Priya Joshi', time: '09:30 AM', type: 'Follow-up', status: 'Confirmed' },
  { name: 'Kiran Patel', time: '10:15 AM', type: 'Consultation', status: 'Pending' },
  { name: 'Ravi Kumar', time: '11:00 AM', type: 'Check-up', status: 'Cancelled' },
  { name: 'Anita Verma', time: '11:30 AM', type: 'Consultation', status: 'Confirmed' },
];

export default function DoctorDashboard() {
  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <div className="doc-page-header">
        <h1 className="doc-page-title">Good Morning, Dr. Priya Sharma 👋</h1>
        <p className="doc-page-subtitle">Dentist • Apollo Healthcare Clinic • Mumbai</p>
      </div>

      {/* Stats */}
      <div className="doc-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="doc-stat-card">
            <div className="doc-stat-card-top">
              <div className={`doc-stat-icon ${stat.colorClass}`}>{stat.icon}</div>
              <div className="doc-stat-badge">{stat.change}</div>
            </div>
            <div className="doc-stat-value">{stat.value}</div>
            <div className="doc-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="doc-table-card">
        <div className="doc-table-card-header">
          <div>
            <h2 className="doc-table-card-title">Today's Appointments</h2>
            <p className="doc-table-card-subtitle">{new Date().toDateString()}</p>
          </div>
          <span className="doc-count-badge">{appointments.length} total</span>
        </div>
        <div className="doc-table-wrap">
          <table className="doc-table">
            <thead>
              <tr>
                {['Patient', 'Time', 'Type', 'Status'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, i) => (
                <tr key={i}>
                  <td>
                    <div className="doc-patient-cell">
                      <div className="doc-avatar">{apt.name[0]}</div>
                      <span className="doc-patient-name">{apt.name}</span>
                    </div>
                  </td>
                  <td className="doc-slot-text">{apt.time}</td>
                  <td>{apt.type}</td>
                  <td>
                    <span className={`doc-status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
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
