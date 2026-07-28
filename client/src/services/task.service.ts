import api from '@/lib/api';
import { Task } from '@/types/task';
import { TaskFormData } from '@/utils/task.validation';

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data.data;
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
