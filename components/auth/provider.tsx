import { createContext, PropsWithChildren, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { SplashScreen } from "expo-router";
import { User } from "better-auth";

// Prevent the splash screen from auto-hiding until we know the auth state
SplashScreen.preventAutoHideAsync();

export function AuthProvider({ children }: PropsWithChildren) {
  const { isPending: isSessionPending } = authClient.useSession();

  const { isPending: isOrganizationPending } =
    authClient.useActiveOrganization();

  useEffect(() => {
    if (!isSessionPending && !isOrganizationPending) {
      // Hide the splash screen once we know the auth state
      SplashScreen.hideAsync();
    }
  }, [isSessionPending, isOrganizationPending]);

  return children;
}
