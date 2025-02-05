import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useDeleteOrganizationMember } from "@/src/hooks/org-members/delete";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
  id: string;
}

export function DeleteOrganizationMemberDialog({
  id,
  isVisible,
  hideDialog,
}: Props) {
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.members.delete",
  });

  const { isPending, mutate } = useDeleteOrganizationMember(hideDialog);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Icon icon="account-remove" />
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{t("description")}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("cancel")}</Button>
          <Button
            mode="contained"
            loading={isPending}
            disabled={isPending}
            onPress={() => mutate(id)}
          >
            {t("submit")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
