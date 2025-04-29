import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
});

export type AuthFormData = z.infer<typeof authSchema>;
