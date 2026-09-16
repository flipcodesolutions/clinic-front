'use client';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {
  createClinic,
  deleteClinic,
  getClinics,
  getClinicById,
  updateClinic,
  resolveMapUrl,
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

const CITY_COORDINATES = {
  'limbdi': { lat: 22.5658, lng: 71.8083 },
  'surendranagar': { lat: 22.7284, lng: 71.6371 },
  'wadhwan': { lat: 22.7011, lng: 71.6781 },
  'chotila': { lat: 22.4239, lng: 71.1963 },
  'dhrangadhra': { lat: 22.9961, lng: 71.4646 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'rajkot': { lat: 22.3039, lng: 70.8022 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'vadodara': { lat: 22.3072, lng: 73.1812 },
  'bhavnagar': { lat: 21.7645, lng: 72.1519 },
  'jamnagar': { lat: 22.4707, lng: 70.0577 },
  'junagadh': { lat: 21.5222, lng: 70.4579 },
  'gandhinagar': { lat: 23.2156, lng: 72.6369 },
  'anand': { lat: 22.5645, lng: 72.9289 },
  'nadiad': { lat: 22.6916, lng: 72.8634 },
  'morbi': { lat: 22.8120, lng: 70.8378 },
  'mehsana': { lat: 23.5880, lng: 72.3693 },
  'patan': { lat: 23.8493, lng: 72.1266 },
  'palanpur': { lat: 24.1724, lng: 72.4346 },
  'bharuch': { lat: 21.7051, lng: 72.9959 },
  'navsari': { lat: 20.9500, lng: 72.9200 },
  'valsad': { lat: 20.5992, lng: 72.9342 },
  'vapi': { lat: 20.3893, lng: 72.9106 },
  'porbandar': { lat: 21.6417, lng: 69.6293 },
  'godhra': { lat: 22.7758, lng: 73.6149 },
  'bhuj': { lat: 23.2420, lng: 69.6669 },
  'gandhidham': { lat: 23.0753, lng: 70.1337 },
  'veraval': { lat: 20.9077, lng: 70.3678 },
  'somnath': { lat: 20.8880, lng: 70.4012 },
  'amreli': { lat: 21.6032, lng: 71.2221 },
  'botad': { lat: 22.1706, lng: 71.6662 },
  'gondal': { lat: 21.9619, lng: 70.7983 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.7041, lng: 77.1025 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'indore': { lat: 22.7196, lng: 75.8577 },
};

function extractCoordsFromMapUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = decodeURIComponent(url.trim());

  // 1. Matches !3d23.1234!4d72.1234
  const placeMatch = cleanUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (placeMatch) return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };

  // 2. Matches ?q=23.1234,72.1234 or &q=23.1234,72.1234
  const qMatch = cleanUrl.match(/[?&]q=(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/i);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

  // 3. Matches /@23.1234,72.1234
  const atMatch = cleanUrl.match(/@(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

  // 4. Matches ?ll=23.1234,72.1234
  const llMatch = cleanUrl.match(/[?&]ll=(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/i);
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };

  // 5. Matches raw coordinates "23.1234, 72.1234"
  const rawMatch = cleanUrl.match(/(-?\d{1,2}\.\d{3,})[,\s]+(-?\d{1,3}\.\d{3,})/);
  if (rawMatch) return { lat: parseFloat(rawMatch[1]), lng: parseFloat(rawMatch[2]) };

  return null;
}

const emptyClinicForm = {
  name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  latitude: '',
  longitude: '',
  google_maps_url: '',
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
  const [detectingLocation, setDetectingLocation] = useState(false);

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
    // Automatically auto-fill live GPS coordinates and Google Maps link when landing on Clinic Details
    autoDetectGPS('wizard');
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
        website: wizardClinicForm.website ? wizardClinicForm.website.trim() : null,
        address: wizardClinicForm.address.trim(),
        city: wizardClinicForm.city.trim(),
        state: wizardClinicForm.state.trim(),
        latitude: wizardClinicForm.latitude ? parseFloat(wizardClinicForm.latitude) : null,
        longitude: wizardClinicForm.longitude ? parseFloat(wizardClinicForm.longitude) : null,
        google_maps_url: wizardClinicForm.google_maps_url ? wizardClinicForm.google_maps_url.trim() : null,
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
      const lat = data.latitude || clinic.latitude || '';
      const lng = data.longitude || clinic.longitude || '';
      const mapLink = data.google_maps_url || clinic.google_maps_url || (lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : '');
      setClinicForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || clinic.website || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        latitude: lat,
        longitude: lng,
        google_maps_url: mapLink,
        status: data.status || 'active',
      });
      setCityEditSearch(data.city || clinic.city || '');
      if (!lat || !lng) {
        autoDetectGPS('edit');
      }
    } catch (err) {
      const lat = clinic.latitude || '';
      const lng = clinic.longitude || '';
      const mapLink = clinic.google_maps_url || (lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : '');
      setClinicForm({
        name: clinic.name || '',
        email: clinic.email || '',
        phone: clinic.phone || '',
        website: clinic.website || '',
        address: clinic.address || '',
        city: clinic.city || '',
        state: clinic.state || '',
        latitude: lat,
        longitude: lng,
        google_maps_url: mapLink,
        status: clinic.status || 'active',
      });
      setCityEditSearch(clinic.city || '');
      if (!lat || !lng) {
        autoDetectGPS('edit');
      }
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
        website: clinicForm.website ? clinicForm.website.trim() : null,
        address: clinicForm.address.trim(),
        city: clinicForm.city.trim(),
        state: clinicForm.state.trim(),
        latitude: clinicForm.latitude ? parseFloat(clinicForm.latitude) : null,
        longitude: clinicForm.longitude ? parseFloat(clinicForm.longitude) : null,
        google_maps_url: clinicForm.google_maps_url ? clinicForm.google_maps_url.trim() : null,
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

  // --- LIVE GPS LOCATION AUTO-DETECT ---
  const autoDetectGPS = (target) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        if (target === 'wizard') {
          setWizardClinicForm((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            google_maps_url: prev.google_maps_url && prev.google_maps_url.trim() !== '' ? prev.google_maps_url : mapsUrl,
          }));
        } else if (target === 'edit') {
          setClinicForm((prev) => ({
            ...prev,
            latitude: prev.latitude || lat,
            longitude: prev.longitude || lng,
            google_maps_url: prev.google_maps_url && prev.google_maps_url.trim() !== '' ? prev.google_maps_url : mapsUrl,
          }));
        }

        setDetectingLocation(false);
      },
      (error) => {
        setDetectingLocation(false);
        console.warn('Geolocation auto-detect notice:', error?.message);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleDetectLocation = autoDetectGPS;

  const handleMapUrlChange = async (newUrl, formType) => {
    // 1. Immediate synchronous regex extraction
    const extracted = extractCoordsFromMapUrl(newUrl);
    if (formType === 'wizard') {
      setWizardClinicForm((prev) => ({
        ...prev,
        google_maps_url: newUrl,
        ...(extracted ? { latitude: extracted.lat, longitude: extracted.lng } : {}),
      }));
    } else {
      setClinicForm((prev) => ({
        ...prev,
        google_maps_url: newUrl,
        ...(extracted ? { latitude: extracted.lat, longitude: extracted.lng } : {}),
      }));
    }

    // 2. If it's a short URL (goo.gl, maps.app, bit.ly, etc.) and didn't match immediately, resolve via backend
    if (newUrl && (newUrl.includes('goo.gl') || newUrl.includes('maps.app') || newUrl.includes('http')) && !extracted) {
      try {
        const res = await resolveMapUrl(newUrl);
        if (res?.success && res.data?.latitude && res.data?.longitude) {
          if (formType === 'wizard') {
            setWizardClinicForm((prev) => ({
              ...prev,
              latitude: res.data.latitude,
              longitude: res.data.longitude,
            }));
          } else {
            setClinicForm((prev) => ({
              ...prev,
              latitude: res.data.latitude,
              longitude: res.data.longitude,
            }));
          }
        }
      } catch (e) {
        console.warn('Failed to resolve map URL on client:', e);
      }
    }
  };

  const handleCitySelect = (cityName, formType) => {
    const cityKey = (cityName || '').toLowerCase().trim();
    const cityCoords = CITY_COORDINATES[cityKey];

    if (formType === 'wizard') {
      setWizardClinicForm((prev) => {
        const hasCustomUrl = prev.google_maps_url && !prev.google_maps_url.includes('google.com/maps?q=');
        return {
          ...prev,
          city: cityName,
          ...(cityCoords && !hasCustomUrl
            ? {
                latitude: cityCoords.lat,
                longitude: cityCoords.lng,
                google_maps_url: `https://www.google.com/maps?q=${cityCoords.lat},${cityCoords.lng}`,
              }
            : {}),
        };
      });
    } else {
      setClinicForm((prev) => {
        const hasCustomUrl = prev.google_maps_url && !prev.google_maps_url.includes('google.com/maps?q=');
        return {
          ...prev,
          city: cityName,
          ...(cityCoords && !hasCustomUrl
            ? {
                latitude: cityCoords.lat,
                longitude: cityCoords.lng,
                google_maps_url: `https://www.google.com/maps?q=${cityCoords.lat},${cityCoords.lng}`,
              }
            : {}),
        };
      });
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
      <div className="admin-tabs-nav">
        <button
          type="button"
          onClick={() => setActiveTab('clinics')}
          className={`admin-tab-btn admin-tab-btn-flex ${activeTab === 'clinics' ? 'active' : ''}`}
        >
          <span>🏥 Clinic Directory</span>
          <span className={`admin-tab-badge ${activeTab === 'clinics' ? 'active' : ''}`}>
            {clinicPagination.count}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`admin-tab-btn admin-tab-btn-flex ${activeTab === 'admins' ? 'active' : ''}`}
        >
          <span>👤 Admin Management</span>
          <span className={`admin-tab-badge ${activeTab === 'admins' ? 'active' : ''}`}>
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
                      <td colSpan="5" className="admin-table-center-msg-lg">
                        Loading clinics...
                      </td>
                    </tr>
                  ) : clinicsError ? (
                    <tr>
                      <td colSpan="5" className="admin-table-center-error-lg">
                        {clinicsError}
                      </td>
                    </tr>
                  ) : clinics.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="admin-table-center-msg-lg">
                        No clinics found.
                      </td>
                    </tr>
                  ) : (
                    clinics.map((c) => {
                      const status = formatStatus(c.status);

                      return (
                        <tr key={c.id}>
                          <td>
                            <div className="admin-cell-flex">
                              <span className="clinic-avatar">🏥</span>
                              <div>
                                <div className="admin-cell-title-lg">{c.name}</div>
                                <div className="admin-cell-subtitle">ID: CLN-{c.id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="admin-cell-text-bold">{c.email || '—'}</div>
                            <div className="admin-cell-text-muted">{c.phone || '—'}</div>
                          </td>
                          <td>
                            <div className="admin-cell-address" title={c.address}>
                              {c.address || '—'}
                            </div>
                            {(c.city || c.state) && (
                              <div className="admin-cell-subtitle">{[c.city, c.state].filter(Boolean).join(', ')}</div>
                            )}
                          </td>
                          <td>
                            <button
                              className="admin-btn-transparent"
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
          <div className="admin-modal-card admin-modal-card-lg" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="admin-modal-header-row">
              <div>
                <h3 className="admin-modal-title admin-modal-title-sm">Add Clinic & Admin</h3>
                <p className="admin-modal-subtitle">
                  Step {wizardStep} of 2: {wizardStep === 1 ? 'Admin Details' : 'Clinic Details'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !wizardSaving && setShowWizardModal(false)}
                className="admin-modal-close-icon"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="admin-wizard-row">
              {/* Step 1 Indicator */}
              <div className="admin-wizard-step">
                <div className={`admin-wizard-num ${wizardStep >= 1 ? 'active' : ''} ${wizardStep === 1 ? 'active-ring' : ''}`}>
                  1
                </div>
                <span className={`admin-wizard-label ${wizardStep === 1 ? 'active' : ''}`}>
                  Admin Details
                </span>
              </div>

              {/* Line connector */}
              <div className={`admin-wizard-line ${wizardStep === 2 ? 'active' : ''}`}></div>

              {/* Step 2 Indicator */}
              <div className="admin-wizard-step">
                <div className={`admin-wizard-num ${wizardStep === 2 ? 'active active-ring' : ''}`}>
                  2
                </div>
                <span className={`admin-wizard-label ${wizardStep === 2 ? 'active' : ''}`}>
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
                      className="admin-input admin-input-readonly"
                      value={`👤 ${wizardAdminForm.first_name} ${wizardAdminForm.last_name || ''} (${wizardAdminForm.email})`}
                      disabled
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
                                  handleCitySelect(c.name, 'wizard');
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

                  <div>
                    <label className="admin-form-label">Clinic Email (Optional)</label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="e.g. contact@clinic.com"
                      value={wizardClinicForm.email}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Website (Optional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. www.preetclinic.com"
                      value={wizardClinicForm.website || ''}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, website: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-full">
                    <div className="admin-label-row">
                      <span className="admin-form-label admin-label-row-title">
                        📍 GPS Location Coordinates
                      </span>
                      {detectingLocation ? (
                        <span className="badge admin-badge-optional">
                          Detecting live GPS...
                        </span>
                      ) : wizardClinicForm.latitude ? (
                        <span className="badge admin-badge-recommended">
                          ✓ Coordinates Available
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="admin-form-label">Latitude</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 22.5658"
                      value={wizardClinicForm.latitude !== undefined && wizardClinicForm.latitude !== null ? wizardClinicForm.latitude : ''}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, latitude: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="admin-form-label">Longitude</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 71.8083"
                      value={wizardClinicForm.longitude !== undefined && wizardClinicForm.longitude !== null ? wizardClinicForm.longitude : ''}
                      onChange={(e) => setWizardClinicForm({ ...wizardClinicForm, longitude: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-full">
                    <label className="admin-form-label">Google Maps Link</label>
                    <input
                      type="url"
                      className="admin-input"
                      placeholder="e.g. https://maps.google.com/?q=... or https://maps.app.goo.gl/..."
                      value={wizardClinicForm.google_maps_url || ''}
                      onChange={(e) => handleMapUrlChange(e.target.value, 'wizard')}
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
              <p className="admin-modal-loading">Loading details...</p>
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
                    <label className="admin-form-label">Website (Optional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. www.preetclinic.com"
                      value={clinicForm.website || ''}
                      onChange={(e) => setClinicForm({ ...clinicForm, website: e.target.value })}
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
                                  handleCitySelect(c.name, 'edit');
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
                  <div className="admin-form-full">
                    <div className="admin-label-row">
                      <span className="admin-form-label admin-label-row-title">
                        📍 GPS Location Coordinates
                      </span>
                      {detectingLocation ? (
                        <span className="badge admin-badge-optional">
                          Detecting live GPS...
                        </span>
                      ) : clinicForm.latitude ? (
                        <span className="badge admin-badge-recommended">
                          ✓ Coordinates Available
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="admin-form-label">Latitude</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 22.5658"
                      value={clinicForm.latitude !== undefined && clinicForm.latitude !== null ? clinicForm.latitude : ''}
                      onChange={(e) => setClinicForm({ ...clinicForm, latitude: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="admin-form-label">Longitude</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="e.g. 71.8083"
                      value={clinicForm.longitude !== undefined && clinicForm.longitude !== null ? clinicForm.longitude : ''}
                      onChange={(e) => setClinicForm({ ...clinicForm, longitude: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-full">
                    <label className="admin-form-label">Google Maps Link</label>
                    <input
                      type="url"
                      className="admin-input"
                      placeholder="e.g. https://maps.google.com/?q=... or https://maps.app.goo.gl/..."
                      value={clinicForm.google_maps_url || ''}
                      onChange={(e) => handleMapUrlChange(e.target.value, 'edit')}
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
              <p className="admin-modal-loading">Loading admin details...</p>
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
