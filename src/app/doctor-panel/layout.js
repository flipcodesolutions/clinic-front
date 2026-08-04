import '@/css/Doctor.css';
import DoctorPanelShell from '@/components/doctor/DoctorPanelShell';
import DoctorPanelLayout from '@/components/doctor/DoctorPanelLayout';

export const metadata = {
  title: 'Doctor Panel - Medi Growth',
  description: 'Manage your doctor profile, schedule, appointments and achievements.',
};

export default function DoctorLayout({ children }) {
  return (
    <DoctorPanelShell>
      <DoctorPanelLayout>{children}</DoctorPanelLayout>
    </DoctorPanelShell>
  );
}

