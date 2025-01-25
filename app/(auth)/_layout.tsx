import { Stack } from "expo-router";
import { useAuthState } from "@/hooks/use-auth-state";

export default function AuthLayout() {
  useAuthState();

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
}
