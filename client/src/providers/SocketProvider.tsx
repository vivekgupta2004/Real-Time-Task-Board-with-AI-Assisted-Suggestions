'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTaskStore } from '@/store/useTaskStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { initSocket, disconnectSocket } from '@/lib/socket';
import { requestNotificationPermission, showBrowserNotification } from '@/utils/notification';
import toast from 'react-hot-toast';

const unwrapTask = (payload: any): any => {
  if (!payload) return null;
  let curr = payload;
  while (curr && typeof curr === 'object' && !curr._id && curr.data) {
    curr = curr.data;
  }
  return curr;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const { onTaskCreated, onTaskUpdated, onTaskDeleted } = useTaskStore();
  const { onNewNotification, onNotificationRead, onNotificationReadAll } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    requestNotificationPermission();

    const socket = initSocket(accessToken);

    const handleCreated = (payload: any) => {
      const task = unwrapTask(payload);
      if (task && task._id) {
        onTaskCreated(task);
      }
    };

    const handleUpdated = (payload: any) => {
      const task = unwrapTask(payload);
      if (task && task._id) {
        onTaskUpdated(task);
      }
    };

    const handleDeleted = (payload: any) => {
      const taskId = payload?.data?.taskId || payload?.taskId || payload?.data || payload;
      if (taskId) {
        const id = typeof taskId === 'object' ? taskId.taskId || taskId._id : taskId;
        if (id) {
          onTaskDeleted(id);
        }
      }
    };

    const handleNotification = (payload: any) => {
      const notification = payload.data || payload;
      if (notification && notification.title) {
        const notifId = notification._id || `notif_${Date.now()}`;
        onNewNotification({
          _id: notifId,
          userId: notification.userId || '',
          title: notification.title,
          message: notification.message || '',
          type: notification.type || 'info',
          isRead: false,
          createdAt: notification.createdAt || new Date().toISOString(),
        });

        showBrowserNotification(notification.title, {
          body: notification.message,
        });

        toast(notification.message || notification.title, {
          icon: '🔔',
          id: `notification-${notifId}`,
        });
      }
    };

    const handleNotificationRead = (payload: any) => {
      const notifId = payload.notificationId || payload._id || payload.id;
      if (notifId) {
        onNotificationRead(notifId);
      }
    };

    const handleNotificationReadAll = () => {
      onNotificationReadAll();
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);
    socket.on('notification:new', handleNotification);
    socket.on('notification:read', handleNotificationRead);
    socket.on('notification:read-all', handleNotificationReadAll);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
      socket.off('notification:new', handleNotification);
      socket.off('notification:read', handleNotificationRead);
      socket.off('notification:read-all', handleNotificationReadAll);
    };
  }, [isAuthenticated, accessToken, onTaskCreated, onTaskUpdated, onTaskDeleted, onNewNotification, onNotificationRead, onNotificationReadAll]);

  return <>{children}</>;
};

export default SocketProvider;
