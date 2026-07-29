import { z } from 'zod';

const unsafePattern = /^(?:(?!<script|<iframe|javascript:).)*$/i;

export const taskSuggestionSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .regex(unsafePattern, 'Title contains unsafe HTML or script tags')
    .refine((val) => /[a-zA-Z0-9]/.test(val), {
      message: 'Title must contain valid letters or numbers',
    }),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .regex(unsafePattern, 'Description contains unsafe HTML or script tags')
    .optional()
    .default(''),
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
