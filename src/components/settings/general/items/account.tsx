import { Button, Dialog, List, Portal } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  UpsertProfileFormData,
  upsertProfileSchema,
} from "@/src/constants/definitions/profile/upsert";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet } from "react-native";
import { TextFormField } from "../../../_common/form/text-input";
import { getUser } from "@/src/hooks/auth/user";
import { useErrorStore } from "@/src/store/error";
import { supabase } from "@/src/lib/supabase";
import { getUserProfileDefaultValues } from "@/src/hooks/profile/form";

export function AccountSettings() {
  const { setError } = useErrorStore();

  const { t } = useTranslation("settings", {
    keyPrefix: "general.account",
  });

  const [isVisible, setIsVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isSubmitting },
  } = useForm<UpsertProfileFormData>({
    resolver: zodResolver(upsertProfileSchema),
    defaultValues: getUserProfileDefaultValues,
  });

  const onSubmit = useCallback(async (values: UpsertProfileFormData) => {
    const user = await getUser();

    if (!user) {
      return setError(t("dialog.form.errors.no-user"));
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        first_name: values.first_name,
        last_name: values.last_name,
      },
      {
        onConflict: "user_id",
      },
    );

    if (error) {
      console.error(error);

      return setError(t("dialog.form.errors.error-saving-user"));
    }

    setIsVisible(false);
  }, []);

  return (
    <>
      <List.Item
        title={t("title")}
        left={(props) => <List.Icon {...props} icon="account" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => setIsVisible(true)}
      />

      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="account" />
          <Dialog.Title>{t("dialog.title")}</Dialog.Title>
          <Dialog.Content style={styles.form}>
            <TextFormField<UpsertProfileFormData>
              control={control}
              name="first_name"
              autoComplete="given-name"
              autoCapitalize="words"
              returnKeyType="next"
              mode="outlined"
              label={t("dialog.form.first-name.label")}
              textContentType="givenName"
              onSubmitEditing={() => setFocus("last_name")}
              autoFocus
            />
            <TextFormField<UpsertProfileFormData>
              control={control}
              name="last_name"
              autoComplete="family-name"
              autoCapitalize="words"
              mode="outlined"
              returnKeyType="done"
              textContentType="familyName"
              label={t("dialog.form.last-name.label")}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>
              {t("dialog.cancel")}
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("dialog.submit")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 8,
  },
});
