import { Redirect, Stack } from "expo-router";
import { useAppSelector } from "@/src/store/hooks";

export default function AuthLayout() {
  const user = useAppSelector((state) => state.auth.user);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: "none" }} />;
}
