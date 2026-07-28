'use client';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {
  createClinic,
  deleteClinic,
  getClinics,
  getClinicById,
  updateClinic,
} from '@/services/superadmin/clinicService';
import { getCities } from '@/services/superadmin/cityService';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserStatus,
} from '@/services/superadmin/userService';
import { showError, showSuccess } from '@/utils/toast';

function formatStatus(status) {
  if (!status) return 'Inactive';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

const emptyClinicForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  status: 'active',
};

const emptyAdminForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  roles: ['clinic_admin'],
  status: 'active',
  clinic_id: '',
};

const defaultFilters = {
  search: '',
  status: '',
  page: 1,
  limit: 10,
};

export default function ClinicsManager({ initialTab = 'clinics' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'clinics' or 'admins'

  // --- Clinics State ---
  const [clinics, setClinics] = useState([]);
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [clinicsError, setClinicsError] = useState('');
  const [clinicFilters, setClinicFilters] = useState(defaultFilters);
  const [clinicSearchInput, setClinicSearchInput] = useState('');
  const [clinicStatusFilter, setClinicStatusFilter] = useState('');
  const [clinicPagination, setClinicPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // --- Admins State ---
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [userFilters, setUserFilters] = useState({ ...defaultFilters, role: 'clinic_admin' });
  const [userSearchInput, setUserSearchInput] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userPagination, setUserPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // --- Step Wizard Modal ("Add Clinic & Admin") State ---
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); // 1 or 2
  const [wizardClinicForm, setWizardClinicForm] = useState(emptyClinicForm);
  const [wizardAdminForm, setWizardAdminForm] = useState(emptyAdminForm);
  const [wizardSaving, setWizardSaving] = useState(false);
  const [wizardError, setWizardError] = useState('');

  // --- Individual Edit / View Modals State ---
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [editingClinicId, setEditingClinicId] = useState(null);
  const [clinicForm, setClinicForm] = useState(emptyClinicForm);
  const [savingClinic, setSavingClinic] = useState(false);
  const [loadingClinicForm, setLoadingClinicForm] = useState(false);
  const [clinicFormError, setClinicFormError] = useState('');

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState(emptyAdminForm);
  const [savingUser, setSavingUser] = useState(false);
  const [loadingUserForm, setLoadingUserForm] = useState(false);
  const [userFormError, setUserFormError] = useState('');

  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Searchable Clinic Dropdown inside Edit Admin Modal
  const [clinicsList, setClinicsList] = useState([]);
  const [clinicDropdownSearch, setClinicDropdownSearch] = useState('');
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const clinicDropdownRef = useRef(null);

  // Searchable City Dropdown State
  const [citiesList, setCitiesList] = useState([]);
  const [cityWizardSearch, setCityWizardSearch] = useState('');
  const [showCityWizardDropdown, setShowCityWizardDropdown] = useState(false);
  const cityWizardDropdownRef = useRef(null);

  const [cityEditSearch, setCityEditSearch] = useState('');
  const [showCityEditDropdown, setShowCityEditDropdown] = useState(false);
  const cityEditDropdownRef = useRef(null);

  // Load Clinics
  const loadClinics = async (filters = clinicFilters) => {
    try {
      setLoadingClinics(true);
      setClinicsError('');
      const result = await getClinics(filters);
      setClinics(result.data || []);
      setClinicPagination({
        count: result.count ?? 0,
        currentPage: result.currentPage ?? 1,
        totalPages: result.totalPages ?? 1,
        limit: result.limit ?? filters.limit ?? 10,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load clinics.';
      setClinicsError(message);
      showError(err, message);
    } finally {
      setLoadingClinics(false);
    }
  };

  // Load Users (Clinic Admins)
  const loadUsers = async (filters = userFilters) => {
    try {
      setLoadingUsers(true);
      setUsersError('');
      const result = await getUsers(filters);
      setUsers(result.data || []);
      setUserPagination({
        count: result.count ?? 0,
        currentPage: result.currentPage ?? 1,
        totalPages: result.totalPages ?? 1,
        limit: result.limit ?? filters.limit ?? 10,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to load clinic admins.';
      setUsersError(message);
      showError(err, message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadClinics(defaultFilters);
      loadUsers({ ...defaultFilters, role: 'clinic_admin' });
    });

    getClinics({ limit: 100 })
      .then((res) => setClinicsList(res.data || []))
      .catch((err) => console.error('Failed to fetch dropdown clinics list', err));
    getCities({ limit: 1000 })
      .then((res) => setCitiesList(res.data || []))
      .catch((err) => console.error('Failed to fetch dropdown cities list', err));

    const handleClickOutside = (e) => {
      if (clinicDropdownRef.current && !clinicDropdownRef.current.contains(e.target)) {
        setShowClinicDropdown(false);
      }
      if (cityWizardDropdownRef.current && !cityWizardDropdownRef.current.contains(e.target)) {
        setShowCityWizardDropdown(false);
      }
      if (cityEditDropdownRef.current && !cityEditDropdownRef.current.contains(e.target)) {
        setShowCityEditDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Clinics Table Filtering & Actions ---
  const handleClinicApplyFilter = () => {
    const filters = {
      search: clinicSearchInput.trim(),
      status: clinicStatusFilter,
      page: 1,
      limit: clinicFilters.limit,
    };
    setClinicFilters(filters);
    loadClinics(filters);
  };

  const handleClinicResetFilter = () => {
    setClinicSearchInput('');
    setClinicStatusFilter('');
    setClinicFilters(defaultFilters);
    loadClinics(defaultFilters);
  };

  const handleClinicLimitChange = (limit) => {
    const filters = { ...clinicFilters, page: 1, limit: Number(limit) };
    setClinicFilters(filters);
    loadClinics(filters);
  };

  const handleClinicPageChange = (page) => {
    if (page < 1 || page > clinicPagination.totalPages) return;
    const filters = { ...clinicFilters, page };
    setClinicFilters(filters);
    loadClinics(filters);
  };

  const handleToggleClinicStatus = async (clinic) => {
    const newStatus = formatStatus(clinic.status) === 'Active' ? 'inactive' : 'active';
    try {
      const result = await updateClinic(clinic.id, { ...clinic, status: newStatus });
      showSuccess(result.message || 'Clinic status updated successfully');
      await loadClinics(clinicFilters);
    } catch (err) {
      showError(err, 'Failed to update clinic status');
    }
  };

  const handleDeleteClinic = async (clinic) => {
    const result = await Swal.fire({
      title: 'Delete clinic?',
      text: `"${clinic.name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await deleteClinic(clinic.id);
      showSuccess(res.message || 'Clinic deleted');
      await loadClinics(clinicFilters);
    } catch (err) {
      showError(err, 'Failed to delete clinic');
    }
  };

  // --- Admins Table Filtering & Actions ---
  const handleUserApplyFilter = () => {
    const filters = {
      search: userSearchInput.trim(),
      status: userStatusFilter,
      role: 'clinic_admin',
      page: 1,
      limit: userFilters.limit,
    };
    setUserFilters(filters);
    loadUsers(filters);
  };

  const handleUserResetFilter = () => {
    setUserSearchInput('');
    setUserStatusFilter('');
    setUserFilters({ ...defaultFilters, role: 'clinic_admin' });
    loadUsers({ ...defaultFilters, role: 'clinic_admin' });
  };

  const handleUserLimitChange = (limit) => {
    const filters = { ...userFilters, page: 1, limit: Number(limit) };
    setUserFilters(filters);
    loadUsers(filters);
  };

  const handleUserPageChange = (page) => {
    if (page < 1 || page > userPagination.totalPages) return;
    const filters = { ...userFilters, page };
    setUserFilters(filters);
    loadUsers(filters);
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = formatStatus(user.status) === 'Active' ? 'inactive' : 'active';
    try {
      const result = await updateUserStatus(user.id, newStatus);
      showSuccess(result.message || 'User status updated successfully');
      await loadUsers(userFilters);
    } catch (err) {
      showError(err, 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    const fullName = `${user.first_name} ${user.last_name || ''}`.trim();
    const result = await Swal.fire({
      title: 'Delete Clinic Admin?',
      text: `"${fullName}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await deleteUser(user.id);
      showSuccess(res.message || 'Clinic admin deleted');
      await loadUsers(userFilters);
    } catch (err) {
      showError(err, 'Failed to delete clinic admin');
    }
  };

  const handleOpenViewUser = async (user) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
    try {
      const data = await getUserById(user.id);
      setSelectedUser(data);
    } catch (err) {
      // fallback to selectedUser
    }
  };

  // --- 2-STEP WIZARD MODAL HANDLERS ---
  const handleOpenWizard = () => {
    setWizardStep(1);
    setWizardClinicForm(emptyClinicForm);
    setWizardAdminForm(emptyAdminForm);
    setWizardError('');
    setCityWizardSearch('');
    setShowCityWizardDropdown(false);
    setShowWizardModal(true);
  };

  const handleWizardStep1Next = (e) => {
    e.preventDefault();
    if (!wizardAdminForm.first_name.trim()) {
      setWizardError('Admin First Name is required.');
      return;
    }
    if (!wizardAdminForm.email.trim()) {
      setWizardError('Admin Email is required.');
      return;
    }
    if (!wizardAdminForm.phone.trim()) {
      setWizardError('Admin Phone Number is required.');
      return;
    }
    const cleanAdminPhone = wizardAdminForm.phone.replace(/\D/g, '');
    if (cleanAdminPhone.length !== 10) {
      setWizardError('Admin Phone Number must be exactly 10 digits.');
      return;
    }
    if (!wizardAdminForm.password.trim()) {
      setWizardError('Admin Password is required.');
      return;
    }
    setWizardError('');
    setWizardStep(2);
  };

  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    if (!wizardClinicForm.name.trim()) {
      setWizardError('Clinic Name is required.');
      return;
    }
    if (!wizardClinicForm.address.trim()) {
      setWizardError('Clinic Address is required.');
      return;
    }
    if (wizardClinicForm.phone.trim()) {
      const cleanClinicPhone = wizardClinicForm.phone.replace(/\D/g, '');
      if (cleanClinicPhone.length !== 10) {
        setWizardError('Clinic Phone Number must be exactly 10 digits.');
        return;
      }
    }

    setWizardSaving(true);
    setWizardError('');

    try {
      // 1. Create Clinic
      const clinicPayload = {
        name: wizardClinicForm.name.trim(),
        email: wizardClinicForm.email.trim(),
        phone: wizardClinicForm.phone.trim(),
        address: wizardClinicForm.address.trim(),
        city: wizardClinicForm.city.trim(),
        state: wizardClinicForm.state.trim(),
        status: wizardClinicForm.status,
      };
      const createdClinicRes = await createClinic(clinicPayload);
      const newClinicId = createdClinicRes.data?.id;

      // 2. Create Clinic Admin linked to new clinic
      const adminPayload = {
        first_name: wizardAdminForm.first_name.trim(),
        last_name: wizardAdminForm.last_name.trim(),
        email: wizardAdminForm.email.trim(),
        phone: wizardAdminForm.phone.trim(),
        password: wizardAdminForm.password.trim(),
        roles: ['clinic_admin'],
        status: wizardAdminForm.status,
        clinic_id: newClinicId || null,
      };
      await createUser(adminPayload);

      showSuccess('Clinic and Admin registered successfully!');
      setShowWizardModal(false);
      await loadClinics(clinicFilters);
      await loadUsers(userFilters);

      // Refresh clinics list dropdown
      getClinics({ limit: 100 }).then((res) => setClinicsList(res.data || []));
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to complete registration.';
      setWizardError(message);
      showError(err, message);
    } finally {
      setWizardSaving(false);
    }
  };

  // --- EDIT CLINIC MODAL HANDLERS ---
  const handleOpenEditClinic = async (clinic) => {
    setEditingClinicId(clinic.id);
    setClinicFormError('');
    setCityEditSearch(clinic.city || '');
    setShowCityEditDropdown(false);
    setShowClinicModal(true);
    setLoadingClinicForm(true);
    try {
      const data = await getClinicById(clinic.id);
      setClinicForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        status: data.status || 'active',
      });
      setCityEditSearch(data.city || clinic.city || '');
    } catch (err) {
      setClinicForm({
        name: clinic.name || '',
        email: clinic.email || '',
        phone: clinic.phone || '',
        address: clinic.address || '',
        city: clinic.city || '',
        state: clinic.state || '',
        status: clinic.status || 'active',
      });
      setCityEditSearch(clinic.city || '');
    } finally {
      setLoadingClinicForm(false);
    }
  };

  const handleSaveClinic = async (e) => {
    e.preventDefault();
    if (!clinicForm.name.trim()) {
      setClinicFormError('Clinic Name is required.');
      return;
    }
    if (clinicForm.phone.trim()) {
      const cleanPhone = clinicForm.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setClinicFormError('Clinic Phone Number must be exactly 10 digits.');
        return;
      }
    }
    setSavingClinic(true);
    setClinicFormError('');
    try {
      const payload = {
        name: clinicForm.name.trim(),
        email: clinicForm.email.trim(),
        phone: clinicForm.phone.trim(),
        address: clinicForm.address.trim(),
        city: clinicForm.city.trim(),
        state: clinicForm.state.trim(),
        status: clinicForm.status,
      };
      const result = await updateClinic(editingClinicId, payload);
      showSuccess(result.message || 'Clinic updated');
      setShowClinicModal(false);
      await loadClinics(clinicFilters);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update clinic.';
      setClinicFormError(message);
      showError(err, message);
    } finally {
      setSavingClinic(false);
    }
  };

  // --- EDIT ADMIN MODAL HANDLERS ---
  const handleOpenEditUser = async (user) => {
    setEditingUserId(user.id);
    setUserFormError('');
    setShowUserModal(true);
    setLoadingUserForm(true);
    try {
      const data = await getUserById(user.id);
      const linkedClinicId = data.clinics?.[0]?.id || user.clinics?.[0]?.id || '';
      const matchedClinic = clinicsList.find((c) => String(c.id) === String(linkedClinicId));

      setUserForm({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        password: '',
        roles: Array.isArray(data.roles) ? data.roles : [data.roles || 'clinic_admin'],
        status: data.status === 'inactive' ? 'inactive' : 'active',
        clinic_id: linkedClinicId ? String(linkedClinicId) : '',
      });
      setClinicDropdownSearch(matchedClinic ? `${matchedClinic.name} ${matchedClinic.city ? `(${matchedClinic.city})` : ''}` : '');
    } catch (err) {
      const linkedClinicId = user.clinics?.[0]?.id || '';
      const matchedClinic = clinicsList.find((c) => String(c.id) === String(linkedClinicId));

      setUserForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        roles: Array.isArray(user.roles) ? user.roles : [user.roles || 'clinic_admin'],
        status: user.status === 'inactive' ? 'inactive' : 'active',
        clinic_id: linkedClinicId ? String(linkedClinicId) : '',
      });
      setClinicDropdownSearch(matchedClinic ? `${matchedClinic.name} ${matchedClinic.city ? `(${matchedClinic.city})` : ''}` : '');
    } finally {
      setLoadingUserForm(false);
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.first_name.trim()) {
      setUserFormError('First name is required.');
      return;
    }
    if (!userForm.email.trim()) {
      setUserFormError('Email is required.');
      return;
    }
    if (userForm.phone.trim()) {
      const cleanPhone = userForm.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setUserFormError('Phone Number must be exactly 10 digits.');
        return;
      }
    }
    setSavingUser(true);
    setUserFormError('');
    try {
      const payload = {
        first_name: userForm.first_name.trim(),
        last_name: userForm.last_name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim(),
        roles: userForm.roles,
        status: userForm.status,
        clinic_id: userForm.clinic_id || null,
      };
      if (userForm.password.trim()) {
        payload.password = userForm.password.trim();
      }
      const result = await updateUser(editingUserId, payload);
      showSuccess(result.message || 'Admin updated');
      setShowUserModal(false);
      await loadUsers(userFilters);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update admin.';
      setUserFormError(message);
      showError(err, message);
    } finally {
      setSavingUser(false);
    }
  };

  const filteredDropdownClinics = clinicsList.filter((c) => {
    const term = clinicDropdownSearch.toLowerCase().trim();
    if (!term) return true;
    return `${c.name} ${c.city || ''}`.toLowerCase().includes(term);
  });

  const filteredCitiesWizard = citiesList.filter((c) => {
    const term = cityWizardSearch.toLowerCase().trim();
    if (!term) return true;
    return c.name.toLowerCase().includes(term);
  });

  const filteredCitiesEdit = citiesList.filter((c) => {
    const term = cityEditSearch.toLowerCase().trim();
    if (!term) return true;
    return c.name.toLowerCase().includes(term);
  });

  return (
    <div className="clinics-manager-merged">
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Clinics & Admin Management</h1>
          <p className="admin-subtitle">Register and manage healthcare clinics and their clinic administrators in one place.</p>
        </div>
        <button className="admin-add-btn" onClick={handleOpenWizard}>
          <span>+</span> Add Clinic & Admin
        </button>
      </div>

      {/* Main Tab Navigation */}
      <div className="admin-tabs-nav" style={{ display: 'flex', gap: 12, marginBottom: 20, borderBottom: '2px solid #e2e8f0' }}>
        <button
          type="button"
          onClick={() => setActiveTab('clinics')}
          style={{
            padding: '12px 20px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: activeTab === 'clinics' ? '#4f46e5' : '#64748b',
            borderBottom: activeTab === 'clinics' ? '3px solid #4f46e5' : '3px solid transparent',
            marginBottom: -2,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>🏥 Clinic Directory</span>
          <span
            style={{
              fontSize: 12,
              background: activeTab === 'clinics' ? '#e0e7ff' : '#f1f5f9',
              color: activeTab === 'clinics' ? '#4338ca' : '#64748b',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            {clinicPagination.count}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          style={{
            padding: '12px 20px',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: activeTab === 'admins' ? '#4f46e5' : '#64748b',
            borderBottom: activeTab === 'admins' ? '3px solid #4f46e5' : '3px solid transparent',
            marginBottom: -2,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>👤 Admin Management</span>
          <span
            style={{
              fontSize: 12,
              background: activeTab === 'admins' ? '#e0e7ff' : '#f1f5f9',
              color: activeTab === 'admins' ? '#4338ca' : '#64748b',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            {userPagination.count}
          </span>
        </button>
      </div>

      {/* TAB 1: CLINIC DIRECTORY */}
      {activeTab === 'clinics' && (
        <>
          <div className="admin-filter-bar">
            <input
              className="admin-search-input"
              placeholder="Search by clinic name, email, phone, city..."
              value={clinicSearchInput}
              onChange={(e) => setClinicSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleClinicApplyFilter()}
            />
            <select
              className="admin-filter-select"
              value={clinicStatusFilter}
              onChange={(e) => setClinicStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="admin-filter-select"
              value={clinicFilters.limit}
              onChange={(e) => handleClinicLimitChange(e.target.value)}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <button className="admin-btn-apply" onClick={handleClinicApplyFilter}>
              Apply Filter
            </button>
            <button className="admin-btn-reset" onClick={handleClinicResetFilter}>
              Reset
            </button>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Clinic</th>
                    <th>Contact Info</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingClinics ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                        Loading clinics...
                      </td>
                    </tr>
                  ) : clinicsError ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#dc2626' }}>
                        {clinicsError}
                      </td>
                    </tr>
                  ) : clinics.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                        No clinics found.
                      </td>
                    </tr>
                  ) : (
                    clinics.map((c) => {
                      const status = formatStatus(c.status);

                      return (
                        <tr key={c.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span className="clinic-avatar">🏥</span>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                                <div style={{ fontSize: 12, color: '#94a3b8' }}>ID: CLN-{c.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{c.email || '—'}</div>
                            <div style={{ fontSize: 13, color: '#64748b' }}>{c.phone || '—'}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: 13, color: '#475569', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.address}>
                              {c.address || '—'}
                            </div>
                            {(c.city || c.state) && (
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>{[c.city, c.state].filter(Boolean).join(', ')}</div>
                            )}
                          </td>
                          <td>
                            <button
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                              onClick={() => handleToggleClinicStatus(c)}
                              title="Click to toggle status"
                            >
                              <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                                {status}
                              </span>
                            </button>
                          </td>
                          <td>
                            <button className="admin-action-btn-edit" onClick={() => handleOpenEditClinic(c)}>
                              Edit
                            </button>
                            <button className="admin-action-btn-delete" onClick={() => handleDeleteClinic(c)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loadingClinics && !clinicsError && clinicPagination.totalPages > 0 && (
              <div className="admin-pagination-container">
                <span className="admin-pagination-info">
                  Showing page {clinicPagination.currentPage} of {clinicPagination.totalPages} ({clinicPagination.count} total clinics)
                </span>
                <div className="admin-pagination-controls">
                  <button
                    className="admin-btn-reset"
                    onClick={() => handleClinicPageChange(clinicPagination.currentPage - 1)}
                    disabled={clinicPagination.currentPage <= 1}
                  >
                    Previous
                  </button>
                  <button
                    className="admin-btn-apply"
                    onClick={() => handleClinicPageChange(clinicPagination.currentPage + 1)}
                    disabled={clinicPagination.currentPage >= clinicPagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: ADMIN MANAGEMENT */}
      {activeTab === 'admins' && (
        <>
          <div className="admin-filter-bar">
            <input
              className="admin-search-input"
              placeholder="Search admins by name, email, phone..."
              value={userSearchInput}
              onChange={(e) => setUserSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUserApplyFilter()}
            />
            <select
              className="admin-filter-select"
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              className="admin-filter-select"
              value={userFilters.limit}
              onChange={(e) => handleUserLimitChange(e.target.value)}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <button className="admin-btn-apply" onClick={handleUserApplyFilter}>
              Apply Filter
            </button>
            <button className="admin-btn-reset" onClick={handleUserResetFilter}>
              Reset
            </button>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Admin Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Associated Clinic</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="6" className="admin-table-loading-text">
                        Loading clinic admins...
                      </td>
                    </tr>
                  ) : usersError ? (
                    <tr>
                      <td colSpan="6" className="admin-table-error-text">
                        {usersError}
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="admin-table-empty-text">
                        No clinic admins found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const status = formatStatus(u.status);
                      const fullName = `${u.first_name} ${u.last_name || ''}`.trim();
                      const linkedClinic = u.clinics && u.clinics.length > 0 ? u.clinics[0] : null;

                      return (
                        <tr key={u.id}>
                          <td>
                            <span className="admin-table-bold-name">{fullName}</span>
                          </td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            {linkedClinic ? (
                              <span className="admin-clinic-link-tag">
                                🏥 {linkedClinic.name}
                              </span>
                            ) : (
                              <span className="admin-unassigned-tag">Unassigned</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="admin-badge-toggle-btn"
                              onClick={() => handleToggleUserStatus(u)}
                              title="Click to toggle status"
                            >
                              <span className={`admin-badge ${status === 'Active' ? 'active' : 'inactive'}`}>
                                {status}
                              </span>
                            </button>
                          </td>
                          <td>
                            <button className="admin-action-btn-view" onClick={() => handleOpenViewUser(u)}>
                              View
                            </button>
                            <button className="admin-action-btn-edit" onClick={() => handleOpenEditUser(u)}>
                              Edit
                            </button>
                            <button className="admin-action-btn-delete" onClick={() => handleDeleteUser(u)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loadingUsers && !usersError && userPagination.totalPages > 0 && (
              <div className="admin-pagination-container">
                <span className="admin-pagination-info">
                  Showing page {userPagination.currentPage} of {userPagination.totalPages} ({userPagination.count} total admins)
                </span>
                <div className="admin-pagination-controls">
                  <button
                    className="admin-btn-reset"
                    onClick={() => handleUserPageChange(userPagination.currentPage - 1)}
                    disabled={userPagination.currentPage <= 1}
                  >
                    Previous
                  </button>
                  <button
                    className="admin-btn-apply"
                    onClick={() => handleUserPageChange(userPagination.currentPage + 1)}
                    disabled={userPagination.currentPage >= userPagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/* 2-STEP WIZARD MODAL ("Add Clinic & Admin")                    */}
      {/* Matches user's screenshot step 1 & step 2 design exactly!   */}
      {/* ============================================================ */}
      {showWizardModal && (
        <div className="admin-modal-backdrop" onClick={() => !wizardSaving && setShowWizardModal(false)}>
          <div className="admin-modal-card" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <h3 className="admin-modal-title" style={{ marginBottom: 4 }}>Add Clinic & Admin</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                  Step {wizardStep} of 2: {wizardStep === 1 ? 'Admin Details' : 'Clinic Details'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !wizardSaving && setShowWizardModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px 0 18px 0', gap: 16 }}>
              {/* Step 1 Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: wizardStep >= 1 ? '#4f46e5' : '#e2e8f0',
                    color: wizardStep >= 1 ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: wizardStep === 1 ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none',
                  }}
                >
                  1
                </div>
                <span style={{ fontSize: 14, fontWeight: wizardStep === 1 ? 700 : 500, color: wizardStep === 1 ? '#0f172a' : '#64748b' }}>
                  Admin Details
                </span>
              </div>

              {/* Line connector */}
              <div style={{ width: 80, height: 2, background: wizardStep === 2 ? '#4f46e5' : '#e2e8f0' }}></div>

              {/* Step 2 Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: wizardStep === 2 ? '#4f46e5' : '#e2e8f0',
                    color: wizardStep === 2 ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: wizardStep === 2 ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none',
                  }}
                >
                  2
                </div>
                <span style={{ fontSize: 14, fontWeight: wizardStep === 2 ? 700 : 500, color: wizardStep === 2 ? '#0f172a' : '#64748b' }}>
                  Clinic Details
                </span>
              </div>
            </div>

            {/* STEP 1: ADMIN DETAILS */}
            {wizardStep === 1 && (
              <form onSubmit={handleWizardStep1Next}>
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-form-label">Admin First Name *</label>
                    <input
                      className="admin-input"
                      placeholder="Enter admin first name"
                      value={wizardAdminForm.first_name}
                      onChange={(e) => setWizardAdminForm({ ...wizardAdminForm, first_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Admin Last Name</label>
                    <input
                      className="admin-input"
                      placeholder="Enter admin last name"
                      value={wizardAdminForm.last_name}
                      onChange={(e) => setWizardAdminForm({ ...wizardAdminForm, last_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Admin Email *</label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="admin@clinic.com"
                      value={wizardAdminForm.email}
                      onChange={(e) => setWizardAdminForm({ ...wizardAdminForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Admin Phone Number * (10 Digits)</label>
                    <input
                      className="admin-input"
                      placeholder="Enter 10-digit phone number"
                      value={wizardAdminForm.phone}
                      maxLength={10}
                      onChange={(e) => setWizardAdminForm({ ...wizardAdminForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                    />
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Admin Password *</label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder="Enter secure password"
                      value={wizardAdminForm.password}
                      onChange={(e) => setWizardAdminForm({ ...wizardAdminForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Account Status</label>
                    <select
                      className="admin-select"
                      value={wizardAdminForm.status}
                      onChange={(e) => setWizardAdminForm({ ...wizardAdminForm, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {wizardError && <p className="admin-form-error-msg">{wizardError}</p>}

                <div className="admin-form-actions">
                  <button type="button" className="admin-cancel-btn" onClick={() => setShowWizardModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-save-btn">
                    Next &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: CLINIC DETAILS */}
            {wizardStep === 2 && (
              <form onSubmit={handleWizardSubmit}>
                <div className="admin-form-grid">
                  <div className="admin-form-full">
                    <label className="admin-form-label">Admin User</label>
                    <input
                      className="admin-input"
                      value={`👤 ${wizardAdminForm.first_name} ${wizardAdminForm.last_name || ''} (${wizardAdminForm.email})`}
                      disabled
                      style={{ background: '#f8fafc', color: '#475569', fontWeight: 600 }}
                    />
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Clinic Name *</label>
                    <input
                      className="admin-input"
                      placeholder="Enter clinic name"
                      value={wizardClinicForm.name}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Address *</label>
                    <textarea
                      className="admin-textarea"
                      placeholder="Enter full address"
                      value={wizardClinicForm.address}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-searchable-select-wrap" ref={cityWizardDropdownRef}>
                    <label className="admin-form-label">City *</label>
                    <div className="admin-searchable-select-wrap">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Search & select city..."
                        value={wizardClinicForm.city}
                        onFocus={() => setShowCityWizardDropdown(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCityWizardSearch(val);
                          setWizardClinicForm({ ...wizardClinicForm, city: val });
                          setShowCityWizardDropdown(true);
                        }}
                        required
                      />
                      {wizardClinicForm.city && (
                        <button
                          type="button"
                          className="admin-searchable-clear-btn"
                          onClick={() => {
                            setWizardClinicForm({ ...wizardClinicForm, city: '' });
                            setCityWizardSearch('');
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {showCityWizardDropdown && (
                      <div className="admin-searchable-dropdown-list">
                        {filteredCitiesWizard.length === 0 ? (
                          <div className="admin-searchable-item-empty">No matching cities found</div>
                        ) : (
                          filteredCitiesWizard.map((c) => {
                            const isSelected = wizardClinicForm.city.toLowerCase() === c.name.toLowerCase();
                            return (
                              <div
                                key={c.id}
                                className={`admin-searchable-item ${isSelected ? 'selected' : ''}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setWizardClinicForm({ ...wizardClinicForm, city: c.name });
                                  setCityWizardSearch(c.name);
                                  setShowCityWizardDropdown(false);
                                }}
                              >
                                <span>🌆 {c.name}</span>
                                {isSelected && <span>✓</span>}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="admin-form-label">State *</label>
                    <input
                      className="admin-input"
                      placeholder="Select / enter state"
                      value={wizardClinicForm.state}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, state: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Phone Number * (10 Digits)</label>
                    <input
                      className="admin-input"
                      placeholder="Enter 10-digit phone number"
                      value={wizardClinicForm.phone}
                      maxLength={10}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Status *</label>
                    <select
                      className="admin-select"
                      value={wizardClinicForm.status}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Clinic Email (Optional)</label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="e.g. contact@clinic.com"
                      value={wizardClinicForm.email}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, email: e.target.value })}
                    />
                  </div>
                </div>

                {wizardError && <p className="admin-form-error-msg">{wizardError}</p>}

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-cancel-btn"
                    onClick={() => setWizardStep(1)}
                    disabled={wizardSaving}
                  >
                    &larr; Back
                  </button>
                  <button type="submit" className="admin-save-btn" disabled={wizardSaving}>
                    {wizardSaving ? 'Saving both...' : 'Save & Register'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT CLINIC MODAL */}
      {showClinicModal && (
        <div className="admin-modal-backdrop" onClick={() => !savingClinic && setShowClinicModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Edit Clinic Details</h3>
            {loadingClinicForm ? (
              <p style={{ textAlign: 'center', padding: 20 }}>Loading details...</p>
            ) : (
              <form onSubmit={handleSaveClinic}>
                <div className="admin-form-grid">
                  <div className="admin-form-full">
                    <label className="admin-form-label">Clinic Name *</label>
                    <input
                      className="admin-input"
                      value={clinicForm.name}
                      onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Email</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={clinicForm.email}
                      onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Phone (10 Digits)</label>
                    <input
                      className="admin-input"
                      value={clinicForm.phone}
                      maxLength={10}
                      onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    />
                  </div>
                  <div className="admin-searchable-select-wrap" ref={cityEditDropdownRef}>
                    <label className="admin-form-label">City</label>
                    <div className="admin-searchable-select-wrap">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Search & select city..."
                        value={clinicForm.city}
                        onFocus={() => setShowCityEditDropdown(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCityEditSearch(val);
                          setClinicForm({ ...clinicForm, city: val });
                          setShowCityEditDropdown(true);
                        }}
                      />
                      {clinicForm.city && (
                        <button
                          type="button"
                          className="admin-searchable-clear-btn"
                          onClick={() => {
                            setClinicForm({ ...clinicForm, city: '' });
                            setCityEditSearch('');
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {showCityEditDropdown && (
                      <div className="admin-searchable-dropdown-list">
                        {filteredCitiesEdit.length === 0 ? (
                          <div className="admin-searchable-item-empty">No matching cities found</div>
                        ) : (
                          filteredCitiesEdit.map((c) => {
                            const isSelected = (clinicForm.city || '').toLowerCase() === c.name.toLowerCase();
                            return (
                              <div
                                key={c.id}
                                className={`admin-searchable-item ${isSelected ? 'selected' : ''}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setClinicForm({ ...clinicForm, city: c.name });
                                  setCityEditSearch(c.name);
                                  setShowCityEditDropdown(false);
                                }}
                              >
                                <span>🌆 {c.name}</span>
                                {isSelected && <span>✓</span>}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="admin-form-label">State</label>
                    <input
                      className="admin-input"
                      value={clinicForm.state}
                      onChange={(e) => setClinicForm({ ...clinicForm, state: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-full">
                    <label className="admin-form-label">Address</label>
                    <textarea
                      className="admin-textarea"
                      value={clinicForm.address}
                      onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-select"
                      value={clinicForm.status}
                      onChange={(e) => setClinicForm({ ...clinicForm, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                {clinicFormError && <p className="admin-form-error-msg">{clinicFormError}</p>}
                <div className="admin-form-actions">
                  <button type="submit" className="admin-save-btn" disabled={savingClinic}>
                    {savingClinic ? 'Saving...' : 'Update Clinic'}
                  </button>
                  <button type="button" className="admin-cancel-btn" onClick={() => setShowClinicModal(false)} disabled={savingClinic}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT ADMIN MODAL */}
      {showUserModal && (
        <div className="admin-modal-backdrop" onClick={() => !savingUser && setShowUserModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Edit Clinic Admin</h3>
            {loadingUserForm ? (
              <p style={{ textAlign: 'center', padding: 20 }}>Loading admin details...</p>
            ) : (
              <form onSubmit={handleSaveUser}>
                <div className="admin-form-grid">
                  <div>
                    <label className="admin-form-label">First Name *</label>
                    <input
                      className="admin-input"
                      value={userForm.first_name}
                      onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Last Name</label>
                    <input
                      className="admin-input"
                      value={userForm.last_name}
                      onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Email Address *</label>
                    <input
                      type="email"
                      className="admin-input"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Phone Number * (10 Digits)</label>
                    <input
                      className="admin-input"
                      value={userForm.phone}
                      maxLength={10}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                    />
                  </div>

                  {/* Searchable Clinic Select */}
                  <div className="admin-form-full admin-searchable-select-wrap" ref={clinicDropdownRef}>
                    <label className="admin-form-label">Assign Associated Clinic</label>
                    <div className="admin-searchable-select-wrap">
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="Search & select clinic..."
                        value={clinicDropdownSearch}
                        onFocus={() => setShowClinicDropdown(true)}
                        onChange={(e) => {
                          setClinicDropdownSearch(e.target.value);
                          setShowClinicDropdown(true);
                          if (!e.target.value.trim()) {
                            setUserForm({ ...userForm, clinic_id: '' });
                          }
                        }}
                      />
                      {userForm.clinic_id && (
                        <button
                          type="button"
                          className="admin-searchable-clear-btn"
                          onClick={() => {
                            setUserForm({ ...userForm, clinic_id: '' });
                            setClinicDropdownSearch('');
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {showClinicDropdown && (
                      <div className="admin-searchable-dropdown-list">
                        <div
                          className="admin-searchable-item-unassigned"
                          onClick={() => {
                            setUserForm({ ...userForm, clinic_id: '' });
                            setClinicDropdownSearch('');
                            setShowClinicDropdown(false);
                          }}
                        >
                          -- Unassigned (No Clinic) --
                        </div>
                        {filteredDropdownClinics.map((c) => {
                          const isSelected = userForm.clinic_id === String(c.id);
                          return (
                            <div
                              key={c.id}
                              className={`admin-searchable-item ${isSelected ? 'selected' : ''}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setUserForm({ ...userForm, clinic_id: String(c.id) });
                                setClinicDropdownSearch(`${c.name} ${c.city ? `(${c.city})` : ''}`);
                                setShowClinicDropdown(false);
                              }}
                            >
                              <span>🏥 {c.name} {c.city ? `(${c.city})` : ''}</span>
                              {isSelected && <span>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder="Optional new password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Status</label>
                    <select
                      className="admin-select"
                      value={userForm.status}
                      onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {userFormError && <p className="admin-form-error-msg">{userFormError}</p>}

                <div className="admin-form-actions">
                  <button type="submit" className="admin-save-btn" disabled={savingUser}>
                    {savingUser ? 'Saving...' : 'Update Admin'}
                  </button>
                  <button type="button" className="admin-cancel-btn" onClick={() => setShowUserModal(false)} disabled={savingUser}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* VIEW ADMIN DETAILS MODAL */}
      {showViewUserModal && selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setShowViewUserModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">Clinic Admin Details</h3>
            <div className="admin-form-grid">
              <div>
                <label className="admin-form-label">Admin ID</label>
                <div className="admin-modal-field-val">#{selectedUser.id}</div>
              </div>
              <div>
                <label className="admin-form-label">First Name</label>
                <div className="admin-modal-field-text">{selectedUser.first_name}</div>
              </div>
              <div>
                <label className="admin-form-label">Last Name</label>
                <div className="admin-modal-field-text">{selectedUser.last_name || '-'}</div>
              </div>
              <div>
                <label className="admin-form-label">Email Address</label>
                <div className="admin-modal-field-text">{selectedUser.email}</div>
              </div>
              <div>
                <label className="admin-form-label">Phone Number</label>
                <div className="admin-modal-field-text">{selectedUser.phone}</div>
              </div>
              <div className="admin-form-full">
                <label className="admin-form-label">Associated Clinic</label>
                <div className="admin-clinic-link-tag">
                  {selectedUser.clinics && selectedUser.clinics.length > 0 ? (
                    `🏥 ${selectedUser.clinics[0].name} (${selectedUser.clinics[0].city || ''})`
                  ) : (
                    <span className="admin-unassigned-tag">No Clinic Assigned</span>
                  )}
                </div>
              </div>
              <div>
                <label className="admin-form-label">Status</label>
                <div>
                  <span className={`admin-badge ${formatStatus(selectedUser.status) === 'Active' ? 'active' : 'inactive'}`}>
                    {formatStatus(selectedUser.status)}
                  </span>
                </div>
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="admin-cancel-btn" onClick={() => setShowViewUserModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
