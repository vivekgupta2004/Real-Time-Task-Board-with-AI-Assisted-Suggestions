'use client';

import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useNotificationStore } from '@/store/useNotificationStore';
import NotificationCard from '@/components/notification/NotificationCard';
import { Bell, CheckCheck, BellOff } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, fetchNotifications, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto w-full px-2 sm:px-0 py-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-slate-900 leading-tight">Notifications</h1>
                <p className="text-xs text-slate-500">Stay updated on task deadlines & status updates</p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all as read</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-1">
                  <BellOff className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-800">All Caught Up!</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  You don't have any notifications at the moment. Real-time updates will appear here automatically.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationCard key={notif._id} notification={notif} />
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

