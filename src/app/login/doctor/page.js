import LoginForm from '@/components/login/LoginForm';

export const metadata = {
  title: 'Doctor Login - Medi Growth',
};

export default function DoctorLoginPage() {
  return (
    <LoginForm
      role="doctor"
      icon="👨‍⚕️"
      title="Doctor Panel"
      subtitle="Manage your appointments, schedule, profile and achievements — all in one place."
      features={[
        'Set your weekly schedule & slots',
        'Manage patient appointments',
        'Update your doctor profile',
        'Showcase your achievements',
      ]}
      demoEmail="doctor@medigrowth.com"
      demoPassword="doctor123"
      storageKey="doctor_auth"
      redirectTo="/doctor-panel"
      switchTo={{
        label: 'Are you a clinic admin?',
        linkText: 'Clinic Login',
        href: '/login/clinic',
      }}
    />
  );
}
