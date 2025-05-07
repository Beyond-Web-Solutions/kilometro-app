import { Keyboard, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src";
import {
  CreateOrganizationFormData,
  createOrganizationSchema,
} from "@/lib/definitions/onboarding/create-org";
import { useCallback } from "react";
import { TextInput } from "@/components/common/form/text-input";
import { Button } from "react-native-paper";
import { slugify } from "@/lib/utils/strings";
import { authClient } from "@/lib/auth/client";

interface Props {
  onSuccess?: () => void;
}

export function CreateOrganizationForm({ onSuccess }: Props) {
  const { t } = useTranslation("onboarding", { keyPrefix: "create-org.form" });

  const { handleSubmit, control, formState } = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = useCallback(
    async (values: CreateOrganizationFormData) => {
      Keyboard.dismiss();

      const slug = slugify(values.name);

      await authClient.organization.create({ name: values.name, slug });

      if (onSuccess) {
        onSuccess();
      }
    },
    [onSuccess],
  );

  return (
    <View style={styles.form}>
      <TextInput<CreateOrganizationFormData>
        name="name"
        control={control}
        label={t("name.label")}
        autoComplete="organization"
        textContentType="organizationName"
        autoCapitalize="words"
        returnKeyType="go"
        onSubmitEditing={handleSubmit(onSubmit)}
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
