import { z } from 'zod';

const cteateSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: 'Policy content is required' })
      .min(100, 'Policy content is too short')
      .max(100000, 'Policy content is too long'),
  }),
});

export const PolicyValidation = {
  cteateSchema,
};
