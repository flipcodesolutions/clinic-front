'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminPanelShell({ children }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('user_auth');
    if (!raw) {
      router.replace('/login');
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (user.role !== 'superadmin') {
        router.replace('/login');
        return;
      }
      setAuthed(true);
      setLoading(false);
    } catch (e) {
      router.replace('/login');
    }
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
