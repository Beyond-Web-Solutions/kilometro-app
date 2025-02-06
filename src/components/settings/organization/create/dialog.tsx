import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrganizationFormData,
  createOrganizationSchema,
} from "@/src/constants/definitions/organizations/create";
import { StyleSheet } from "react-native";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { supabase } from "@/src/lib/supabase";
import { setDefaultOrganization } from "@/src/hooks/org/set-default";
import { useQueryClient } from "@tanstack/react-query";
import { generateOrganizationCode } from "@/src/utils/identifier";
import { useErrorStore } from "@/src/store/error";
import { getUser } from "@/src/hooks/auth/user";

export function CreateOrganizationDialog() {
  const queryClient = useQueryClient();

  const { setError } = useErrorStore();
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

  const onSubmit = useCallback(
    async (values: CreateOrganizationFormData) => {
      const { data: organization, error: createOrganizationError } =
        await supabase
          .from("organizations")
          .insert({
            name: values.name,
            email: values.email,
            code: generateOrganizationCode(),
          })
          .select("id")
          .single();

      if (createOrganizationError) {
        console.error(createOrganizationError);
        return setError(t("form.errors.error-creating-org"));
      }

      const user = await getUser();

      if (!user) {
        return setError(t("form.errors.no-user"));
      }

      const { error: createMemberError } = await supabase
        .from("organization_members")
        .insert({
          organization_id: organization.id,
          user_id: user.id,
          profile_id: user.id,
        });

      if (createMemberError) {
        console.error(createMemberError);
        return setError(t("form.errors.error-creating-member"));
      }

      await setDefaultOrganization(organization.id);

      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["role"] });

      setIsVisible(false);
    },
    [queryClient],
  );

  return (
    <>
      <Button mode="contained" onPress={() => setIsVisible(true)}>
        {t("button")}
      </Button>
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="office-building" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content style={styles.dialog_content}>
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
