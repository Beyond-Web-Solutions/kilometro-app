import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { router } from "expo-router";
import { useAppDispatch } from "@/src/store/hooks";
import { deleteVehicle } from "@/src/store/features/vehicle.slice";
import { useDeleteVehicle } from "@/src/hooks/vehicles/delete";

interface Props {
  id: string;
  isVisible: boolean;
  hideDialog: () => void;
}

export function DeleteVehicleDialog({ id, isVisible, hideDialog }: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("vehicles", { keyPrefix: "delete" });

  const handleOnDeleteSuccess = useCallback(async () => {
    dispatch(deleteVehicle(id));

    hideDialog();

    return router.back();
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
