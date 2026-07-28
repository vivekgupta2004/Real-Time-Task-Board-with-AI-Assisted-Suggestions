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

export const isMeaningfulText = (text?: string | null, minLength: number = 3): boolean => {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < minLength) return false;

  if (!/[a-zA-Z]/.test(trimmed)) return false;

  // Single character repetition (e.g., 'aaaa', '1111', '----', '....')
  if (/^(.)\1+$/i.test(trimmed)) return false;

  // Substring pattern repetition (e.g., 'asdfasdfasdf', 'abcabcabc')
  if (/(.{3,})\1+/i.test(trimmed)) return false;

  // Common keyboard mashing sequences
  const mashingPatterns = [
    /asdf/i,
    /sdfg/i,
    /dfgh/i,
    /fghj/i,
    /ghjk/i,
    /hjkl/i,
    /qwert/i,
    /werty/i,
    /ertyu/i,
    /rtyui/i,
    /zxcv/i,
    /xcvb/i,
    /cvbn/i,
    /vbnm/i,
  ];

  if (trimmed.length < 25 && mashingPatterns.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  // 5 or more consecutive consonants (e.g., 'sdfghjkl', 'qwrtp', 'zxcvb')
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(trimmed)) return false;

  // Vowel presence in words >= 4 letters
  const words = trimmed.split(/\s+/).filter((w) => w.length >= 3);
  for (const word of words) {
    const lettersOnly = word.replace(/[^a-zA-Z]/g, '');
    if (lettersOnly.length >= 4) {
      const vowelCount = (lettersOnly.match(/[aeiouy]/gi) || []).length;
      if (vowelCount === 0) return false;
    }
  }

  return true;
};

export const validateAiTitle = (title?: string | null): boolean => {
  return isMeaningfulText(title, 3);
};

export const validateAiDescription = (desc?: string | null): boolean => {
  return isMeaningfulText(desc, 10);
};


