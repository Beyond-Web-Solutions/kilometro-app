import { Stack } from "expo-router";
import { Header } from "@/components/nav/header";
import { useTranslation } from "react-i18next";

export default function OnboardLayout() {
  const { t } = useTranslation("onboard");

  return (
    <Stack screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen key="index" name="index" options={{ headerShown: false }} />
      <Stack.Screen
        key="create-org"
        name="create-org"
        options={{
          headerTitle: t("create.header-title"),
        }}
      />
      <Stack.Screen
        key="join-org"
        name="join-org"
        options={{
          headerTitle: t("join.header-title"),
        }}
      />
      <Stack.Screen
        key="permissions"
        name="permissions"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
