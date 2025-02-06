import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { VerifyEmailOtpForm } from "@/src/components/auth/otp/email-otp-form";
import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";

export default function OTPPage() {
  const params = useLocalSearchParams<{ email: string }>();

  const { t } = useTranslation("auth", { keyPrefix: "otp.sign-up" });

  if (!params.email) {
    return null;
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
        type="signup"
        onSuccess={() => router.replace("/onboard")}
      />
    </OnboardAndAuthLayout>
  );
}
