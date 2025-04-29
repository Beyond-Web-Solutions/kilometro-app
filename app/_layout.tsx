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
        <Stack>
          <Stack.Screen
            name="(protected)"
            options={{ headerShown: false, animation: "none" }}
          />

          <Stack.Screen
            name="auth"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="otp"
            options={{ header: (props) => <Header {...props} />, title: "" }}
          />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
