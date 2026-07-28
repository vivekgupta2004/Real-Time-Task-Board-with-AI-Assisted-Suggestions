'use client';

import React from 'react';
import { AppNotification } from '@/types/notification';
import { useNotificationStore } from '@/store/useNotificationStore';
import { CheckCircle2, Clock, Info, AlertTriangle } from 'lucide-react';

interface NotificationCardProps {
  notification: AppNotification;
}

const getTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Just now';
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
};

const getIcon = (type: string) => {
  switch (type) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'due_soon':
      return <Clock className="w-4 h-4 text-amber-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <Info className="w-4 h-4 text-indigo-500" />;
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const { markAsRead } = useNotificationStore();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-3.5 border-b border-gray-100 cursor-pointer transition-colors duration-150 flex items-start gap-3 ${
        notification.isRead ? 'bg-white hover:bg-gray-50 opacity-75' : 'bg-indigo-50/50 hover:bg-indigo-50 font-medium'
      }`}
    >
      <div className="mt-0.5 p-1.5 rounded-full bg-white border border-gray-200 shadow-xs">
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className={`text-xs font-semibold truncate ${notification.isRead ? 'text-gray-700' : 'text-gray-900 font-bold'}`}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-400 whitespace-nowrap">
            {getTimeAgo(notification.createdAt)}
          </span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 animate-ping" />
      )}
    </div>
  );
};

export default NotificationCard;
