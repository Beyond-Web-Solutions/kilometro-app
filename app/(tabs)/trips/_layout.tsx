import { Stack } from "expo-router";
import { StackHeader } from "@/components/nav/stack-header";
import { useTranslation } from "react-i18next";

export default function TripsLayout() {
  const { t } = useTranslation("trips");

  return (
    <Stack screenOptions={{ header: (props) => <StackHeader {...props} /> }}>
      <Stack.Screen
        key="index"
        name="index"
        options={{ headerTitle: t("overview.title") }}
      />
      <Stack.Screen key="[id]" name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
