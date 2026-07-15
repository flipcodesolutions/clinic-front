import '@/css/Clinic.css';
import ClinicPanelShell from '@/components/clinic/ClinicPanelShell';

export const metadata = {
  title: 'Clinic Panel - Medi Growth',
  description: 'Manage your clinic dashboard, staff, gallery and more.',
};

export default function ClinicPanelLayout({ children }) {
  return <ClinicPanelShell>{children}</ClinicPanelShell>;
}
