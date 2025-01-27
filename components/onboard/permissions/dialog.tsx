import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { Linking, StyleSheet } from "react-native";

export function OnboardPermissionsDialog() {
  const { t } = useTranslation("onboard", { keyPrefix: "permissions" });

  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return (
    <>
      <Button mode="contained" onPress={toggleDialog}>
        {t("buttons.give-permission")}
      </Button>
      <Portal>
        <Dialog visible={isOpen} onDismiss={toggleDialog}>
          <Dialog.Icon icon="map-marker-alert-outline" />
          <Dialog.Title style={styles.text}>{t("dialog.title")}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.text}>{t("dialog.description")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggleDialog}>{t("dialog.close")}</Button>
            <Button mode="contained" onPress={() => Linking.openSettings()}>
              {t("dialog.settings")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
});
