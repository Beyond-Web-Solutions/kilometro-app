import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import {
  emailOTPClient,
  organizationClient,
  jwtClient,
} from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    expoClient({
      scheme: "kilometro",
      storagePrefix: "kilometro",
      storage: SecureStore,
    }),
    jwtClient(),
    emailOTPClient(),
    organizationClient(),
  ],
});
