import { useTranslation } from "react-i18next";
import { EmailOtpType } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import {
  EmailOtpFormData,
  emailOtpSchema,
} from "@/src/constants/definitions/auth/otp/email";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet, View } from "react-native";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { Button, TextInput } from "react-native-paper";
import { useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import { useAuthErrorStore } from "@/src/store/auth-error";

interface Props {
  email: string;
  type: EmailOtpType;

  onSuccess: () => void;
}

export function VerifyEmailOtpForm({ email, type, onSuccess }: Props) {
  const { t } = useTranslation("auth", { keyPrefix: "otp.form" });
  const { setError } = useAuthErrorStore();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EmailOtpFormData>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: {
      email,
      type,
      otp: "",
    },
  });

  const onSubmit = useCallback(async (data: EmailOtpFormData) => {
    const { error } = await supabase.auth.verifyOtp({
      email: data.email,
      type: data.type,
      token: data.otp,
    });

    if (error) {
      return setError(error.code ?? "unknown");
    }

    onSuccess();
  }, []);

  return (
    <View style={styles.container}>
      <TextFormField<EmailOtpFormData>
        control={control}
        name="otp"
        mode="outlined"
        autoCapitalize="none"
        label={t("otp.label")}
        placeholder={t("otp.placeholder")}
        keyboardType="numeric"
        textContentType="oneTimeCode"
        returnKeyType="default"
        numberOfLines={1}
        onSubmitEditing={handleSubmit(onSubmit)}
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
