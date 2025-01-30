import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal } from "react-native-paper";
import { useState } from "react";

export function JoinOrganizationDialog() {
  const { t } = useTranslation("settings", {
    keyPrefix: "new-organization.join",
  });

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button mode="contained" onPress={() => setIsVisible(true)}>
        {t("button")}
      </Button>
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="account-plus" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content></Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>
              {t("form.cancel")}
            </Button>
            <Button mode="contained" onPress={() => setIsVisible(false)}>
              {t("form.submit")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
