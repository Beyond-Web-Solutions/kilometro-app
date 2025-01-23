import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import {
  SignInFactorOneFormData,
  signInFactorOneSchema,
} from "@/constants/definitions/auth/sign-in/factor-one";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextFormField } from "@/components/_common/form/text-input";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { Button, Portal, Snackbar, TextInput } from "react-native-paper";
import {
  SignUpFormData,
  signUpSchema,
} from "@/constants/definitions/auth/sign-up";
import { supabase } from "@/lib/supabase";
import { useAuthErrorStore } from "@/store/auth-error";
import { router } from "expo-router";

export function SignUpForm() {
  const { t } = useTranslation("auth", { keyPrefix: "sign-up.form" });
  const { setError } = useAuthErrorStore();

  const {
    control,
    setFocus,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
    },
  });

  const [isPeakingPassword, setIsPeakingPassword] = useState(false);
  const [isPeakingConfirmPassword, setIsPeakingConfirmPassword] =
    useState(false);

  const toggleIsPeakingPassword = useCallback(() => {
    setIsPeakingPassword((prev) => !prev);
  }, []);

  const toggleIsPeakingConfirmPassword = useCallback(() => {
    setIsPeakingConfirmPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(async (values: SignUpFormData) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      return setError(error.code ?? "unknown");
    }

    return router.navigate("/(auth)/otp");
  }, []);

  return (
    <View style={styles.container}>
      <TextFormField<SignUpFormData>
        control={control}
        name="email"
        mode="outlined"
        autoCapitalize="none"
        label={t("email.label")}
        placeholder={t("email.placeholder")}
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        numberOfLines={1}
        onSubmitEditing={() => setFocus("password")}
      />
      <TextFormField<SignUpFormData>
        control={control}
        name="password"
        mode="outlined"
        autoCapitalize="none"
        label={t("password.label")}
        placeholder={t("password.placeholder")}
        keyboardType={isPeakingPassword ? "visible-password" : "default"}
        textContentType="password"
        returnKeyType="next"
        numberOfLines={1}
        secureTextEntry={!isPeakingPassword}
        onSubmitEditing={() => setFocus("confirm")}
        right={
          <TextInput.Icon
            onPress={toggleIsPeakingPassword}
            icon={isPeakingPassword ? "eye-off" : "eye"}
          />
        }
      />
      <TextFormField<SignUpFormData>
        control={control}
        name="confirm"
        mode="outlined"
        autoCapitalize="none"
        label={t("confirm.label")}
        placeholder={t("confirm.placeholder")}
        keyboardType={isPeakingConfirmPassword ? "visible-password" : "default"}
        textContentType="password"
        returnKeyType="default"
        numberOfLines={1}
        secureTextEntry={!isPeakingConfirmPassword}
        onSubmitEditing={handleSubmit(onSubmit)}
        right={
          <TextInput.Icon
            onPress={toggleIsPeakingConfirmPassword}
            icon={isPeakingConfirmPassword ? "eye-off" : "eye"}
          />
        }
      />
      <Button
        style={styles.button}
        mode="contained"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        {t("submit")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    gap: 6,
  },
  button: {
    marginTop: 4,
  },
});
