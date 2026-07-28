import api from '@/lib/api';
import { GetTasksResponse, Task } from '@/types/task';
import { TaskFormData } from '@/utils/task.validation';

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await api.get<GetTasksResponse>('/tasks');
  return response.data.data;
};

export const createTaskApi = async (data: TaskFormData): Promise<Task> => {
  const response = await api.post<{ success: boolean; data: Task }>('/tasks', data);
  return response.data.data;
};

export const updateTaskApi = async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
  const response = await api.put<{ success: boolean; data: Task }>(`/tasks/${id}`, data);
  return response.data.data;
};

export const completeTaskApi = async (id: string): Promise<Task> => {
  const response = await api.patch<{ success: boolean; data: Task }>(`/tasks/${id}/complete`);
  return response.data.data;
};

export const deleteTaskApi = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
