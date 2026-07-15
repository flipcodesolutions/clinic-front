import '@/css/login.css';

export const metadata = {
  title: 'Login - Medi Growth',
  description: 'Sign in to your Medi Growth panel.',
};

// No navbar/footer — ConditionalNav already handles that
export default function LoginLayout({ children }) {
  return <>{children}</>;
}
