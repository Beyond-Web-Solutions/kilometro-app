import { Redirect, Stack } from "expo-router";
import { Header } from "@/components/nav/header";
import { useContext } from "react";
import { AuthContext } from "@/components/auth/provider";

export default function AuthLayoutLayout() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen name="send-otp" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ title: "" }} />
    </Stack>
  );
}
