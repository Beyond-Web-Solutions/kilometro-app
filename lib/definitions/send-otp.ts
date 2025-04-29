import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.string().email(),
});

export type SendOtpFormData = z.infer<typeof sendOtpSchema>;
