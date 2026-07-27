'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserAuth } from '@/utils/auth';

const CLINIC_ROLES = ['clinic', 'clinic_admin'];

export default function ClinicPanelShell({ children }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.resolve().then(() => {
      const user = getUserAuth();
      const token = getAuthToken();

      // ✅ No session → redirect to login
      if (!user || !token) {
        router.replace('/login');
        return;
      }

      // ✅ Wrong role → redirect to login
      const hasClinicRole = user.roles?.some(r => CLINIC_ROLES.includes(r))
        || CLINIC_ROLES.includes(user.role);

      if (!hasClinicRole) {
        router.replace('/login');
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
