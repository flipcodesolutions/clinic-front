'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserAuth } from '@/utils/auth';

export default function ClinicPanelShell({ children }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserAuth();
    const token = getAuthToken();

    if (!user || !token) {
      router.replace('/login');
      return;
    }

    const isClinicAdmin =
      user.role === 'clinic' ||
      user.role === 'clinic_admin' ||
      user.roles?.includes('clinic') ||
      user.roles?.includes('clinic_admin');

    if (!isClinicAdmin) {
      router.replace('/login');
      return;
    }

    setAuthed(true);
    setLoading(false);
  }, [router]);

  if (loading || !authed) {
    return (
      <div className="panel-loading">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏥</div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
