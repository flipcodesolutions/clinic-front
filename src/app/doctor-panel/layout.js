import '@/css/Doctor.css';
import DoctorPanelShell from '@/components/doctor/DoctorPanelShell';

export const metadata = {
  title: 'Doctor Panel - Medi Growth',
  description: 'Manage your doctor profile, schedule, appointments and achievements.',
};

export default function DoctorPanelLayout({ children }) {
  return <DoctorPanelShell>{children}</DoctorPanelShell>;
}
