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

export interface GetTasksResponse {
  success: boolean;
  message?: string;
  data: Task[];
}
