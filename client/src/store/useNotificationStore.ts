import { create } from 'zustand';
import { AppNotification } from '@/types/notification';
import { fetchNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from '@/services/notification.service';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isOpen: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  onNewNotification: (notification: AppNotification) => void;
  onNotificationRead: (id: string) => void;
  onNotificationReadAll: () => void;
  toggleOpen: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isOpen: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchNotificationsApi();
      const unread = data.filter((n) => !n.isRead).length;
      set({ notifications: data, unreadCount: unread, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const notifs = get().notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n));
      const unread = notifs.filter((n) => !n.isRead).length;
      set({ notifications: notifs, unreadCount: unread });
      await markNotificationReadApi(id);
    } catch (error) {
      console.error('Failed to mark notification read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const notifs = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications: notifs, unreadCount: 0 });
      await markAllNotificationsReadApi();
    } catch (error) {
      console.error('Failed to mark all notifications read:', error);
    }
  },

  onNewNotification: (notification: AppNotification) => {
    const exists = get().notifications.some((n) => n._id === notification._id);
    if (!exists) {
      const notifs = [notification, ...get().notifications];
      const unread = notifs.filter((n) => !n.isRead).length;
      set({ notifications: notifs, unreadCount: unread });
    }
  },

  onNotificationRead: (id: string) => {
    const notifs = get().notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n));
    const unread = notifs.filter((n) => !n.isRead).length;
    set({ notifications: notifs, unreadCount: unread });
  },

  onNotificationReadAll: () => {
    const notifs = get().notifications.map((n) => ({ ...n, isRead: true }));
    set({ notifications: notifs, unreadCount: 0 });
  },

  toggleOpen: () => set({ isOpen: !get().isOpen }),
  setOpen: (isOpen) => set({ isOpen }),
}));
