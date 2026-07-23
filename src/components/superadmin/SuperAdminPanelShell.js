'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserAuth } from '@/utils/auth';

export default function SuperAdminPanelShell({ children }) {
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

    const isSuperAdmin =
      user.role === 'super_admin' || user.roles?.includes('super_admin');

    if (!isSuperAdmin) {
      router.replace('/login');
      return;
    }

    Promise.resolve().then(() => {
      setAuthed(true);
      setLoading(false);
    });
  }, [router]);

  if (loading || !authed) {
    return (
      <div className="panel-loading" style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👑</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>Verifying Super Admin...</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
