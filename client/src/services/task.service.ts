import api from '@/lib/api';
import { GetTasksResponse, Task } from '@/types/task';

export const fetchTasksApi = async (): Promise<Task[]> => {
  const response = await api.get<GetTasksResponse>('/tasks');
  return response.data.data;
};
