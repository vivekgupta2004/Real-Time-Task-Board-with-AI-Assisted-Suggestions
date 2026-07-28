'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
};

export default AuthProvider;
