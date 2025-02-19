import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { Linking } from "react-native";

interface Props {
  visible: boolean;
  hideDialog: () => void;
}

export function LocationSettingsDialog({ hideDialog, visible }: Props) {
  const { t } = useTranslation("common", { keyPrefix: "permissions.location" });

  const openSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.Content>
          <Text>{t("message")}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("cancel")}</Button>
          <Button onPress={openSettings}>{t("submit")}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
