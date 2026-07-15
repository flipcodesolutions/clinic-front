'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClinicSidebar from './ClinicSidebar';
import ClinicDashboard from './ClinicDashboard';
import DoctorsManager from './DoctorsManager';
import StaffManager from './StaffManager';
import GalleryManager from './GalleryManager';
import AboutManager from './AboutManager';

const TAB_COMPONENTS = {
  dashboard: ClinicDashboard,
  doctors: DoctorsManager,
  staff: StaffManager,
  gallery: GalleryManager,
  about: AboutManager,
};

export default function ClinicPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('user_auth');
    router.replace('/login');
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab] || ClinicDashboard;

  return (
    <div className="clinic-panel-layout">
      <ClinicSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
      />
      <main className="clinic-panel-main">
        <ActiveComponent />
      </main>
    </div>
  );
}
