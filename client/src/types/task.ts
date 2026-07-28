export type TaskStatus = 'pending' | 'completed';

export interface Subtask {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  dueDate: string;
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
