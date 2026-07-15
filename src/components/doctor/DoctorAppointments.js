'use client';
import { useState } from 'react';

const allAppointments = [
  { id: 1, name: 'Amit Shah', phone: '9876540001', date: '2026-07-15', slot: '09:00 AM', type: 'Consultation', status: 'Confirmed' },
  { id: 2, name: 'Priya Joshi', phone: '9876540002', date: '2026-07-15', slot: '09:30 AM', type: 'Follow-up', status: 'Confirmed' },
  { id: 3, name: 'Kiran Patel', phone: '9876540003', date: '2026-07-15', slot: '10:15 AM', type: 'Consultation', status: 'Pending' },
  { id: 4, name: 'Ravi Kumar', phone: '9876540004', date: '2026-07-15', slot: '11:00 AM', type: 'Check-up', status: 'Cancelled' },
  { id: 5, name: 'Anita Verma', phone: '9876540005', date: '2026-07-16', slot: '09:00 AM', type: 'Consultation', status: 'Confirmed' },
  { id: 6, name: 'Sanjay Gupta', phone: '9876540006', date: '2026-07-16', slot: '10:00 AM', type: 'Follow-up', status: 'Pending' },
];

export default function DoctorAppointments() {
  const [filter, setFilter] = useState('All');
  const [appointments, setAppointments] = useState(allAppointments);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = appointments.filter(a => {
    const matchesStatus = filter === 'All' ? true : a.status === filter;
    const matchesSearch = !searchQuery ? true : (
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesStatus && matchesSearch;
  });

  const counts = {
    All: appointments.length,
    Confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    Pending: appointments.filter(a => a.status === 'Pending').length,
    Cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  const updateStatus = (id, status) => setAppointments(appts => appts.map(a => a.id === id ? { ...a, status } : a));

  return (
    <div className="doc-appointments">
      <div className="doc-appt-header">
        <h1 className="doc-appt-title">Appointments</h1>
        <p className="doc-appt-subtitle">Manage patient appointments</p>
      </div>

      {/* Search Bar */}
      <div className="clinic-filter-bar">
        <div className="clinic-filter-group">
          <input
            className="clinic-search-input"
            placeholder="Search appointments by patient name, phone, type, date..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <div className="clinic-filter-actions">
            <button className="clinic-btn-reset" onClick={() => setSearchQuery('')}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="doc-filter-tabs">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`doc-filter-btn ${filter === key ? 'active-filter' : 'inactive'}`}
          >
            {key}
            <span className="doc-filter-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="doc-appt-table-card">
        <div className="doc-appt-table-wrap">
          <table className="doc-appt-table">
            <thead>
              <tr>
                {['Patient', 'Phone', 'Date', 'Slot', 'Type', 'Status', 'Action'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <div className="doc-appt-patient-cell">
                      <div className="doc-appt-avatar">{apt.name[0]}</div>
                      <span className="doc-appt-name">{apt.name}</span>
                    </div>
                  </td>
                  <td>{apt.phone}</td>
                  <td>{apt.date}</td>
                  <td className="doc-appt-slot">{apt.slot}</td>
                  <td>{apt.type}</td>
                  <td>
                    <span className={`doc-status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                  </td>
                  <td>
                    <div className="doc-action-cell">
                      {apt.status === 'Pending' && (
                        <button className="doc-action-confirm" onClick={() => updateStatus(apt.id, 'Confirmed')}>✓</button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button className="doc-action-cancel" onClick={() => updateStatus(apt.id, 'Cancelled')}>✕</button>
                      )}
                    </div>
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
