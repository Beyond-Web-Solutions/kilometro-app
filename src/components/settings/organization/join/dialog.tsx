import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  JoinOrganizationFormData,
  joinOrganizationSchema,
} from "@/src/constants/definitions/organizations/join";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyleSheet } from "react-native";
import { TextFormField } from "@/src/components/_common/form/text-input";
import { supabase } from "@/src/lib/supabase";
import { useErrorStore } from "@/src/store/error";
import { getUser } from "@/src/hooks/auth/user";
import { getOrganizationIds } from "@/src/hooks/org/ids";
import { setDefaultOrganization } from "@/src/hooks/org/set-default";
import { useQueryClient } from "@tanstack/react-query";
import { refetchVehicles } from "@/src/store/features/vehicle.slice";
import { refetchTrips } from "@/src/store/features/trips.slice";
import { useAppDispatch } from "@/src/store/hooks";

export function JoinOrganizationDialog() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const { setError } = useErrorStore();

  const { t } = useTranslation("settings", {
    keyPrefix: "new-organization.join",
  });

  const [isVisible, setIsVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<JoinOrganizationFormData>({
    resolver: zodResolver(joinOrganizationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = useCallback(async (values: JoinOrganizationFormData) => {
    const { data } = await supabase
      .from("organizations")
      .select("id")
      .eq("code", values.code)
      .maybeSingle();

    if (!data) {
      return setError(t("errors.org-not-found"));
    }

    const user = await getUser();

    if (!user) {
      return setError(t("errors.no-user"));
    }

    const existingOrganizationIds = await getOrganizationIds();

    if (existingOrganizationIds.includes(data.id)) {
      return setError(t("errors.already-member"));
    }

    const { error: errorAddingOrgMember } = await supabase
      .from("organization_members")
      .insert({
        organization_id: data.id,
        user_id: user.id,
        profile_id: user.id,
        role: "driver",
      });

    if (errorAddingOrgMember) {
      return setError(t("errors.error-adding-member"));
    }

    await setDefaultOrganization(data.id);

    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
    queryClient.invalidateQueries({ queryKey: ["role"] });

    dispatch(refetchVehicles());
    dispatch(refetchTrips());

    setIsVisible(false);
  }, []);

  return (
    <>
      <Button mode="contained" onPress={() => setIsVisible(true)}>
        {t("button")}
      </Button>
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="account-plus" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content style={styles.dialog_content}>
            <TextFormField<JoinOrganizationFormData>
              control={control}
              autoFocus
              autoCapitalize="characters"
              name="code"
              mode="outlined"
              label={t("organization-code.label")}
              keyboardType="default"
              returnKeyType="next"
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
