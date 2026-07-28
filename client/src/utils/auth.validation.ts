import { z } from 'zod';

const allowedEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com|icloud\.com)$/i;

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(
      allowedEmailRegex,
      'Only @gmail.com, @outlook.com, @yahoo.com, @hotmail.com, and @icloud.com emails are accepted'
    ),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(
      allowedEmailRegex,
      'Only @gmail.com, @outlook.com, @yahoo.com, @hotmail.com, and @icloud.com emails are accepted'
    ),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;



