import { Redirect, Stack } from "expo-router";

const isLoggedIn = false; // Simulate user login status

export default function ProtectedLayout() {
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}
