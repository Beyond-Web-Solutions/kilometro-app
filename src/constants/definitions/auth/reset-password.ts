import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "password-too-short" }),
    confirm: z.string().min(8, { message: "password-too-short" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "passwords-dont-match",
    path: ["confirm"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
