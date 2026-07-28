"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getClinicDashboardData } from "@/services/clinic/dashboardService";

export default function ClinicDashboard() {
  const [data, setData] = useState({
    stats: {
      todayAppointments: 0,
      doctorsCount: 0,
      staffCount: 0,
      departmentsCount: 0,
      servicesCount: 0,
    },
    appointments: [],
    doctors: [],
    staff: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getClinicDashboardData();
        setData(res);
      } catch (err) {
        console.error("Failed to load clinic dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statsCards = [
    {
      label: "Today's Appointments",
      count: data.stats.todayAppointments,
      icon: "📅",
      theme: "teal",
      href: "/clinic-panel/dashboard",
    },
    {
      label: "Active Doctors",
      count: data.stats.doctorsCount,
      icon: "🩺",
      theme: "cyan",
      href: "/clinic-panel/doctors",
    },
    {
      label: "Clinic Staff",
      count: data.stats.staffCount,
      icon: "👥",
      theme: "emerald",
      href: "/clinic-panel/staff",
    },
    {
      label: "Assigned Departments",
      count: data.stats.departmentsCount,
      icon: "🏢",
      theme: "blue",
      href: "/clinic-panel/departments",
    },
    {
      label: "Clinic Services",
      count: data.stats.servicesCount,
      icon: "⚙️",
      theme: "teal",
      href: "/clinic-panel/services",
    },
  ];

  return (
    <div className="clinic-dashboard">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Clinic Control Center</h1>
          <p className="clinic-subtitle">
            Manage daily operations, appointments, doctors, staff, and clinic
            facilities.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="clinic-stats-grid">
        {statsCards.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="clinic-stat-card-link"
            aria-label={`Open ${s.label}`}
          >
            <div className="clinic-stat-card">
              <div>
                <p className="clinic-stat-number">
                  {loading ? "..." : s.count}
                </p>
                <p className="clinic-stat-label">{s.label}</p>
              </div>
              <div className={`clinic-stat-icon-wrap ${s.theme}`}>{s.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Today's Appointments Section */}
      <div className="clinic-table-card">
        <div className="clinic-table-header">
          <h3 className="clinic-dashboard-section-header">
            📅 Today's Appointments
          </h3>
          <span className="clinic-dashboard-section-sub">
            {data.appointments.length} Total Bookings Today
          </span>
        </div>
        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Assigned Doctor</th>
                <th>Specialty</th>
                <th>Time Slot</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="clinic-dashboard-loading-cell">
                    Loading appointments...
                  </td>
                </tr>
              ) : data.appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="clinic-dashboard-empty-cell">
                    No appointments scheduled for today.
                  </td>
                </tr>
              ) : (
                data.appointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <span className="clinic-dashboard-patient-name">
                        {app.patient_name}
                      </span>
                    </td>
                    <td>{app.doctor_name}</td>
                    <td>
                      <span className="clinic-gallery-tag">
                        {app.specialty}
                      </span>
                    </td>
                    <td className="clinic-dashboard-time-cell">{app.time}</td>
                    <td>{app.type}</td>
                    <td>
                      <span className={`clinic-badge ${app.status}`}>
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-side Doctor List & Staff List previews */}
      <div className="clinic-dashboard-overview-grid">
        {/* Doctor List */}
        <div className="clinic-table-card clinic-dashboard-overview-card">
          <div className="clinic-table-header">
            <h4 className="clinic-dashboard-overview-title">
              🩺 Doctors Overview
            </h4>
            <Link
              href="/clinic-panel/doctors"
              className="clinic-btn clinic-btn-primary clinic-btn-sm"
            >
              Manage Doctors
            </Link>
          </div>
          <div className="clinic-table-wrap">
            <table className="clinic-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.doctors.slice(0, 4).map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="clinic-dashboard-avatar-cell">
                        <div>
                          <div className="clinic-dashboard-doc-name">
                            {doc.first_name} {doc.last_name}
                          </div>
                          <div className="clinic-dashboard-doc-qual">
                            {doc.qualification}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="clinic-dashboard-specialty-cell">
                      {doc.specialty}
                    </td>
                    <td>
                      <span className={`clinic-badge ${doc.status}`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff List */}
        <div className="clinic-table-card clinic-dashboard-overview-card">
          <div className="clinic-table-header">
            <h4 className="clinic-dashboard-overview-title">
              👥 Clinic Staff Overview
            </h4>
            <Link
              href="/clinic-panel/staff"
              className="clinic-btn clinic-btn-primary clinic-btn-sm"
            >
              Manage Staff
            </Link>
          </div>
          <div className="clinic-table-wrap">
            <table className="clinic-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Role / Shift</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.staff.slice(0, 4).map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="clinic-dashboard-staff-name">
                        {s.first_name} {s.last_name}
                      </div>
                      <div className="clinic-dashboard-staff-email">
                        {s.email}
                      </div>
                    </td>
                    <td>
                      <div className="clinic-dashboard-staff-desig">
                        {s.designation}
                      </div>
                      <div className="clinic-dashboard-staff-shift">
                        {s.shift} Shift
                      </div>
                    </td>
                    <td>
                      <span className={`clinic-badge ${s.status}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
