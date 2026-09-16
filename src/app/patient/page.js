import PatientDashboard from '@/components/patient/PatientDashboard';

export const metadata = {
  title: 'My Health - Medi Growth',
  description: 'Patient health portal, bookings, prescriptions, and family profiles.',
};

export default function PatientPage() {
  return <PatientDashboard />;
}
