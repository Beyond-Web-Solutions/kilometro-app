import { createContext, PropsWithChildren, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { SplashScreen } from "expo-router";
import { User } from "better-auth";

// Prevent the splash screen from auto-hiding until we know the auth state
SplashScreen.preventAutoHideAsync();

type AuthState = {
  user?: User;
  isPending: boolean;
};

export const AuthContext = createContext<AuthState>({
  isPending: true,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      // Hide the splash screen once we know the auth state
      SplashScreen.hideAsync();
    }
  }, [isPending]);

  return (
    <AuthContext.Provider value={{ user: session?.user, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}
