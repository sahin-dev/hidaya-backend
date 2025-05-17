import { z } from 'zod';

const cteateSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: 'Terms content is required' })
      .min(100, 'Terms content is too short')
      .max(100000, 'Terms content is too long'),
  }),
});

export const TermsValidation = {
  cteateSchema,
};
