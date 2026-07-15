'use client';
import Link from 'next/link';

const stats = [
  { label: 'Total Doctors', value: '12', icon: '👨‍⚕️', change: '+2 this month', colorClass: 'purple' },
  { label: 'Staff Members', value: '28', icon: '👥', change: '+5 this month', colorClass: 'pink' },
  { label: 'Appointments', value: '340', icon: '📅', change: '+18 today', colorClass: 'amber' },
  { label: 'Avg Rating', value: '4.8', icon: '⭐', change: '+0.2 this week', colorClass: 'green' },
];

const recentDoctors = [
  { name: 'Dr. Priya Sharma', speciality: 'Dentist', status: 'Active', patients: 45 },
  { name: 'Dr. Arjun Mehta', speciality: 'Cardiologist', status: 'Active', patients: 32 },
  { name: 'Dr. Neha Patel', speciality: 'Dermatologist', status: 'On Leave', patients: 28 },
  { name: 'Dr. Rahul Gupta', speciality: 'Orthopedic', status: 'Active', patients: 51 },
];

export default function ClinicDashboard() {
  return (
    <div className="clinic-dashboard">
      {/* Header */}
      <div className="clinic-page-header">
        <h1 className="clinic-page-title">Good Morning, Clinic Admin</h1>
        <p className="clinic-page-subtitle">Here's what's happening at your clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="clinic-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="clinic-stat-card">
            <div className="clinic-stat-card-top">
              <div className={`clinic-stat-icon ${stat.colorClass}`}>{stat.icon}</div>
              <div className="clinic-stat-badge">{stat.change}</div>
            </div>
            <div className="clinic-stat-value">{stat.value}</div>
            <div className="clinic-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="clinic-table-card">
        <div className="clinic-table-card-header">
          <div>
            <h2 className="clinic-table-card-title">Recent Doctors</h2>
            <p className="clinic-table-card-subtitle">Clinic's registered doctors</p>
          </div>
          <Link href="/clinic-panel/doctors" className="clinic-add-btn text-decoration-none d-inline-block">
            Manage Doctors
          </Link>
        </div>
        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                {['Doctor', 'Speciality', 'Patients', 'Status'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentDoctors.map((doc, i) => (
                <tr key={i}>
                  <td>
                    <div className="clinic-doctor-cell">
                      <div className="clinic-avatar">{doc.name.charAt(4)}</div>
                      <span className="clinic-doctor-name">{doc.name}</span>
                    </div>
                  </td>
                  <td>{doc.speciality}</td>
                  <td>{doc.patients}</td>
                  <td>
                    <span className={`clinic-status-badge ${doc.status === 'Active' ? 'active' : 'leave'}`}>
                      {doc.status}
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
