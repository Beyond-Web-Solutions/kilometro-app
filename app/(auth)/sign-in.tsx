import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { SignInForm } from "@/components/auth/sign-in/form";
import { router } from "expo-router";
import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";

export default function SignInPage() {
  const { colors } = useTheme();
  const { t } = useTranslation("auth", { keyPrefix: "sign-in" });

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      links={[
        {
          label: t("links.forgot-password"),
          onPress: () => router.navigate("/(auth)/sign-up"),
        },
        {
          label: t("links.no-account"),
          onPress: () => router.navigate("/(auth)/sign-up"),
        },
      ]}
    >
      <SignInForm />
    </OnboardAndAuthLayout>
  );
}
