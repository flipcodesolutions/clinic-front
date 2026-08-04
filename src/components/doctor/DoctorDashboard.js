'use client';
import { useEffect, useState, useCallback } from 'react';
import { getDoctorProfile } from '@/services/doctor/profileService';
import { getDoctorAppointments } from '@/services/doctor/appointmentService';

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

  const fetchDashboardData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
          <h1 className="admin-title">Welcome back, {doctorName} </h1>
          <p className="admin-subtitle">
            {profile?.specialization || 'General Practice'} • Qualification: {profile?.qualification || 'MBBS'} • Experience: {profile?.experience_years || '0'} Yrs
          </p>
        </div>
      </div>

      {/*  Cards Grid */}
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

      {/* Recent Appointments Table Heading */}
      <h3 className="admin-section-heading" style={{ marginTop: '24px' }}>
        Recent Appointments
      </h3>

      <div className="admin-table-card">
        <div className="admin-table-wrap fixed-height-table">
          <table className="admin-table sticky-header">
            <thead>
              <tr>
                <th>Appointment No</th>
                <th>Patient Details</th>
                <th>Date & Time</th>
                <th>Visit Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty-state">
                    No appointments found yet.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => {
                  const patientName = apt.patient?.user
                    ? `${apt.patient.user.first_name || ''} ${apt.patient.user.last_name || ''}`.trim()
                    : 'Patient';

                  const statusClass = apt.status ? apt.status.toLowerCase() : 'pending';

                  return (
                    <tr key={apt.id}>
                      <td className="admin-appt-no">
                        #{apt.appointment_number || apt.id}
                      </td>
                      <td>
                        <div className="admin-font-bold">{patientName}</div>
                        <div className="admin-sub-text">
                          {apt.patient?.gender ? `Gender: ${apt.patient.gender}` : ''}
                        </div>
                      </td>
                      <td>
                        <div className="admin-date-text">
                          {apt.appointment_date}
                        </div>
                        <div className="admin-sub-text">{apt.start_time}</div>
                      </td>
                      <td className="admin-visit-type">
                        {apt.visit_type || 'Consultation'}
                      </td>
                      <td>
                        <span className={`admin-badge ${statusClass}`}>{apt.status}</span>
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
