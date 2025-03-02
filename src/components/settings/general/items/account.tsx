import { Button, Dialog, List, Portal } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  UpsertProfileFormData,
  upsertProfileSchema,
} from "@/src/constants/definitions/profile/upsert";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { TextFormField } from "../../../_common/form/text-input";
import { getUser } from "@/src/hooks/auth/user";
import { useErrorStore } from "@/src/store/error";
import { supabase } from "@/src/lib/supabase";
import { getUserProfileDefaultValues } from "@/src/hooks/profile/form";
import { useAppDispatch } from "@/src/store/hooks";
import { setProfile } from "@/src/store/features/auth.slice";
import { KeyboardAvoidingDialog } from "@/src/components/_common/keyboard-avoiding-dialog";

export function AccountSettings() {
  const dispatch = useAppDispatch();

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

    const { error, data } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          first_name: values.first_name,
          last_name: values.last_name,
        },
        {
          onConflict: "user_id",
        },
      )
      .select()
      .single();

    if (error) {
      console.error(error);

      return setError(t("dialog.form.errors.error-saving-user"));
    }

    dispatch(setProfile(data));
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
        <KeyboardAvoidingDialog
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        >
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
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("dialog.submit")}
            </Button>
          </Dialog.Actions>
        </KeyboardAvoidingDialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 8,
  },
});
