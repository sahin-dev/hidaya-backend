import { z } from 'zod';
import { PRAYER_NAMES } from './prayer.constant';

const prayerSchema = z.object({
  body: z.object({
    date: z.coerce.date({
      required_error: 'Date is required.',
      invalid_type_error: 'Must be a valid date string.',
    }),

    prayerName: z.enum([...(Object.values(PRAYER_NAMES) as [string])], {
      required_error: 'Prayer name is required.',
      invalid_type_error: `Prayer name must be one of: ${Object.values(
        PRAYER_NAMES
      ).join(', ')}`,
    }),

    time: z
      .string({
        required_error: 'Time is required.',
      })
      .regex(/^\d{1,2}:\d{2}(\s*(AM|PM))?$/i, {
        message: 'Invalid time format. Use HH:MM or HH:MM AM/PM.',
      }),

    isComplete: z.boolean({
      required_error: 'Completion status is required.',
    }),
  }),
});

export const PrayerValidation = {
  prayerSchema,
};
