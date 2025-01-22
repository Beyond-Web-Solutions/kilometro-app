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
import { Button, TextInput } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { useAuthErrorStore } from "@/store/auth-error";

export function SignInForm() {
  const { t } = useTranslation("auth", { keyPrefix: "sign-in.form" });
  const { setError } = useAuthErrorStore();

  const {
    control,
    setFocus,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFactorOneFormData>({
    resolver: zodResolver(signInFactorOneSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPeaking, setIsPeaking] = useState(false);

  const toggleIsPeaking = useCallback(() => {
    setIsPeaking((prev) => !prev);
  }, []);

  const onSubmit = useCallback(async (values: SignInFactorOneFormData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.code ?? "unknown");

      return;
    }
  }, []);

  return (
    <View style={styles.container}>
      <TextFormField<SignInFactorOneFormData>
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
      <TextFormField<SignInFactorOneFormData>
        control={control}
        name="password"
        mode="outlined"
        autoCapitalize="none"
        label={t("password.label")}
        placeholder={t("password.placeholder")}
        keyboardType={isPeaking ? "visible-password" : "default"}
        textContentType="password"
        returnKeyType="default"
        numberOfLines={1}
        secureTextEntry={!isPeaking}
        onSubmitEditing={handleSubmit(onSubmit)}
        right={
          <TextInput.Icon
            onPress={toggleIsPeaking}
            icon={isPeaking ? "eye-off" : "eye"}
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
