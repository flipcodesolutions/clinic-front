'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserAuth } from '@/utils/auth';
import PanelLoader from '@/components/common/PanelLoader';

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
      <PanelLoader
       
      />
    );
  }

  return <>{children}</>;
}
