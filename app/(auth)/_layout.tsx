import { Redirect, Stack } from "expo-router";
import { Header } from "@/components/nav/header";
import { authClient } from "@/lib/auth/client";

export default function AuthLayoutLayout() {
  const { data } = authClient.useSession();

  if (data) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen name="send-otp" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ title: "" }} />
    </Stack>
  );
}
