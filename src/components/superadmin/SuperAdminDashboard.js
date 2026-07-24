'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCities } from '@/services/cityService';
import { getClinics } from '@/services/clinicService';
import { getDepartments } from '@/services/departmentService';
import { getServices } from '@/services/serviceService';
import { getUsers } from '@/services/userService';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    clinics: 0,
    departments: 0,
    services: 0,
    cities: 0,
    users: 0,
  });
  const [recentClinics, setRecentClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [clinicsData, deptsData, servicesData, citiesData, usersData] = await Promise.allSettled([
          getClinics({ limit: 10 }),
          getDepartments({ limit: 1 }),
          getServices({ limit: 1 }),
          getCities({ limit: 1 }),
          getUsers({ limit: 1 }),
        ]);

        const clinicsRes = clinicsData.status === 'fulfilled' ? clinicsData.value : null;
        const deptsRes = deptsData.status === 'fulfilled' ? deptsData.value : null;
        const servicesRes = servicesData.status === 'fulfilled' ? servicesData.value : null;
        const citiesRes = citiesData.status === 'fulfilled' ? citiesData.value : null;
        const usersRes = usersData.status === 'fulfilled' ? usersData.value : null;

        const clinicsList = Array.isArray(clinicsRes?.data)
          ? clinicsRes.data
          : Array.isArray(clinicsRes)
          ? clinicsRes
          : [];

        setStats({
          clinics: clinicsRes?.count ?? clinicsList.length,
          departments: deptsRes?.count ?? (Array.isArray(deptsRes?.data) ? deptsRes.data.length : 0),
          services: servicesRes?.count ?? (Array.isArray(servicesRes?.data) ? servicesRes.data.length : 0),
          cities: citiesRes?.count ?? (Array.isArray(citiesRes?.data) ? citiesRes.data.length : 0),
          users: usersRes?.stats?.total ?? usersRes?.count ?? 0,
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
    { label: 'Registered Clinics', count: stats.clinics, icon: '🏥', theme: 'indigo', href: '/super-admin-panel/clinics' },
    { label: 'Total Specialties', count: stats.departments, icon: '🩺', theme: 'purple', href: '/super-admin-panel/departments' },
    { label: 'Global Services', count: stats.services, icon: '⚙️', theme: 'blue', href: '/super-admin-panel/services' },
    { label: 'Active Cities', count: stats.cities, icon: '🏙️', theme: 'emerald', href: '/super-admin-panel/cities' },
    { label: 'System Users', count: stats.users, icon: '👥', theme: 'indigo', href: '/super-admin-panel/users' },
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
