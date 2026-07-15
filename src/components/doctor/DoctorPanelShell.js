'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorPanelShell({ children }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('user_auth');
    if (!raw) {
      router.replace('/login');
      return;
    }
    const user = JSON.parse(raw);
    if (user.role !== 'doctor') {
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
