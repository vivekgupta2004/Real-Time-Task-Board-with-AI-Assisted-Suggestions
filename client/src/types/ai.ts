export interface TaskSuggestionParams {
  title: string;
  description?: string;
}

export interface AISubtask {
  title: string;
  completed: boolean;
}

export interface AISubtaskResponse {
  success: boolean;
  data: {
    subtasks: AISubtask[];
  };
}
