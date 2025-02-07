import { useTranslation } from "react-i18next";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useState } from "react";
import { deleteTrip } from "@/src/hooks/trip/delete";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/src/store/hooks";
import { stopTrip } from "@/src/store/features/current-trip.slice";
import { stopLocationUpdatesAsync } from "expo-location";

interface Props {
  id: string;
  onSubmit: () => void;
}

export function CancelTripDialog({ id, onSubmit }: Props) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("map", { keyPrefix: "stop-trip-sheet.cancel" });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTrip,
    onSuccess: async () => {
      dispatch(stopTrip());

      await stopLocationUpdatesAsync("TRACK_BACKGROUND_LOCATION");

      setIsVisible(false);
      onSubmit();
    },
  });

  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button mode="contained-tonal" onPress={() => setIsVisible(true)}>
        {t("button")}
      </Button>
      <Portal>
        <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t("dialog-description")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>{t("cancel")}</Button>
            <Button
              mode="contained"
              onPress={() => mutate(id)}
              disabled={isPending}
              loading={isPending}
            >
              {t("submit")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
