'use client';

import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useAuthStore } from '@/store/useAuthStore';
import NotificationBadge from './NotificationBadge';
import NotificationDropdown from './NotificationDropdown';

export const NotificationBell = () => {
  const { isAuthenticated } = useAuthStore();
  const { unreadCount, toggleOpen, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        <NotificationBadge count={unreadCount} />
      </button>

      <NotificationDropdown />
    </div>
  );
};

export default NotificationBell;
