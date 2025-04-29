import { PropsWithChildren, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { SplashScreen } from "expo-router";

// Prevent the splash screen from auto-hiding until we know the auth state
SplashScreen.preventAutoHideAsync();

export function AuthProvider({ children }: PropsWithChildren) {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hide();

      console.log(session);
    }
  }, [isPending, session]);

  return children;
}
