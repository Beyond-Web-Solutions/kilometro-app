import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
