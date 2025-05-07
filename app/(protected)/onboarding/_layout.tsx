import { Stack } from "expo-router";
import { Header } from "@/components/nav/header";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen
        name="create-organization"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
