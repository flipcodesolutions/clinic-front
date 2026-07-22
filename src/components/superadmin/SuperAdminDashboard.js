'use client';
import { useEffect, useState } from 'react';
import { getCities } from '@/services/cityService';
import { getClinics } from '@/services/clinicService';
import { getDepartments } from '@/services/departmentService';
import { getServices } from '@/services/serviceService';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    clinics: 0,
    departments: 0,
    services: 0,
    cities: 0,
  });
  const [recentClinics, setRecentClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [clinicsData, deptsData, servicesData, citiesData] = await Promise.allSettled([
          getClinics(),
          getDepartments(),
          getServices(),
          getCities(),
        ]);

        const clinicsList = clinicsData.status === 'fulfilled' ? clinicsData.value || [] : [];
        const deptsList = deptsData.status === 'fulfilled' ? deptsData.value || [] : [];
        const servicesList = servicesData.status === 'fulfilled' ? servicesData.value || [] : [];
        const citiesList = citiesData.status === 'fulfilled' ? citiesData.value || [] : [];

        setStats({
          clinics: clinicsList.length,
          departments: deptsList.length,
          services: servicesList.length,
          cities: citiesList.length,
        });

        // Top 5 recent clinics
        setRecentClinics(clinicsList.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: 'Registered Clinics', count: stats.clinics, icon: '🏥', theme: 'indigo' },
    { label: 'Total Specialties', count: stats.departments, icon: '🩺', theme: 'purple' },
    { label: 'Global Services', count: stats.services, icon: '⚙️', theme: 'blue' },
    { label: 'Active Cities', count: stats.cities, icon: '🏙️', theme: 'emerald' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">System Dashboard</h1>
          <p className="admin-subtitle">Welcome back, Super Administrator. Here is your live system health report.</p>
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
                <th>City / Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading recent clinics...
                  </td>
                </tr>
              ) : recentClinics.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No registered clinics found.
                  </td>
                </tr>
              ) : (
                recentClinics.map((c) => {
                  const statusFormatted = c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1).toLowerCase() : 'Inactive';

                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span className="clinic-avatar">🏥</span>
                          <div>
                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>ID: CLN-{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{c.email || '—'}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{c.phone || '—'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: '#475569' }}>
                          {[c.city, c.state].filter(Boolean).join(', ') || c.address || '—'}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge ${statusFormatted === 'Active' ? 'active' : 'inactive'}`}>
                          {statusFormatted}
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
