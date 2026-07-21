'use client';
import { useRouter } from 'next/navigation';
import SuperAdminSidebar from './SuperAdminSidebar';
import { clearUserSession } from '@/utils/auth';

export default function SuperAdminPanelLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    clearUserSession();
    router.replace('/login');
  };

  return (
    <div className="admin-panel-layout">
      <SuperAdminSidebar onLogout={handleLogout} />
      <main className="admin-panel-main">
        {children}
      </main>
    </div>
  );
}
