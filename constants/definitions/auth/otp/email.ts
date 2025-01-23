import { z } from "zod";

export const emailOtpSchema = z.object({
  email: z.string().email({ message: "invalid-email" }),
  otp: z.string().length(6, { message: "otp-must-be-6-digits" }),
  type: z.enum(
    ["signup", "invite", "magiclink", "recovery", "email_change", "email"],
    { message: "invalid-email-otp-type" },
  ),
});

export type EmailOtpFormData = z.infer<typeof emailOtpSchema>;
