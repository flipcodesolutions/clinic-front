import apiClient from '@/services/apiClient';

// ---- Dashboard Stats & Today's Appointments ----
export async function getClinicDashboardData() {
  try {
    const res = await apiClient.get('/clinic/dashboard');
    if (res?.data?.success) {
      return {
        stats: res.data.stats || {
          todayAppointments: 0,
          doctorsCount: 0,
          staffCount: 0,
          departmentsCount: 0,
          servicesCount: 0,
        },
        appointments: res.data.appointments || [],
        doctors: res.data.doctors || [],
        staff: res.data.staff || [],
      };
    }
  } catch (err) {
    console.error('Error loading clinic dashboard data from API:', err);
  }

  return {
    stats: { todayAppointments: 0, doctorsCount: 0, staffCount: 0, departmentsCount: 0, servicesCount: 0 },
    appointments: [],
    doctors: [],
    staff: [],
  };
}
