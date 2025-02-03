import { z } from "zod";

export const signInFactorOneSchema = z.object({
  email: z.string().email("invalid-email"),
  password: z.string().min(8, { message: "password-too-short" }),
});

export type SignInFactorOneFormData = z.infer<typeof signInFactorOneSchema>;
