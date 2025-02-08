import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { deleteTrip } from "@/src/hooks/trip/delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAppDispatch } from "@/src/store/hooks";
import { deleteTrip as deleteTripAction } from "@/src/store/features/trips.slice";

interface Props {
  id: string;
  isVisible: boolean;
  hideDialog: () => void;
}

export function DeleteTripDialog({ id, isVisible, hideDialog }: Props) {
  const { t } = useTranslation("trips", { keyPrefix: "delete" });

  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-trip"],
    mutationFn: deleteTrip,
    onSuccess: async () => {
      dispatch(deleteTripAction(id));

      hideDialog();
      return router.back();
    },
  });

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Icon icon="alert" />
        <Dialog.Title>{t("dialog-title")}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{t("dialog-description")}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{t("cancel")}</Button>
          <Button
            mode="contained"
            disabled={isPending}
            loading={isPending}
            onPress={() => mutate(id)}
          >
            {t("submit")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
