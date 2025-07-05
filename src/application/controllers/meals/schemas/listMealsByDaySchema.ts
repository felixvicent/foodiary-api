import { z } from 'zod';

export const ListMealsByDaySchema = z.object({
  date: z
    .string()
    .min(1, '"date" is requited')
    .date('"date" should be a valid date (YYYY-MM-DD)"')
    .transform((date) => new Date(date)),
});
