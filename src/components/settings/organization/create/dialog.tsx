import { useTranslation } from "react-i18next";
import { Button, Card, Dialog, Portal, Text } from "react-native-paper";
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
import { generateOrganizationCode } from "@/src/utils/identifier";
import { useErrorStore } from "@/src/store/error";
import { getUser } from "@/src/hooks/auth/user";
import { useAppDispatch } from "@/src/store/hooks";
import { fetchRole, setRole } from "@/src/store/features/auth.slice";
import {
  addOrganization,
  setSelectedOrganization,
} from "@/src/store/features/organization.slice";
import { KeyboardAvoidingDialog } from "@/src/components/_common/keyboard-avoiding-dialog";

interface Props {
  onSuccess?: () => void;
}

export function CreateOrganizationDialog({ onSuccess }: Props) {
  const dispatch = useAppDispatch();

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

  const onSubmit = useCallback(async (values: CreateOrganizationFormData) => {
    const { data: organization, error: createOrganizationError } =
      await supabase
        .from("organizations")
        .insert({
          name: values.name,
          email: values.email,
          code: generateOrganizationCode(),
        })
        .select()
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
        is_accepted: true,
      });

    if (createMemberError) {
      console.error(createMemberError);
      return setError(t("form.errors.error-creating-member"));
    }

    await setDefaultOrganization(organization.id);

    dispatch(addOrganization(organization));
    dispatch(setSelectedOrganization(organization.id));
    dispatch(setRole("admin"));

    setIsVisible(false);

    if (onSuccess) {
      onSuccess();
    }
  }, []);

  return (
    <>
      <Card>
        <Card.Title title={t("card-title")} titleVariant="titleLarge" />
        <Card.Content>
          <Text>{t("card-description")}</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => setIsVisible(true)}>
            {t("button")}
          </Button>
        </Card.Actions>
      </Card>

      <Portal>
        <KeyboardAvoidingDialog
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        >
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
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("form.submit")}
            </Button>
          </Dialog.Actions>
        </KeyboardAvoidingDialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  dialog_content: {
    gap: 4,
  },
});
