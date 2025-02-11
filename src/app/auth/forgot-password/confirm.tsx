import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { VerifyEmailOtpForm } from "@/src/components/auth/otp/email-otp-form";

export default function ConfirmForgotPasswordOTP() {
  const params = useLocalSearchParams<{ email: string }>();

  const { t } = useTranslation("auth", { keyPrefix: "forgot-password-otp" });

  if (!params.email) {
    return <Redirect href="/auth/forgot-password" />;
  }

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      links={[
        {
          label: t("links.back"),
          onPress: () => router.back(),
        },
      ]}
    >
      <VerifyEmailOtpForm
        email={params.email}
        type="recovery"
        onSuccess={() => router.replace("/(tabs)/settings/reset-password")}
      />
    </OnboardAndAuthLayout>
  );
}
