'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserAuth } from '@/utils/auth';
import PanelLoader from '@/components/common/PanelLoader';

export default function PatientPanelShell({ children }) {
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

    const isPatient =
      user.role === 'patient' || user.roles?.includes('patient');

    if (!isPatient) {
      router.replace('/login');
      return;
    }

    Promise.resolve().then(() => {
      setAuthed(true);
      setLoading(false);
    });
  }, [router]);

  if (loading || !authed) {
    return <PanelLoader />;
  }

  return <>{children}</>;
}
