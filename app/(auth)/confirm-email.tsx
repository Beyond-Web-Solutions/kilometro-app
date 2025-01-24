import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { VerifyEmailOtpForm } from "@/components/auth/otp/email-otp-form";
import { useCallback } from "react";
import { OnboardAndAuthLayout } from "@/components/_common/layout/onboard";

export default function OTPPage() {
  const params = useLocalSearchParams<{ email: string }>();

  const { t } = useTranslation("auth", { keyPrefix: "otp.sign-up" });

  if (!params.email) {
    return <View />;
  }

  const handleOnSuccess = useCallback(() => {
    router.replace("/onboard");
  }, []);

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
        onSuccess={handleOnSuccess}
      />
    </OnboardAndAuthLayout>
  );
}
