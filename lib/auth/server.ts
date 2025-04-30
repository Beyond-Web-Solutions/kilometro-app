import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import { emailOTP, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    expo(),
    organization(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(otp, email);
      },
    }),
  ],
});
