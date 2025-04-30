import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/components/auth/provider";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import "@/lib/i18n/client";
import { darkTheme, lightTheme } from "@/lib/ui/theme";

export default function RootLayout() {
  const theme = useColorScheme();

  return (
    <PaperProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(protected)" options={{ animation: "none" }} />
          <Stack.Screen name="(auth)" options={{ animation: "none" }} />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
