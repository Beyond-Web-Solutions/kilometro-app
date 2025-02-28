import { Container } from "@/src/components/_common/layout/container";
import { useForm } from "react-hook-form";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/src/constants/definitions/auth/reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { useTranslation } from "react-i18next";
import { useCallback, useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "@/src/lib/supabase";
import { useAuthErrorStore } from "@/src/store/auth-error";
import { router, useNavigation } from "expo-router";

export default function ResetPasswordPage() {
  const navigation = useNavigation();

  const { setError } = useAuthErrorStore();

  const { t } = useTranslation("settings", {
    keyPrefix: "auth.reset-password.form",
  });

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = useCallback(async (values: ResetPasswordFormData) => {
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      return setError(error.code ?? "unknown");
    }

    return router.navigate("/(tabs)/settings");
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          {t("submit")}
        </Button>
      ),
    });
  }, []);

  return (
    <Container>
      <View style={styles.form}>
        <TextFormField<ResetPasswordFormData>
          control={control}
          name="password"
          mode="outlined"
          label={t("password.label")}
          onSubmitEditing={() => setFocus("confirm")}
          secureTextEntry
          autoFocus
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
        />
        <TextFormField<ResetPasswordFormData>
          control={control}
          name="confirm"
          mode="outlined"
          label={t("confirm-password.label")}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={handleSubmit(onSubmit)}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    gap: 8,
  },
});
