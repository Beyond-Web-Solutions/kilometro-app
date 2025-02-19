import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  Divider,
  List,
  Portal,
  Switch,
  Text,
} from "react-native-paper";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAppSelector } from "@/src/store/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwitchFormField } from "@/src/components/_common/form/switch";
import { deleteOrganization } from "@/src/hooks/org/delete";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";

export function DeleteAccountSetting() {
  const { t } = useTranslation("settings", { keyPrefix: "delete-account" });

  const org = useAppSelector((state) => state.organizations.selected);
  const role = useAppSelector((state) => state.auth.role);

  const [isVisible, setIsVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      delete_org: false,
    },
  });

  const onSubmit = useCallback(
    async (values: FormData) => {
      if (values.delete_org && role === "admin" && org) {
        await deleteOrganization(org);
      }

      await supabase.rpc("delete_user");
      await supabase.auth.signOut({ scope: "global" });

      return router.replace("/auth/sign-in");
    },
    [role, org],
  );

  return (
    <>
      <List.Item
        title={t("list-item")}
        left={(props) => <List.Icon {...props} icon="delete" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => setIsVisible(true)}
      />
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="delete" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content style={styles.content}>
            <Text>{t("dialog-description")}</Text>
            {role === "admin" && (
              <>
                <Divider />
                <View style={styles.switch_container}>
                  <SwitchFormField<FormData>
                    label={t("also-delete-org")}
                    name="delete_org"
                    control={control}
                  />
                </View>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>{t("cancel")}</Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {t("submit")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
  },
  switch_container: {
    paddingTop: 8,
  },
});

const schema = z.object({
  delete_org: z.boolean(),
});

type FormData = z.infer<typeof schema>;
