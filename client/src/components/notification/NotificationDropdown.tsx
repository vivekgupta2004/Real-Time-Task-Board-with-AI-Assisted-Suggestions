'use client';

import React from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import NotificationCard from './NotificationCard';
import { CheckCheck, BellOff, X } from 'lucide-react';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, isOpen, markAllAsRead, setOpen } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-100 text-red-700 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
              <BellOff className="w-8 h-8 text-gray-300" />
              <p className="text-xs font-medium text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationCard key={notif._id} notification={notif} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
