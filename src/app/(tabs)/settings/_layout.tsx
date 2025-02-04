import { Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";

export default function SettingsLayout() {
  const { t } = useTranslation("settings");

  return (
    <Stack screenOptions={{ header: (props) => <StackHeader {...props} /> }}>
      <Stack.Screen
        key="index"
        name="index"
        options={{ headerTitle: t("header-title") }}
      />
      <Stack.Screen
        key="new-organization"
        name="new-organization"
        options={{ headerTitle: t("new-organization.header-title") }}
      />
      <Stack.Screen
        key="members"
        name="members"
        options={{ headerTitle: t("organization.members.overview.page-title") }}
      />
    </Stack>
  );
}
