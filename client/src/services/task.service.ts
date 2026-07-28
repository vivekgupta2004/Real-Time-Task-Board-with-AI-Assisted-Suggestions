import api from '@/lib/api';
import { Task, GetTasksQueryParams, PaginationMeta } from '@/types/task';
import { TaskFormData } from '@/utils/task.validation';

export interface FetchTasksResult {
  tasks: Task[];
  pagination: PaginationMeta;
}

export const fetchTasksApi = async (params?: GetTasksQueryParams): Promise<FetchTasksResult> => {
  const response = await api.get('/tasks', { params });
  return {
    tasks: response.data.data,
    pagination: response.data.pagination || {
      page: 1,
      limit: 9,
      totalItems: response.data.data.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
};



export const createTaskApi = async (data: TaskFormData & { subtasks?: any[] }): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data.data;
};

export const updateTaskApi = async (id: string, data: Partial<TaskFormData> & { subtasks?: any[] }): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data.data;
};

export const completeTaskApi = async (id: string): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}/complete`);
  return response.data.data;
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const addSubtaskApi = async (taskId: string, title: string): Promise<Task> => {
  const response = await api.post(`/tasks/${taskId}/subtasks`, { title });
  return response.data.data;
};

export const updateSubtaskApi = async (
  taskId: string,
  subtaskId: string,
  data: { title?: string; completed?: boolean }
): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
  return response.data.data;
};

export const deleteSubtaskApi = async (taskId: string, subtaskId: string): Promise<Task> => {
  const response = await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  return response.data.data;
};
