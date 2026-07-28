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
      <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs sm:bg-transparent" onClick={() => setOpen(false)} />
      <div className="fixed inset-x-3 top-16 z-50 sm:absolute sm:right-0 sm:left-auto sm:top-12 sm:w-96 w-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/80 transition"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y divide-slate-100 overscroll-contain">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                <BellOff className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-800">All Caught Up!</p>
              <p className="text-xs text-slate-500">You don't have any notifications right now.</p>
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

