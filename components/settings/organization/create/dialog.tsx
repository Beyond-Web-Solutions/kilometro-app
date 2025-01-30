import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrganizationFormData,
  createOrganizationSchema,
} from "@/constants/definitions/onboard/create-org";
import { StyleSheet } from "react-native";
import { TextFormField } from "@/components/_common/form/text-input";
import { supabase } from "@/lib/supabase";
import { setDefaultOrganization } from "@/hooks/org/set-default";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

export function CreateOrganizationDialog() {
  const queryClient = useQueryClient();

  const { t } = useTranslation("settings", {
    keyPrefix: "new-organization.create",
  });

  const [isVisible, setIsVisible] = useState(false);

  const {
    control,
    setFocus,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = useCallback(async (values: CreateOrganizationFormData) => {
    const { data, error } = await supabase.functions.invoke("create-customer", {
      body: values,
    });

    if (error) {
      console.error(error);
      return;
    }

    if (data.ok) {
      await setDefaultOrganization(data.id);

      await queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      setIsVisible(false);
    }
  }, []);

  return (
    <>
      <Button mode="contained" onPress={() => setIsVisible(true)}>
        {t("button")}
      </Button>
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="office-building" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content>
            <TextFormField<CreateOrganizationFormData>
              control={control}
              autoFocus
              name="name"
              mode="outlined"
              autoCapitalize="words"
              autoComplete="organization"
              label={t("form.name.label")}
              keyboardType="default"
              returnKeyType="next"
              numberOfLines={1}
              onSubmitEditing={() => setFocus("email")}
            />
            <TextFormField<CreateOrganizationFormData>
              control={control}
              name="email"
              mode="outlined"
              autoCapitalize="none"
              autoComplete="email"
              label={t("form.email.label")}
              keyboardType="email-address"
              returnKeyType="done"
              textContentType="emailAddress"
              numberOfLines={1}
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>
              {t("form.cancel")}
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("form.submit")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  dialog_content: {
    gap: 4,
  },
});
