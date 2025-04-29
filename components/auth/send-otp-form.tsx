import { Button } from "react-native-paper";
import { Keyboard, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { SendOtpFormData, sendOtpSchema } from "@/lib/definitions/send-otp";
import { zodResolver } from "@hookform/resolvers/zod/src";
import { useCallback } from "react";
import { TextInput } from "@/components/common/form/text-input";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "expo-router";

export function SendOtpForm() {
  const router = useRouter();
  const { t } = useTranslation("auth", { keyPrefix: "send-otp.form" });

  const { handleSubmit, control, formState, reset } = useForm<SendOtpFormData>({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(async (values: SendOtpFormData) => {
    Keyboard.dismiss();

    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "sign-in",
    });

    if (error) {
      // todo show error message
      console.error("Error sending OTP:", error);
      return;
    }

    if (data) {
      router.push(`/(auth)/verify-otp?email=${values.email}`);
      reset({ email: "" });
    }
  }, []);

  return (
    <View style={styles.form}>
      <TextInput<SendOtpFormData>
        name="email"
        control={control}
        label={t("email.label")}
        placeholder={t("email.placeholder")}
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="go"
        onSubmitEditing={handleSubmit(onSubmit)}
      />
      <Button
        mode="contained"
        icon="login-variant"
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
