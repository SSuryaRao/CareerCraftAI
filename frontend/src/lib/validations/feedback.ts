import { z } from 'zod';

export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature_request', 'general', 'improvement', 'complaint'], {
    required_error: 'Please select a feedback type',
  }),
  category: z.enum(['ui_ux', 'performance', 'feature', 'content', 'other'], {
    required_error: 'Please select a category',
  }),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(150, 'Subject must not exceed 150 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
  email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5')
    .optional()
    .nullable(),
  pageUrl: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  attachments: z
    .array(
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File size must be less than 5MB',
      })
    )
    .max(3, 'Maximum 3 files allowed')
    .optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const feedbackTypeLabels: Record<FeedbackFormData['type'], string> = {
  bug: 'Bug Report',
  feature_request: 'Feature Request',
  general: 'General Feedback',
  improvement: 'Improvement Suggestion',
  complaint: 'Complaint',
};

export const feedbackCategoryLabels: Record<FeedbackFormData['category'], string> = {
  ui_ux: 'UI/UX',
  performance: 'Performance',
  feature: 'Feature',
  content: 'Content',
  other: 'Other',
};
