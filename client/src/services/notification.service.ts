import api from '@/lib/api';
import { AppNotification } from '@/types/notification';

export const fetchNotificationsApi = async (): Promise<AppNotification[]> => {
  const response = await api.get('/notifications');
  return response.data.data;
};

export const markNotificationReadApi = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsReadApi = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};
