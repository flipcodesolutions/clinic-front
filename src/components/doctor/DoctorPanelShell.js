'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserAuth } from '@/utils/auth';

export default function DoctorPanelShell({ children }) {
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

    const isDoctor =
      user.role === 'doctor' || user.roles?.includes('doctor');

    if (!isDoctor) {
      router.replace('/login');
      return;
    }

    setAuthed(true);
    setLoading(false);
  }, [router]);

  if (loading || !authed) {
    return (
      <div className="doc-panel-loading">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>👨‍⚕️</div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
