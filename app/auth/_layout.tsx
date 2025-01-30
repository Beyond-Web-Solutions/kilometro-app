import { Stack } from "expo-router";
import { useAuthState } from "@/hooks/auth/auth-listener";

export default function AuthLayout() {
  useAuthState();

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
}
