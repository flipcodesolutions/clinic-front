import '@/css/Clinic.css';
import ClinicPanelShell from '@/components/clinic/ClinicPanelShell';
import ClinicPanelLayout from '@/components/clinic/ClinicPanelLayout';

export const metadata = {
  title: 'Clinic Admin Panel - Medi Growth',
  description: 'Manage clinic operations, doctors, staff, gallery, departments and services.',
};

export default function Layout({ children }) {
  return (
    <ClinicPanelShell>
      <ClinicPanelLayout>{children}</ClinicPanelLayout>
    </ClinicPanelShell>
  );
}
