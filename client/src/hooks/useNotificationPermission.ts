import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { requestNotificationPermission } from '@/utils/notification';

export const useNotificationPermission = (): void => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      requestNotificationPermission();
    }
  }, [isAuthenticated]);
};

export default useNotificationPermission;
