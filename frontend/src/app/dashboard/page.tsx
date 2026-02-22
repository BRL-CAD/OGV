'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/upload');
  }, [router]);

  return null;
};

export default DashboardPage;
