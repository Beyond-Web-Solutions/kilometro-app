import { OnboardAndAuthLayout } from "@/src/components/_common/layout/onboard";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/src/constants/definitions/auth/forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "react-native-paper";
import { useCallback } from "react";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import { useAuthErrorStore } from "@/src/store/auth-error";

export default function ForgotPasswordPage() {
  const { t } = useTranslation("auth", { keyPrefix: "forgot-password" });
  const { setError } = useAuthErrorStore();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(async (values: ForgotPasswordFormData) => {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email);

    if (error) {
      return setError(error.code ?? "unknown");
    }

    return router.navigate(
      `/auth/forgot-password/confirm?email=${values.email}`,
    );
  }, []);

  return (
    <OnboardAndAuthLayout
      title={t("title")}
      description={t("description")}
      showDivider
      links={[{ label: t("links.remembered"), onPress: () => router.back() }]}
    >
      <View style={styles.content}>
        <TextFormField<ForgotPasswordFormData>
          control={control}
          autoFocus
          name="email"
          mode="outlined"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          label={t("form.email.label")}
          keyboardType="email-address"
          returnKeyType="done"
          numberOfLines={1}
          onSubmitEditing={handleSubmit(onSubmit)}
        />
        <Button
          mode="contained"
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {t("form.submit")}
        </Button>
      </View>
    </OnboardAndAuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    marginVertical: 16,
  },
});
