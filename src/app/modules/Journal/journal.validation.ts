import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    reflection: z.string({ required_error: 'Reflection is required' }),
    goals: z.string({ required_error: 'Goals is required' }),
    challenges: z.string({ required_error: 'Challenges is required' }),
  }),
});

const updateSchema = z.object({
  body: createSchema.shape.body.partial(),
});

export const JournalValidation = {
  createSchema,
  updateSchema,
};
