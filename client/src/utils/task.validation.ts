import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description is required')
    .max(1000, 'Description cannot exceed 1000 characters'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z
    .string({ required_error: 'Due date is required' })
    .min(1, 'Due date is required')
    .refine((val) => new Date(val) > new Date(), { message: 'Due date must be in the future' }),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
