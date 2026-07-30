'use client';
import { useState, useEffect } from 'react';
import DoctorPanelLayout from '@/components/doctor/DoctorPanelLayout';
import DoctorDashboard from '@/components/doctor/DoctorDashboard';
import DoctorProfile from '@/components/doctor/DoctorProfile';
import DoctorSchedule from '@/components/doctor/DoctorSchedule';
import DoctorAppointments from '@/components/doctor/DoctorAppointments';
import DoctorAchievements from '@/components/doctor/DoctorAchievements';
import { getDoctorProfile } from '@/services/doctor/doctorService';

const TAB_COMPONENTS = {
  dashboard: DoctorDashboard,
  profile: DoctorProfile,
  schedule: DoctorSchedule,
  appointments: DoctorAppointments,
  achievements: DoctorAchievements,
};

export default function DoctorPanelPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    getDoctorProfile()
      .then((res) => {
        if (res?.success) {
          setDoctorProfile(res.data);
        }
      })
      .catch((err) => console.error('Error loading doctor profile:', err));
  }, []);

  const ActiveComponent = TAB_COMPONENTS[activeTab] || DoctorDashboard;

  return (
    <DoctorPanelLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      doctorProfile={doctorProfile}
    >
      <ActiveComponent />
    </DoctorPanelLayout>
  );
}
