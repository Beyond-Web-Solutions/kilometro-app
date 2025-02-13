import { Redirect, Stack } from "expo-router";
import { StackHeader } from "@/src/components/nav/stack-header";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/store/hooks";

export default function OnboardLayout() {
  const { t } = useTranslation("onboard");

  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Redirect href="/auth/sign-in" />;
  }

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
      <Stack.Screen
        key="await-access"
        name="await-access"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        key="switch-org"
        name="switch-org"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
