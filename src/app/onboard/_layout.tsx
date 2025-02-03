import { Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";

export default function OnboardLayout() {
  const { t } = useTranslation("onboard");

  return (
    <Stack screenOptions={{ header: (props) => <StackHeader {...props} /> }}>
      <Stack.Screen key="index" name="index" options={{ headerShown: false }} />

      <Stack.Screen
        key="create-vehicles"
        name="create-vehicles"
        options={{
          headerTitle: t("create-vehicles.header-title"),
        }}
      />
    </Stack>
  );
}
