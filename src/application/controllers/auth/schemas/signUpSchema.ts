import { Profile } from '@application/entities/Profile';
import { z } from 'zod';

export const signUpChema = z.object({
  account: z.object({
    email: z
      .string()
      .min(1, { message: '"email" is required' })
      .email('Invalid email'),
    password: z
      .string()
      .min(8, { message: '"password" should be at least 8 characters long' }),
  }),
  profile: z.object({
    name: z.string().min(1, '"name" is requited'),
    birthDate: z
      .string()
      .min(1, '"birthDate" is requited')
      .date('"birthDate should be a valid date (YYYY-MM-DD)"')
      .transform((date) => new Date(date)),
    gender: z.nativeEnum(Profile.Gender),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.nativeEnum(Profile.ActivityLevel),
    goal: z.nativeEnum(Profile.Goal),
  }),
});

export type SignUpBody = z.infer<typeof signUpChema>;
