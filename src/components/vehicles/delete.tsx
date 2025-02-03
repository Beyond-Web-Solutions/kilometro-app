import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useDeleteVehicle } from "@/src/hooks/vehicles/delete";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  id: string;
  isVisible: boolean;
  hideDialog: () => void;
}

export function DeleteVehicleDialog({ id, isVisible, hideDialog }: Props) {
  const queryClient = useQueryClient();

  const { t } = useTranslation("vehicles", { keyPrefix: "delete" });

  const handleOnDeleteSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["vehicles"],
    });

    hideDialog();
  }, []);

  const { mutate, isPending } = useDeleteVehicle(handleOnDeleteSuccess);

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Icon icon="trash-can-outline" />
        <Dialog.Title>{t("title")}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{t("description")}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("cancel")}</Button>
          <Button
            onPress={() => mutate(id)}
            disabled={isPending}
            loading={isPending}
            mode="contained"
          >
            {t("submit")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
