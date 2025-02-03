import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email({ message: "invalid-email" }),
    password: z.string().min(8, { message: "password-too-short" }),
    confirm: z.string().min(8, { message: "password-too-short" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "passwords-dont-match",
    path: ["confirm"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
