import LoginForm from '@/components/login/LoginForm';

export const metadata = {
  title: 'Clinic Login - Medi Growth',
};

export default function ClinicLoginPage() {
  return (
    <LoginForm
      role="clinic"
      icon="🏥"
      title="Clinic Panel"
      subtitle="Manage your clinic, staff, gallery and doctor performance all in one place."
      features={[
        'Add and manage staff members',
        'Upload clinic gallery photos',
        'Track all registered doctors',
        'Update clinic information & about',
      ]}
      demoEmail="clinic@medigrowth.com"
      demoPassword="clinic123"
      storageKey="clinic_auth"
      redirectTo="/clinic-panel"
      switchTo={{
        label: 'Are you a doctor?',
        linkText: 'Doctor Login',
        href: '/login/doctor',
      }}
    />
  );
}
