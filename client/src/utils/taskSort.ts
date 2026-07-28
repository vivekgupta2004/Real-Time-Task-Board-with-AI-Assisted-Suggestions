import { Task } from '@/types/task';

const priorityWeight: Record<string, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // 1. Pending tasks first, Completed tasks at the bottom
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }

    // 2. Sort by Due Date & Due Time ascending (nearest deadline first)
    const dA = new Date(a.dueDate).getTime();
    const dB = new Date(b.dueDate).getTime();
    if (dA !== dB) {
      return dA - dB;
    }

    // 3. Priority: High -> Medium -> Low
    const pA = priorityWeight[a.priority || 'medium'] || 2;
    const pB = priorityWeight[b.priority || 'medium'] || 2;
    if (pA !== pB) {
      return pA - pB;
    }

    // 4. Created At descending (newest first)
    const crA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const crB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return crB - crA;
  });
};
