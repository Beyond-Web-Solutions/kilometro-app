import { Stack } from "expo-router";
import { StackHeader } from "@/components/nav/stack-header";
import { useTranslation } from "react-i18next";

export default function VehiclesLayout() {
  const { t } = useTranslation("vehicles");

  return (
    <Stack screenOptions={{ header: (props) => <StackHeader {...props} /> }}>
      <Stack.Screen
        key="index"
        name="index"
        options={{ headerTitle: t("list.title") }}
      />
      <Stack.Screen key="[id]" name="[id]" />
    </Stack>
  );
}
