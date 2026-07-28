import { create } from 'zustand';
import { Task, TaskStatus } from '@/types/task';
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  completeTaskApi,
  deleteTaskApi,
  addSubtaskApi,
  updateSubtaskApi,
  deleteSubtaskApi,
} from '@/services/task.service';
import { TaskFormData } from '@/utils/task.validation';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: 'all' | TaskStatus;

  // Modal states
  isModalOpen: boolean;
  modalMode: 'create' | 'edit';
  selectedTask: Task | null;
  isDeleteModalOpen: boolean;
  taskToDelete: Task | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: TaskFormData & { subtasks?: any[] }) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskFormData> & { subtasks?: any[] }) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Subtask Actions
  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string, completed: boolean) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  // Real-time Socket Event Handlers
  onTaskCreated: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;

  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | TaskStatus) => void;

  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;
  openDeleteModal: (task: Task) => void;
  closeDeleteModal: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  searchQuery: '',
  statusFilter: 'all',

  isModalOpen: false,
  modalMode: 'create',
  selectedTask: null,
  isDeleteModalOpen: false,
  taskToDelete: null,

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

  createTask: async (data) => {
    set({ isSubmitting: true });
    try {
      const newTask = await createTaskApi(data);
      const existing = get().tasks.some((t) => t._id === newTask._id);
      if (!existing) {
        set({ tasks: [newTask, ...get().tasks], isSubmitting: false, isModalOpen: false });
      } else {
        set({ isSubmitting: false, isModalOpen: false });
      }
    } catch (err: any) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  updateTask: async (id, data) => {
    set({ isSubmitting: true });
    try {
      const updatedTask = await updateTaskApi(id, data);
      set({
        tasks: get().tasks.map((t) => (t._id === id ? updatedTask : t)),
        isSubmitting: false,
        isModalOpen: false,
        selectedTask: null,
      });
    } catch (err: any) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  completeTask: async (id) => {
    set({ isSubmitting: true });
    try {
      const completedTask = await completeTaskApi(id);
      set({
        tasks: get().tasks.map((t) => (t._id === id ? completedTask : t)),
        isSubmitting: false,
      });
    } catch (err: any) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  deleteTask: async (id) => {
    set({ isSubmitting: true });
    try {
      await deleteTaskApi(id);
      set({
        tasks: get().tasks.filter((t) => t._id !== id),
        isSubmitting: false,
        isDeleteModalOpen: false,
        taskToDelete: null,
      });
    } catch (err: any) {
      set({ isSubmitting: false });
      throw err;
    }
  },

  addSubtask: async (taskId, title) => {
    try {
      const updatedTask = await addSubtaskApi(taskId, title);
      set({ tasks: get().tasks.map((t) => (t._id === taskId ? updatedTask : t)) });
    } catch (err: any) {
      throw err;
    }
  },

  toggleSubtask: async (taskId, subtaskId, completed) => {
    try {
      const updatedTask = await updateSubtaskApi(taskId, subtaskId, { completed });
      set({ tasks: get().tasks.map((t) => (t._id === taskId ? updatedTask : t)) });
    } catch (err: any) {
      throw err;
    }
  },

  deleteSubtask: async (taskId, subtaskId) => {
    try {
      const updatedTask = await deleteSubtaskApi(taskId, subtaskId);
      set({ tasks: get().tasks.map((t) => (t._id === taskId ? updatedTask : t)) });
    } catch (err: any) {
      throw err;
    }
  },

  // Realtime handlers
  onTaskCreated: (task) => {
    const exists = get().tasks.some((t) => t._id === task._id);
    if (!exists) {
      set({ tasks: [task, ...get().tasks] });
    }
  },

  onTaskUpdated: (task) => {
    set({
      tasks: get().tasks.map((t) => (t._id === task._id ? task : t)),
    });
  },

  onTaskDeleted: (taskId) => {
    set({
      tasks: get().tasks.filter((t) => t._id !== taskId),
    });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),

  openCreateModal: () => set({ isModalOpen: true, modalMode: 'create', selectedTask: null }),
  openEditModal: (task) => set({ isModalOpen: true, modalMode: 'edit', selectedTask: task }),
  closeModal: () => set({ isModalOpen: false, selectedTask: null }),
  openDeleteModal: (task) => set({ isDeleteModalOpen: true, taskToDelete: task }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, taskToDelete: null }),
}));
