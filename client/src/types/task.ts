export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Subtask {
  _id?: string;
  title: string;
  completed: boolean;
  completedAt?: string | null;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  dueDate: string;
  completedAt?: string | null;
  owner: string;
  subtasks?: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalUserTasks?: number;
  pendingCount?: number;
  inProgressCount?: number;
  completedCount?: number;
}


export interface GetTasksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface GetTasksResponse {
  success: boolean;
  message?: string;
  data: Task[];
  pagination?: PaginationMeta;
}

