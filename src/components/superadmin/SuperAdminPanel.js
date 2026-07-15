'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminDashboard from './SuperAdminDashboard';
import ClinicsManager from './ClinicsManager';
import DepartmentsManager from './DepartmentsManager';
import ServicesManager from './ServicesManager';

const TAB_COMPONENTS = {
  dashboard: SuperAdminDashboard,
  clinics: ClinicsManager,
  departments: DepartmentsManager,
  services: ServicesManager,
};

export default function SuperAdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('user_auth');
    router.replace('/login');
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab] || SuperAdminDashboard;

  return (
    <div className="admin-panel-layout">
      <SuperAdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
      />
      <main className="admin-panel-main">
        <ActiveComponent />
      </main>
    </div>
  );
}
