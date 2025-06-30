import { z } from 'zod';

export const confirmForgotPasswordSchema = z.object({
  email: z.string().min(1, { message: '"email" is required' }),
  password: z.string().min(8, { message: '"password" should be at least 8 characters long' }),
  confirmationCode: z.string().min(1, { message: '"confirmationCode" is required' }),
});

export type ConfirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema>;
