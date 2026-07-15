'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import DoctorDashboard from '@/components/doctor/DoctorDashboard';
import DoctorProfile from '@/components/doctor/DoctorProfile';
import DoctorSchedule from '@/components/doctor/DoctorSchedule';
import DoctorAppointments from '@/components/doctor/DoctorAppointments';
import DoctorAchievements from '@/components/doctor/DoctorAchievements';

const TAB_COMPONENTS = {
  dashboard: DoctorDashboard,
  profile: DoctorProfile,
  schedule: DoctorSchedule,
  appointments: DoctorAppointments,
  achievements: DoctorAchievements,
};

export default function DoctorPanelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('user_auth');
    router.replace('/login');
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DoctorDashboard;

  return (
    <div className="doctor-panel-layout">
      <DoctorSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="doctor-panel-main">
        <ActiveComponent />
      </main>
    </div>
  );
}
