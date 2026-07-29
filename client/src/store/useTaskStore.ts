import { create } from 'zustand';
import { Task, TaskStatus, PaginationMeta } from '@/types/task';
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

  // Pagination, Filter, Search, Sort states
  page: number;
  limit: number;
  searchQuery: string;
  statusFilter: 'all' | TaskStatus;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  sortBy: string;
  order: 'asc' | 'desc';
  pagination: PaginationMeta;

  // Modal states
  isModalOpen: boolean;
  modalMode: 'create' | 'edit';
  selectedTask: Task | null;
  isDeleteModalOpen: boolean;
  taskToDelete: Task | null;

  // View mode state (Kanban vs Grid)
  viewMode: 'kanban' | 'grid';
  setViewMode: (mode: 'kanban' | 'grid') => void;

  fetchTasks: () => Promise<void>;
  createTask: (data: TaskFormData & { subtasks?: any[] }) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskFormData> & { status?: TaskStatus; subtasks?: any[] }) => Promise<void>;

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

  setPage: (page: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: 'all' | TaskStatus) => void;
  setPriorityFilter: (filter: 'all' | 'low' | 'medium' | 'high') => void;
  setSort: (sortBy: string, order: 'asc' | 'desc') => void;

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

  page: 1,
  limit: 9,
  searchQuery: '',
  statusFilter: 'all',
  priorityFilter: 'all',
  sortBy: 'createdAt',
  order: 'desc',
  pagination: {
    page: 1,
    limit: 9,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },


  isModalOpen: false,
  modalMode: 'create',
  selectedTask: null,
  isDeleteModalOpen: false,
  taskToDelete: null,

  viewMode: 'kanban',
  setViewMode: (mode) => set({ viewMode: mode }),

  fetchTasks: async () => {

    set({ isLoading: true, error: null });
    try {
      const { page, limit, searchQuery, statusFilter, priorityFilter, sortBy, order } = get();
      const result = await fetchTasksApi({
        page,
        limit,
        search: searchQuery,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        order,
      });
      set({ tasks: result.tasks, pagination: result.pagination, isLoading: false });
    } catch (err: any) {
      const message = err.message || err.errors?.[0]?.message || 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  createTask: async (data) => {
    set({ isSubmitting: true });
    try {
      await createTaskApi(data);
      set({ isSubmitting: false, isModalOpen: false });
      await get().fetchTasks();
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
      set({ isSubmitting: false, isDeleteModalOpen: false, taskToDelete: null });
      await get().fetchTasks();
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
    get().fetchTasks();
  },

  onTaskUpdated: (task) => {
    set({
      tasks: get().tasks.map((t) => (t._id === task._id ? task : t)),
    });
  },

  onTaskDeleted: (taskId) => {
    get().fetchTasks();
  },

  setPage: async (page) => {
    set({ page });
    await get().fetchTasks();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1 });
    get().fetchTasks();
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter, page: 1 });
    get().fetchTasks();
  },

  setPriorityFilter: (filter) => {
    set({ priorityFilter: filter, page: 1 });
    get().fetchTasks();
  },

  setSort: (sortBy, order) => {
    set({ sortBy, order, page: 1 });
    get().fetchTasks();
  },

  openCreateModal: () => set({ isModalOpen: true, modalMode: 'create', selectedTask: null }),
  openEditModal: (task) => set({ isModalOpen: true, modalMode: 'edit', selectedTask: task }),
  closeModal: () => set({ isModalOpen: false, selectedTask: null }),
  openDeleteModal: (task) => set({ isDeleteModalOpen: true, taskToDelete: task }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, taskToDelete: null }),
}));

