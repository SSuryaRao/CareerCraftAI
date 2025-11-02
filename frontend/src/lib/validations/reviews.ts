import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating must not exceed 5'),
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must not exceed 100 characters'),
  review: z
    .string()
    .min(50, 'Review must be at least 50 characters')
    .max(1000, 'Review must not exceed 1000 characters'),
  userRole: z.string().optional().default('User'),
  aspectRatings: z
    .object({
      features: z.number().min(1).max(5).optional().nullable(),
      support: z.number().min(1).max(5).optional().nullable(),
      easeOfUse: z.number().min(1).max(5).optional().nullable(),
      valueForMoney: z.number().min(1).max(5).optional().nullable(),
    })
    .optional(),
  platform: z.enum(['web', 'mobile', 'desktop']).default('web'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const userRoleOptions = [
  'Student',
  'Professional',
  'Career Changer',
  'Recent Graduate',
  'Job Seeker',
  'Entrepreneur',
  'Other',
];

export const aspectRatingLabels = {
  features: 'Features',
  support: 'Customer Support',
  easeOfUse: 'Ease of Use',
  valueForMoney: 'Value for Money',
};
