import { Redirect, Stack, usePathname } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/components/auth/provider";

export default function ProtectedLayout() {
  const pathname = usePathname();
  const { user, isPending } = useContext(AuthContext);

  if (isPending) {
    return null;
  }

  if (!user) {
    return <Redirect href={`/(auth)/send-otp?next=${pathname}`} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
