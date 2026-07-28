import { z } from 'zod';

export const subtaskInputSchema = z.object({
  _id: z.string().optional(),
  title: z
    .string({ required_error: 'Subtask title is required' })
    .trim()
    .min(1, 'Subtask title cannot be empty')
    .max(100, 'Subtask title cannot exceed 100 characters'),
  completed: z.boolean().optional().default(false),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z
    .string({ required_error: 'Due date is required' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
    .refine((val) => new Date(val) > new Date(), { message: 'Due date must be in the future' }),
  subtasks: z.array(subtaskInputSchema).optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' })
    .refine((val) => new Date(val) > new Date(), { message: 'Due date must be in the future' })
    .optional(),
  subtasks: z.array(subtaskInputSchema).optional(),
});

export const createSubtaskSchema = z.object({
  title: z
    .string({ required_error: 'Subtask title is required' })
    .trim()
    .min(1, 'Subtask title is required')
    .max(100, 'Subtask title cannot exceed 100 characters'),
});

export const updateSubtaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Subtask title cannot be empty')
    .max(100, 'Subtask title cannot exceed 100 characters')
    .optional(),
  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>;
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>;

