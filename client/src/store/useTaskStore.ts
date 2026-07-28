import { create } from 'zustand';
import { Task, TaskStatus } from '@/types/task';
import { fetchTasksApi } from '@/services/task.service';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: 'all' | TaskStatus;
  fetchTasks: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | TaskStatus) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await fetchTasksApi();
      set({ tasks, isLoading: false });
    } catch (err: any) {
      const message = err.message || err.errors?.[0]?.message || 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
}));
