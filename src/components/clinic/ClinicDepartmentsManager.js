'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  getClinicDepartments,
  assignDepartmentToClinic,
  removeDepartmentFromClinic,
} from '@/services/clinicAdminService';
import { getDepartments } from '@/services/departmentService';

const DEFAULT_FALLBACK_DEPTS = [
  { id: 1, name: 'General Physician', description: 'General Medicine & OPD' },
  { id: 2, name: 'Pediatrics', description: 'Child Care & Health' },
  { id: 3, name: 'Orthopedics', description: 'Bones & Joint Surgery' },
  { id: 4, name: 'Gynecology', description: 'Women Health & Care' },
  { id: 5, name: 'Dermatology', description: 'Skin & Hair Care' },
  { id: 6, name: 'Neurology', description: 'Brain & Nerve Care' },
  { id: 7, name: 'ENT Specialist', description: 'Ear, Nose & Throat' },
  { id: 8, name: 'Dentist', description: 'Dental Care & Surgery' },
];

export default function ClinicDepartmentsManager() {
  const [assignedDepartments, setAssignedDepartments] = useState([]);
  const [globalDepartments, setGlobalDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState('');

  const loadDeptData = useCallback(async () => {
    setLoading(true);
    const assigned = await getClinicDepartments();
    const assignedList = Array.isArray(assigned) ? assigned : (assigned?.data || []);
    setAssignedDepartments(assignedList);

    // Fetch system global departments directly from API
    try {
      const globalRes = await getDepartments({ limit: 100 }).catch(() => null);
      if (globalRes && Array.isArray(globalRes.data) && globalRes.data.length > 0) {
        setGlobalDepartments(globalRes.data);
      } else {
        setGlobalDepartments(DEFAULT_FALLBACK_DEPTS);
      }
    } catch (err) {
      console.error('Failed to load global departments', err);
      setGlobalDepartments(DEFAULT_FALLBACK_DEPTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDeptData();
  }, [loadDeptData]);

  const handleAssignDepartment = async (e) => {
    e.preventDefault();
    const deptToAssign = globalDepartments.find((d) => d.id === parseInt(selectedDeptId));
    if (deptToAssign) {
      const res = await assignDepartmentToClinic(deptToAssign);
      if (!res.success) {
        alert(res.message);
      } else {
        setShowAssignModal(false);
        loadDeptData();
      }
    }
  };

  const handleRemoveDepartment = async (id) => {
    if (window.confirm('Are you sure you want to remove this department from your clinic?')) {
      await removeDepartmentFromClinic(id);
      loadDeptData();
    }
  };

  const availableDepartments = globalDepartments.filter(
    (gd) => !assignedDepartments.some((ad) => ad.id === gd.id || ad.name?.toLowerCase() === gd.name?.toLowerCase())
  );

  return (
    <div className="clinic-departments-manager">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Clinic Departments</h1>
          <p className="clinic-subtitle">Assign medical specialties and departments available at your clinic.</p>
        </div>
        <button
          onClick={() => {
            setSelectedDeptId('');
            setShowAssignModal(true);
          }}
          className="clinic-btn clinic-btn-primary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Assign New Department
        </button>
      </div>

      {/* Departments Table Card */}
      <div className="clinic-table-card">
        <div className="clinic-table-header">
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            🏢 Assigned Specialties ({assignedDepartments.length})
          </h3>
        </div>

        <div className="clinic-table-wrap">
          <table className="clinic-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th>Assigned Doctors</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    Loading assigned departments...
                  </td>
                </tr>
              ) : assignedDepartments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                    No departments assigned to this clinic yet. Click Assign New Department to add one.
                  </td>
                </tr>
              ) : (
                assignedDepartments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>🏢</span>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{dept.name}</div>
                      </div>
                    </td>
                    <td style={{ color: '#475569', fontSize: 13 }}>{dept.description}</td>
                    <td>
                      <span className="clinic-gallery-tag">{dept.doctor_count || 0} Doctors</span>
                    </td>
                    <td>
                      <span className="clinic-badge active">{dept.status || 'Active'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleRemoveDepartment(dept.id)}
                        className="clinic-btn clinic-btn-danger clinic-btn-sm"
                        title="Remove Department"
                      >
                        Remove Department
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Department Modal */}
      {showAssignModal && (
        <div className="clinic-modal-overlay">
          <div className="clinic-modal">
            <div className="clinic-modal-header">
              <h3 className="clinic-modal-title">Assign Department to Clinic</h3>
              <button className="clinic-modal-close" onClick={() => setShowAssignModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAssignDepartment}>
              <div className="clinic-modal-body">
                <div className="clinic-form-group">
                  <label>Select Specialty Department *</label>
                  {availableDepartments.length === 0 ? (
                    <p style={{ color: '#64748b', fontSize: 14, margin: '8px 0 0' }}>
                      All available system departments are already assigned to this clinic.
                    </p>
                  ) : (
                    <select
                      className="clinic-form-control"
                      required
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                    >
                      <option value="">-- Choose a Department --</option>
                      {availableDepartments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} {dept.description ? `- ${dept.description}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="clinic-modal-footer">
                <button
                  type="button"
                  className="clinic-btn clinic-btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                {availableDepartments.length > 0 && (
                  <button type="submit" className="clinic-btn clinic-btn-primary">
                    Assign Department
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
