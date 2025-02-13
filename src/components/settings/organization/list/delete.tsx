import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/store/hooks";
import { Button, Dialog, List, Portal, Text } from "react-native-paper";
import { useState } from "react";
import { useDeleteOrganization } from "@/src/hooks/org/delete";
import { Redirect, router } from "expo-router";
import { organizationsSelector } from "@/src/store/features/organization.slice";

export function DeleteOrganizationSetting() {
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.delete",
  });

  const orgCount = useAppSelector(organizationsSelector.selectTotal);
  const org = useAppSelector((state) => state.organizations.selected);
  const role = useAppSelector((state) => state.auth.role);

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const { isPending, mutate } = useDeleteOrganization(org!, () => {
    if (orgCount === 0) {
      // Redirect to the onboard page if there are no organizations left
      return router.replace("/onboard");
    } else {
      // Redirect to the first organization if there are still organizations
      return router.replace("/onboard/switch-org");
    }
  });

  if (role !== "admin" || !org) {
    return <Redirect href="/onboard" />;
  }

  return (
    <>
      <List.Item
        title={t("title")}
        left={(props) => <List.Icon {...props} icon="delete" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => setIsDialogVisible(true)}
      />
      {isDialogVisible && (
        <Portal>
          <Dialog
            visible={isDialogVisible}
            onDismiss={() => setIsDialogVisible(false)}
          >
            <Dialog.Icon icon="delete" />
            <Dialog.Title>{t("dialog-title")}</Dialog.Title>
            <Dialog.Content>
              <Text>{t("dialog-description")}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setIsDialogVisible(false)}>
                {t("cancel")}
              </Button>
              <Button
                mode="contained"
                loading={isPending}
                disabled={isPending}
                onPress={() => mutate()}
              >
                {t("submit")}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </>
  );
}
