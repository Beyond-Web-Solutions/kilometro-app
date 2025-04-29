import { Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { AuthFormData, authSchema } from "@/lib/definitions/auth";
import { zodResolver } from "@hookform/resolvers/zod/src";
import { useCallback } from "react";
import { TextInput } from "@/components/common/form/text-input";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "expo-router";

export function AuthForm() {
  const router = useRouter();
  const { t } = useTranslation("auth", { keyPrefix: "auth.form" });

  const { handleSubmit, control, formState, reset } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(async (values: AuthFormData) => {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "sign-in", // or "email-verification", "forget-password"
    });

    if (error) {
      console.error("Error sending OTP:", error);
    }

    if (data) {
      router.push("/otp");
      reset();
    }
  }, []);

  return (
    <View style={styles.form}>
      <TextInput<AuthFormData>
        name="email"
        control={control}
        label={t("email.label")}
        placeholder={t("email.placeholder")}
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
