import { Button, Dialog, Portal, RadioButton } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { useUpdateOrganizationMember } from "@/src/hooks/org-members/update";
import { useAppDispatch } from "@/src/store/hooks";
import { updateOrganizationMember } from "@/src/store/features/organization-members.slice";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
  role: "driver" | "admin";
  id: string;
}

export function UpdateOrganizationMemberDialog({
  isVisible,
  hideDialog,
  id,
  role: defaultRole,
}: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.members.edit",
  });

  const [role, setRole] = useState<string>(defaultRole);

  const { isPending, mutate } = useUpdateOrganizationMember((data) => {
    hideDialog();

    if (data) {
      dispatch(
        updateOrganizationMember({
          id: data.id,
          changes: data,
        }),
      );
    }
  });

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Icon icon="account-edit" />
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.ScrollArea style={styles.results_container}>
          <ScrollView>
            <RadioButton.Group value={role} onValueChange={setRole}>
              <RadioButton.Item
                mode="android"
                label={t("options.driver")}
                value="driver"
                style={styles.item}
              />
              <RadioButton.Item
                mode="android"
                label={t("options.admin")}
                value="admin"
                style={styles.item}
              />
            </RadioButton.Group>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("cancel")}</Button>
          <Button
            mode="contained"
            loading={isPending}
            disabled={isPending}
            onPress={() =>
              mutate({
                id,
                role: role as "driver" | "admin",
                is_accepted: true,
              })
            }
          >
            {t("submit")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  results_container: {
    paddingHorizontal: 0,
    marginTop: 8,
  },
  item: {
    marginHorizontal: 8,
  },
});
