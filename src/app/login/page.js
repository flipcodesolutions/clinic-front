import { Suspense } from 'react';
import LoginForm from '@/components/login/LoginForm';

export const metadata = {
  title: 'Login & Register - Medi Growth',
  description: 'Sign in or register for Medi Growth portal. Role-based access.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="panel-loading">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
