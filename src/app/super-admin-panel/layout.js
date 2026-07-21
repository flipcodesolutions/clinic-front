import '@/css/SuperAdmin.css';
import SuperAdminPanelShell from '@/components/superadmin/SuperAdminPanelShell';
import SuperAdminPanelLayout from '@/components/superadmin/SuperAdminPanelLayout';

export const metadata = {
  title: 'Super Admin Panel - Medi Growth',
  description: 'Manage clinics, departments, services and overall system configuration.',
};

export default function SuperAdminLayout({ children }) {
  return (
    <SuperAdminPanelShell>
      <SuperAdminPanelLayout>{children}</SuperAdminPanelLayout>
    </SuperAdminPanelShell>
  );
}
