'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTaskStore } from '@/store/useTaskStore';
import { initSocket, disconnectSocket } from '@/lib/socket';
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

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      disconnectSocket();
      return;
    }

    const socket = initSocket(accessToken);

    const handleCreated = (payload: any) => {
      const task = unwrapTask(payload);
      if (task && task._id) {
        onTaskCreated(task);
        toast.success(`Task created: "${task.title}"`, { id: `task-create-${task._id}` });
      }
    };

    const handleUpdated = (payload: any) => {
      const task = unwrapTask(payload);
      if (task && task._id) {
        onTaskUpdated(task);
        if (task.status === 'completed') {
          toast.dismiss(`task-update-${task._id}`);
          toast.success(`Task completed: "${task.title}"`, { id: `task-complete-${task._id}` });
        } else {
          toast.success(`Task updated: "${task.title}"`, { id: `task-update-${task._id}` });
        }
      }
    };

    const handleDeleted = (payload: any) => {
      const taskId = payload?.data?.taskId || payload?.taskId || payload?.data || payload;
      if (taskId) {
        const id = typeof taskId === 'object' ? taskId.taskId || taskId._id : taskId;
        if (id) {
          onTaskDeleted(id);
          toast.success('Task deleted', { id: `task-delete-${id}` });
        }
      }
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
    };
  }, [isAuthenticated, accessToken, onTaskCreated, onTaskUpdated, onTaskDeleted]);

  return <>{children}</>;
};

export default SocketProvider;
