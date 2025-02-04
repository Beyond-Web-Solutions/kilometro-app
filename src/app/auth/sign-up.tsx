import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { SignUpForm } from "@/src/components/auth/sign-up/form";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";

export default function SignUpPage() {
  const { t } = useTranslation("auth", { keyPrefix: "sign-up" });

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      links={[
        {
          label: t("links.already-account"),
          onPress: () => router.navigate("/auth/sign-in"),
        },
      ]}
    >
      <SignUpForm />
    </OnboardAndAuthLayout>
  );
}
