'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from './DoctorSidebar';
import DoctorDashboard from './DoctorDashboard';
import DoctorProfile from './DoctorProfile';
import DoctorSchedule from './DoctorSchedule';
import DoctorAppointments from './DoctorAppointments';
import DoctorAchievements from './DoctorAchievements';

const TAB_COMPONENTS = {
  dashboard: DoctorDashboard,
  profile: DoctorProfile,
  schedule: DoctorSchedule,
  appointments: DoctorAppointments,
  achievements: DoctorAchievements,
};

export default function DoctorPanel() {
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
