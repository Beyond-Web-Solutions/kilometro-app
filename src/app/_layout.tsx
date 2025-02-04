import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppState, useColorScheme } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import { AuthErrorToast } from "@/src/components/auth/error-toast";
import * as SplashScreen from "expo-splash-screen";
import { darkTheme, lightTheme } from "@/src/constants/ui/themes";
import { SplashScreenProvider } from "@/src/components/splash-screen-provider";
import { ErrorToast } from "@/src/components/_common/error-toast";
import "react-native-reanimated";
import "@/src/lib/i18n";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [theme, setTheme] = useState(lightTheme);

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === "dark") {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  }, [colorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <SplashScreenProvider>
          <StatusBar style="auto" />
          <Slot />
          <AuthErrorToast />
          <ErrorToast />
        </SplashScreenProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
