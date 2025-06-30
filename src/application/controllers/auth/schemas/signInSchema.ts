import { z } from 'zod';

export const signInSChema = z.object({
  email: z.string().min(1, { message: '"email" is required' }).email('Invalid email'),
  password: z.string().min(8, { message: '"password" should be at least 8 characters long' }),
});

export type SignInBody = z.infer<typeof signInSChema>;
