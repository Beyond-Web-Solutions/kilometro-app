import { createContext, PropsWithChildren, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { SplashScreen } from "expo-router";
import { User } from "better-auth";
import { Organization } from "better-auth/plugins";

// Prevent the splash screen from auto-hiding until we know the auth state
SplashScreen.preventAutoHideAsync();

type AuthState = {
  user?: User;
  organizationId?: string;
  isPending: boolean;
};

export const AuthContext = createContext<AuthState>({
  isPending: true,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { data: organization, isPending: isOrganizationPending } =
    authClient.useActiveOrganization();

  useEffect(() => {
    if (!isSessionPending && !isOrganizationPending) {
      // Hide the splash screen once we know the auth state
      SplashScreen.hideAsync();
    }
  }, [isSessionPending, isOrganizationPending]);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        organizationId: organization?.id,
        isPending: isSessionPending || isOrganizationPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
