import { z } from 'zod';

export const signUpChema = z.object({
  account: z.object({
    email: z.string().min(1, { message: '"email" is required' }).email('Invalid email'),
    password: z.string().min(8, { message: '"password" should be at least 8 characters long' }),
  }),
});

export type SignUpBody = z.infer<typeof signUpChema>;
