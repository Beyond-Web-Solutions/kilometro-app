import { Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";
import { ModalHeader } from "@/src/components/nav/modal-header";

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
      <Stack.Screen
        key="join-requests"
        name="join-requests"
        options={{ headerTitle: t("organization.join-requests.header-title") }}
      />
      <Stack.Screen
        key="reset-password"
        name="reset-password"
        options={{
          headerTitle: t("auth.reset-password.header-title"),
          presentation: "fullScreenModal",
          header: (props) => <ModalHeader {...props} />,
        }}
      />
    </Stack>
  );
}
