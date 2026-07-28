import api from '@/lib/api';
import { TaskSuggestionParams, AISubtask } from '@/types/ai';

export const generateAISubtasksApi = async (
  params: TaskSuggestionParams
): Promise<AISubtask[]> => {
  const response = await api.post('/ai/task-suggestion', {
    title: params.title,
    description: params.description || '',
  });
  return response.data.data.subtasks;
};
