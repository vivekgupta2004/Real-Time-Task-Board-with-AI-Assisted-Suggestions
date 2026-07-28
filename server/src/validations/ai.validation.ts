import { z } from 'zod';

export const taskSuggestionSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title is required'),
  description: z.string().trim().optional().default(''),
});

export type TaskSuggestionInput = z.infer<typeof taskSuggestionSchema>;

export const aiSubtasksResponseSchema = z.object({
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1),
        completed: z.boolean().default(false),
      })
    )
    .min(1, 'At least one subtask is required'),
});

export type AISubtasksResponse = z.infer<typeof aiSubtasksResponseSchema>;
