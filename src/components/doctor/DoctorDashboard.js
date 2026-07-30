'use client';
import { useEffect, useState } from 'react';
import { getDoctorAppointments, updateAppointmentStatus, getDoctorProfile } from '@/services/doctor/doctorService';

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, appRes] = await Promise.allSettled([
        getDoctorProfile(),
        getDoctorAppointments(),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value?.success) {
        setProfile(profRes.value.data);
      }

      if (appRes.status === 'fulfilled' && appRes.value?.success) {
        const list = appRes.value.data || [];
        setAppointments(list);

        const todayStr = new Date().toISOString().split('T')[0];
        const todayCount = list.filter(a => a.appointment_date === todayStr).length;
        const pendingCount = list.filter(a => a.status === 'booked' || a.status === 'pending').length;
        const completedCount = list.filter(a => a.status === 'completed').length;

        setStats({
          todayAppointments: todayCount,
          totalAppointments: list.length,
          pendingAppointments: pendingCount,
          completedAppointments: completedCount,
        });
      }
    } catch (error) {
      console.error('Error fetching doctor dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const res = await updateAppointmentStatus(appointmentId, newStatus);
      if (res?.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const doctorName = profile?.user
    ? `Dr. ${profile.user.first_name || ''} ${profile.user.last_name || ''}`.trim()
    : 'Doctor';

  const statsCards = [
    {
      label: "Today's Appointments",
      count: stats.todayAppointments,
      icon: '📅',
      theme: 'teal',
    },
    {
      label: 'Pending Requests',
      count: stats.pendingAppointments,
      icon: '⏳',
      theme: 'amber',
    },
    {
      label: 'Completed Consultations',
      count: stats.completedAppointments,
      icon: '✅',
      theme: 'emerald',
    },
    {
      label: 'Total Appointments',
      count: stats.totalAppointments,
      icon: '📊',
      theme: 'indigo',
    },
  ];

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Welcome back, {doctorName} 👋</h1>
          <p className="admin-subtitle">
            {profile?.specialization || 'General Practice'} • Qualification: {profile?.qualification || 'MBBS'} • Experience: {profile?.experience_years || '0'} Yrs
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="admin-stats-grid">
        {statsCards.map((s, idx) => (
          <div key={idx} className="admin-stat-card">
            <div>
              <p className="admin-stat-number">{loading ? '...' : s.count}</p>
              <p className="admin-stat-label">{s.label}</p>
            </div>
            <div className={`admin-stat-icon-wrap ${s.theme}`}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Appointments Table */}
      <h3 style={{ margin: '30px 0 16px 0', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
        Recent Appointments
      </h3>

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Appointment No</th>
                <th>Patient Details</th>
                <th>Date & Time</th>
                <th>Visit Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No appointments found yet.
                  </td>
                </tr>
              ) : (
                appointments.slice(0, 8).map((apt) => {
                  const patientName = apt.patient?.user
                    ? `${apt.patient.user.first_name || ''} ${apt.patient.user.last_name || ''}`.trim()
                    : 'Patient';

                  const statusClass = apt.status ? apt.status.toLowerCase() : 'pending';

                  return (
                    <tr key={apt.id}>
                      <td style={{ fontWeight: 600, color: '#0d9488' }}>
                        #{apt.appointment_number || apt.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{patientName}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {apt.patient?.gender ? `Gender: ${apt.patient.gender}` : ''}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 500 }}>
                          {apt.appointment_date}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{apt.start_time}</div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {apt.visit_type || 'Consultation'}
                      </td>
                      <td>
                        <span className={`admin-badge ${statusClass}`}>{apt.status}</span>
                      </td>
                      <td>
                        {apt.status === 'booked' || apt.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'confirmed')}
                              className="admin-action-btn-edit"
                              style={{ color: '#059669', borderColor: '#a7f3d0' }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'cancelled')}
                              className="admin-action-btn-delete"
                            >
                              Reject
                            </button>
                          </div>
                        ) : apt.status === 'confirmed' ? (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'completed')}
                            className="admin-action-btn-view"
                            style={{ color: '#0d9488', borderColor: '#99f6e4' }}
                          >
                            Mark Complete
                          </button>
                        ) : (
                          <span style={{ fontSize: 13, color: '#94a3b8' }}>No action required</span>
                        )}
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
