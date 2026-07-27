'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserAuth } from '@/utils/auth';

export default function ClinicPanelShell({ children }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      const user = getUserAuth();
      const token = getAuthToken();

      if (!user && !token) {
        setAuthed(true);
        setLoading(false);
        return;
      }

      setAuthed(true);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🏥</div>
          <p style={{ color: '#0d9488', fontWeight: 600 }}>Loading Clinic Panel...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
