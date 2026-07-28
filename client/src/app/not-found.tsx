'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-xl font-bold text-slate-800">404 - Page Not Found</h2>
      <p className="text-sm text-slate-500 mt-2">Redirecting to Home page...</p>
    </div>
  );
}
