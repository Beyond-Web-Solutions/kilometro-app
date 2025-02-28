import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";

interface Props {
  isVisible: boolean;
  hideDialog: () => void;
}

export function CreateVehicleDialog({ isVisible, hideDialog }: Props) {
  const { t } = useTranslation("vehicles", { keyPrefix: "no-vehicles" });

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.Content>
          <Text>{t("description")}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("cancel")}</Button>
          <Link href="/(tabs)/vehicles" asChild>
            <Button onPress={hideDialog}>{t("cta")}</Button>
          </Link>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
