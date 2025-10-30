'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isHeadNurse } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (isHeadNurse) {
        router.push('/head-nurse/dashboard');
      } else {
        router.push('/nurse/schedule');
      }
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, isHeadNurse, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Nurse Scheduling System</h1>
        <p className="text-xl">Redirecting...</p>
      </div>
    </div>
  );
}