'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUserAuth } from '@/utils/auth';
import { getPatientAppointments } from '@/services/patient/appointmentService';

export default function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUser = getUserAuth();
    setUser(authUser);

    async function loadDashboardData() {
      try {
        setLoading(true);
        const res = await getPatientAppointments();
        if (res.success && Array.isArray(res.data)) {
          const appointments = res.data;
          
          const upcoming = appointments.filter(
            (a) => a.status === 'scheduled' || a.status === 'confirmed'
          ).length;

          const completed = appointments.filter(
            (a) => a.status === 'completed'
          ).length;

          setStats({
            totalAppointments: appointments.length,
            upcomingAppointments: upcoming,
            completedAppointments: completed,
          });

          setRecentAppointments(appointments.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load patient dashboard appointments:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statsCards = [
    { label: 'Total Appointments', count: stats.totalAppointments, icon: '📅', theme: 'indigo', href: '/patient-panel/appointments' },
    { label: 'Upcoming Visits', count: stats.upcomingAppointments, icon: '⏰', theme: 'emerald', href: '/patient-panel/appointments' },
    { label: 'Completed Visits', count: stats.completedAppointments, icon: '✅', theme: 'blue', href: '/patient-panel/appointments' },
  ];

  const quickActions = [
    {
      title: 'Book Appointment',
      desc: 'Find a doctor or clinic and schedule a consultation slot',
      icon: '🩺',
      href: '/patient-panel/doctors',
    },
    {
      title: 'Search Clinics',
      desc: 'Explore registered clinics, services, and photo galleries',
      icon: '🏥',
      href: '/patient-panel/clinics',
    },
    {
      title: 'My Profile',
      desc: 'Manage your personal profile and account settings',
      icon: '👤',
      href: '/patient-panel/profile',
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header Banner */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            Welcome back, {user?.name || 'Patient'}! 👋
          </h1>
          <p className="admin-subtitle">
            Manage your health journey, view appointments, and search for top clinics & doctors.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="admin-stats-grid">
        {statsCards.map((s, idx) => (
          <Link key={idx} href={s.href} className="admin-stat-card-link" aria-label={`Open ${s.label}`}>
            <div className="admin-stat-card">
              <div>
                <p className="admin-stat-number">{loading ? '...' : s.count}</p>
                <p className="admin-stat-label">{s.label}</p>
              </div>
              <div className={`admin-stat-icon-wrap ${s.theme}`}>{s.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Grid */}
      <h3 style={{ margin: '10px 0 16px 0', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
        Quick Healthcare Actions
      </h3>
      <div className="patient-action-grid">
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.href} className="patient-action-card">
            <div className="patient-action-icon">{action.icon}</div>
            <div>
              <h4 className="patient-action-title">{action.title}</h4>
              <p className="patient-action-desc">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments Table */}
      <h3 style={{ margin: '30px 0 16px 0', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
        My Recent Appointments
      </h3>
      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Appointment No</th>
                <th>Doctor / Specialty</th>
                <th>Clinic</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading appointments...
                  </td>
                </tr>
              ) : recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No recent appointments found. Book your first consultation today!
                  </td>
                </tr>
              ) : (
                recentAppointments.map((apt) => {
                  const statusClass =
                    apt.status === 'scheduled'
                      ? 'scheduled'
                      : apt.status === 'completed'
                      ? 'completed'
                      : 'cancelled';

                  return (
                    <tr key={apt.id}>
                      <td>
                        <span style={{ fontWeight: 600, color: '#0d9488' }}>
                          {apt.appointment_number || `APT-${apt.id}`}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {apt.doctor?.user ? `Dr. ${apt.doctor.user.first_name} ${apt.doctor.user.last_name}` : 'General Doctor'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {apt.department?.name || 'Consultation'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: '#475569' }}>
                          {apt.clinic?.name || 'Medi Growth Clinic'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {apt.appointment_date}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {apt.start_time}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${statusClass}`}>
                          {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Scheduled'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
