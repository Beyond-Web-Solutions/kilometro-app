import { Button } from "react-native-paper";
import { Keyboard, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src";
import { useCallback } from "react";
import { Redirect, useLocalSearchParams } from "expo-router";
import {
  VerifyOtpFormData,
  verifyOtpSchema,
} from "@/lib/definitions/auth/verify-otp";
import { TextInput } from "@/components/common/form/text-input";
import { authClient } from "@/lib/auth/client";
import { Banner } from "react-native-paper";

export function VerifyOtpForm() {
  const params = useLocalSearchParams<{ email: string }>();
  const { t } = useTranslation("auth", { keyPrefix: "verify-otp.form" });

  if (!params.email) {
    return <Redirect href="/(auth)/send-otp" />;
  }

  const { handleSubmit, control, formState, setError } =
    useForm<VerifyOtpFormData>({
      resolver: zodResolver(verifyOtpSchema),
      defaultValues: {
        email: params.email,
        otp: "",
      },
    });

  const onSubmit = useCallback(async (values: VerifyOtpFormData) => {
    Keyboard.dismiss();

    const { data, error } = await authClient.signIn.emailOtp(values);

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    if (data) {
      console.log("OTP verified successfully:", data);
      // Handle successful OTP verification, e.g., redirect to another page
    }
  }, []);

  return (
    <View style={styles.form}>
      <TextInput<VerifyOtpFormData>
        name="otp"
        control={control}
        label={t("otp.label")}
        placeholder={t("otp.placeholder")}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        autoCapitalize="none"
        keyboardType="numeric"
      />
      <Button
        mode="contained"
        loading={formState.isSubmitting}
        disabled={formState.isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        {t("submit")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 16,
    width: "100%",
  },
});
