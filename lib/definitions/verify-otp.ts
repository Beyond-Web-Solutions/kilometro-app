import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
