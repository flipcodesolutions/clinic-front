import '@/css/Patient.css';
import PatientPanelShell from '@/components/patient/PatientPanelShell';
import PatientPanelLayout from '@/components/patient/PatientPanelLayout';

export const metadata = {
  title: 'Patient Portal - Medi Growth',
  description: 'Book appointments, search doctors & clinics, view medical records.',
};

export default function Layout({ children }) {
  return (
    <PatientPanelShell>
      <PatientPanelLayout>{children}</PatientPanelLayout>
    </PatientPanelShell>
  );
}
