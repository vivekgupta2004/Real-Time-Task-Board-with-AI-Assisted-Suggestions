'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function TasksPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Redirecting to Dashboard...</p>
      </div>
    </ProtectedRoute>
  );
}
