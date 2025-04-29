import { Stack } from "expo-router";
import Header from "@/components/nav/header";

export default function AuthLayoutLayout() {
  return (
    <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen name="send-otp" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ title: "" }} />
    </Stack>
  );
}
