import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/components/auth/provider";
import { PaperProvider } from "react-native-paper";
import "@/lib/i18n/client";
import Header from "@/components/nav/header";

export default function RootLayout() {
  return (
    <PaperProvider>
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
